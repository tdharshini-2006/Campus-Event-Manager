const Team = require('../models/Team');
const Event = require('../models/Event');
const User = require('../models/User');
const RSVP = require('../models/RSVP');
const { notifyAttendeeUpdate } = require('../socket/socket');

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private (Student)
const createTeam = async (req, res, next) => {
  try {
    const { name, eventId, members, invites, invitedEmails } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email ? req.user.email.toLowerCase() : '';

    const event = await Event.findById(eventId);
    if (!event || !event.allowTeamRegistration) {
      return res.status(400).json({ message: 'Event does not support team registration' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot register for a cancelled event' });
    }

    // Check individual RSVP
    const existingRSVP = await RSVP.findOne({ user: userId, event: eventId });
    if (existingRSVP) {
      return res.status(400).json({ message: 'You have already registered individually. Cancel your RSVP to create a team.' });
    }

    // Check if user is already leading a team for this event
    const existingTeam = await Team.findOne({ leader: userId, event: eventId });
    if (existingTeam) {
      return res.status(400).json({ message: 'You are already leading a team for this event.' });
    }

    // Check team name uniqueness
    const nameCheck = await Team.findOne({ name: name.trim(), event: eventId });
    if (nameCheck) {
      return res.status(400).json({ message: 'Team name is already taken for this event.' });
    }

    let status = 'confirmed';
    if (event.attendeeCount >= event.capacity) {
      status = 'waitlisted';
    }

    const initialMembers = [];
    const minMembers = event.minTeamSize || 3;
    const maxMembers = event.maxTeamSize || 5;

    // Handle members submitted directly as array of member objects [{ name, email, studentId }]
    if (Array.isArray(members) && members.length > 0) {
      // Clean and validate members (excluding leader if re-added)
      const seenEmails = new Set([userEmail]);

      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m || !m.name || !m.email) continue;
        const cleanEmail = m.email.trim().toLowerCase();
        const cleanName = m.name.trim();
        const cleanStudentId = m.studentId ? m.studentId.trim() : '';

        if (!cleanEmail || !cleanName) continue;
        if (cleanEmail === userEmail) continue; // Leader is already the leader
        if (seenEmails.has(cleanEmail)) {
          return res.status(400).json({ message: `Duplicate email detected: ${cleanEmail}` });
        }
        seenEmails.add(cleanEmail);

        // Check if user exists in db
        const invitedUser = await User.findOne({ email: cleanEmail });

        initialMembers.push({
          user: invitedUser ? invitedUser._id : undefined,
          name: cleanName,
          email: cleanEmail,
          studentId: cleanStudentId || (invitedUser?.studentId || ''),
          department: m.department ? m.department.trim() : (invitedUser?.department || ''),
          status: 'confirmed',
          joinedAt: new Date()
        });
      }
    } else {
      // Fallback: array of email strings
      const emailList = invitedEmails || invites || [];
      if (Array.isArray(emailList) && emailList.length > 0) {
        const seenEmails = new Set([userEmail]);
        for (const email of emailList) {
          if (!email || !email.trim()) continue;
          const cleanEmail = email.trim().toLowerCase();
          if (cleanEmail === userEmail || seenEmails.has(cleanEmail)) continue;
          seenEmails.add(cleanEmail);

          const invitedUser = await User.findOne({ email: cleanEmail });
          initialMembers.push({
            user: invitedUser ? invitedUser._id : undefined,
            name: invitedUser ? invitedUser.name : cleanEmail.split('@')[0],
            email: cleanEmail,
            studentId: invitedUser?.studentId || '',
            status: 'confirmed',
            joinedAt: new Date()
          });
        }
      }
    }

    // Total team size = 1 (leader) + initialMembers.length
    const totalTeamSize = 1 + initialMembers.length;
    if (totalTeamSize < 3 || totalTeamSize < minMembers) {
      return res.status(400).json({
        message: `Team registration requires at least 3 members (including team leader). Currently: ${totalTeamSize} members.`
      });
    }

    if (totalTeamSize > 5 && totalTeamSize > maxMembers) {
      return res.status(400).json({
        message: `Team registration allows a maximum of 5 members. Currently: ${totalTeamSize} members.`
      });
    }

    const team = await Team.create({
      name: name.trim(),
      event: eventId,
      leader: userId,
      status,
      members: initialMembers
    });

    if (status === 'confirmed') {
      event.attendeeCount += 1;
    } else {
      event.waitlistCount += 1;
    }
    await event.save();

    notifyAttendeeUpdate(eventId, {
      eventId: event._id,
      attendeeCount: event.attendeeCount,
      waitlistCount: event.waitlistCount,
      capacity: event.capacity,
    });

    res.status(201).json({
      message: status === 'confirmed' ? 'Team created successfully!' : 'Event capacity reached. Team waitlisted.',
      team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite a member by email
// @route   POST /api/teams/:id/invite
// @access  Private (Team Leader)
const inviteMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const teamId = req.params.id;
    const userId = req.user._id;

    const team = await Team.findById(teamId).populate('event');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the team leader can invite members' });
    }

    const invitee = await User.findOne({ email });
    if (!invitee) return res.status(404).json({ message: 'User not found' });

    if (invitee._id.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot invite yourself' });
    }

    // Check size limit (leader + members)
    const currentSize = 1 + team.members.length;
    if (currentSize >= team.event.maxTeamSize) {
      return res.status(400).json({ message: `Maximum team size is ${team.event.maxTeamSize}` });
    }

    // Check if already in team
    const alreadyInTeam = team.members.find(m => m.user.toString() === invitee._id.toString());
    if (alreadyInTeam) return res.status(400).json({ message: 'User is already invited or in the team' });

    team.members.push({ user: invitee._id, status: 'pending' });
    await team.save();

    res.json({ message: 'Invitation sent', team });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept team invite
// @route   POST /api/teams/:id/accept
// @access  Private
const acceptInvite = async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const userId = req.user._id;

    const team = await Team.findById(teamId).populate('event');
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const memberIndex = team.members.findIndex(m => m.user.toString() === userId.toString() && m.status === 'pending');
    if (memberIndex === -1) return res.status(400).json({ message: 'No pending invitation found for this team' });

    const event = team.event;

    // Check individual RSVP
    const existingRSVP = await RSVP.findOne({ user: userId, event: event._id });
    if (existingRSVP) {
      return res.status(400).json({ message: 'You have already registered individually for this event. Cancel RSVP first.' });
    }

    // Check capacity
    let memberStatus = team.status; // inherit team's status generally, but if event is full...
    if (team.status === 'confirmed' && event.attendeeCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity.' });
    }

    team.members[memberIndex].status = 'accepted';
    await team.save();

    if (team.status === 'confirmed') {
      event.attendeeCount += 1;
    } else {
      event.waitlistCount += 1;
    }
    await event.save();

    notifyAttendeeUpdate(event._id, {
      eventId: event._id,
      attendeeCount: event.attendeeCount,
      waitlistCount: event.waitlistCount,
      capacity: event.capacity,
    });

    res.json({ message: 'Joined team successfully', team });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's teams
// @route   GET /api/teams/my-teams
// @access  Private
const getMyTeams = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const teams = await Team.find({
      $or: [
        { leader: userId },
        { 'members.user': userId }
      ]
    }).populate('event').populate('leader', 'name email').populate('members.user', 'name email');
    
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams (Admin)
// @route   GET /api/teams
// @access  Private (Admin)
const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate('event', 'title category date')
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .sort({ registeredAt: -1 });
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

// @desc    Reject team invite
// @route   POST /api/teams/:id/reject
// @access  Private
const rejectInvite = async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const userId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const memberIndex = team.members.findIndex(m => m.user.toString() === userId.toString() && m.status === 'pending');
    if (memberIndex === -1) return res.status(400).json({ message: 'No pending invitation found for this team' });

    team.members[memberIndex].status = 'rejected';
    await team.save();

    res.json({ message: 'Invitation rejected', team });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  inviteMember,
  acceptInvite,
  rejectInvite,
  getMyTeams,
  getAllTeams,
};

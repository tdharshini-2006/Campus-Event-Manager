const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  createTeam,
  inviteMember,
  acceptInvite,
  rejectInvite,
  getMyTeams,
  getAllTeams
} = require('../controllers/team.controller');

const router = express.Router();

router.post('/', protect, createTeam);
router.get('/my-teams', protect, getMyTeams);
router.post('/:id/invite', protect, inviteMember);
router.post('/:id/accept', protect, acceptInvite);
router.post('/:id/reject', protect, rejectInvite);

// Admin route
router.get('/', protect, authorize('admin'), getAllTeams);

module.exports = router;

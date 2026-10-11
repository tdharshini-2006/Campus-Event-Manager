import React, { useState } from 'react';
import { X, Users, Mail, Plus, Trash2, User, Hash, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

const TeamRegistrationModal = ({ event, currentUser, onClose, onSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // The leader is member 1. 2 teammates gives 3 members total (min required: 3, max: 5).
  const [teammates, setTeammates] = useState([
    { name: '', email: '', studentId: '' },
    { name: '', email: '', studentId: '' },
  ]);

  const totalMembers = 1 + teammates.length;
  const minTeamSize = Math.max(3, event?.minTeamSize || 3);
  const maxTeamSize = Math.min(5, event?.maxTeamSize || 5);

  const handleTeammateChange = (index, field, value) => {
    setErrorMessage('');
    const updated = [...teammates];
    updated[index] = { ...updated[index], [field]: value };
    setTeammates(updated);
  };

  const addTeammate = () => {
    setErrorMessage('');
    if (totalMembers < maxTeamSize) {
      setTeammates([...teammates, { name: '', email: '', studentId: '' }]);
    }
  };

  const removeTeammate = (index) => {
    setErrorMessage('');
    if (totalMembers > minTeamSize) {
      const updated = [...teammates];
      updated.splice(index, 1);
      setTeammates(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!teamName.trim()) {
      setErrorMessage('Please enter a team name');
      return;
    }

    if (totalMembers < minTeamSize || totalMembers < 3) {
      setErrorMessage(`A minimum of 3 members is required for team registration (including team leader).`);
      return;
    }

    if (totalMembers > maxTeamSize || totalMembers > 5) {
      setErrorMessage(`A maximum of 5 members is allowed for team registration.`);
      return;
    }

    const leaderEmail = currentUser?.email?.toLowerCase().trim() || '';
    const emailSet = new Set(leaderEmail ? [leaderEmail] : []);

    for (let i = 0; i < teammates.length; i++) {
      const member = teammates[i];
      const memberNum = i + 2;

      if (!member.name.trim()) {
        setErrorMessage(`Please enter the full name for Member ${memberNum}`);
        return;
      }

      if (!member.email.trim()) {
        setErrorMessage(`Please enter a valid email address for Member ${memberNum}`);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(member.email.trim())) {
        setErrorMessage(`Please enter a valid email format for Member ${memberNum} (${member.email})`);
        return;
      }

      const cleanEmail = member.email.trim().toLowerCase();
      if (cleanEmail === leaderEmail) {
        setErrorMessage(`Member ${memberNum} cannot have the same email as the team leader.`);
        return;
      }

      if (emailSet.has(cleanEmail)) {
        setErrorMessage(`Duplicate email detected: ${cleanEmail}. Each member must have a unique email.`);
        return;
      }

      emailSet.add(cleanEmail);
    }

    try {
      setSubmitting(true);
      await onSubmit({
        name: teamName.trim(),
        eventId: event._id,
        members: teammates.map(t => ({
          name: t.name.trim(),
          email: t.email.trim().toLowerCase(),
          studentId: t.studentId.trim(),
        })),
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit team registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-[#54463C]/40 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-theme-card w-full max-w-2xl rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh] border border-theme-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-border flex justify-between items-center bg-theme-section">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-btn text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-theme-heading">Student Team Registration</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-theme-btn/10 text-theme-heading border border-theme-border">
                  3–5 Members
                </span>
              </div>
              <p className="text-xs text-theme-muted font-medium">Apply as a student leader for 3 to 5 team members at once</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-theme-main rounded-xl text-theme-muted hover:text-theme-heading transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Event Context Banner */}
          <div className="p-4 rounded-2xl bg-theme-section border border-theme-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">Target Event</span>
              <h3 className="text-base font-extrabold text-theme-heading">{event?.title}</h3>
              <p className="text-xs text-theme-muted">{event?.category} • {event?.time} • {event?.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-theme-card text-theme-heading border border-theme-border shadow-sm">
                Team Size: {minTeamSize} – {maxTeamSize} Members
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Team Name Input */}
          <div>
            <label className="block text-xs font-bold text-theme-heading uppercase tracking-wider mb-1.5">
              Team Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => { setErrorMessage(''); setTeamName(e.target.value); }}
              className="w-full px-4 py-2.5 bg-theme-main border border-theme-border rounded-xl text-sm font-semibold text-theme-heading placeholder:text-theme-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors"
              placeholder="e.g. Cyber Guardians, Code Mavericks"
            />
          </div>

          {/* Member 1: Team Leader (Current User) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-theme-heading uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Member 1: Team Leader (You)
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Primary Applicant
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-theme-main border border-theme-border grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="block text-[10px] font-bold text-theme-muted uppercase">Leader Name</span>
                <p className="text-xs font-bold text-theme-heading truncate">{currentUser?.name || 'Current User'}</p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-theme-muted uppercase">Email</span>
                <p className="text-xs font-semibold text-theme-heading truncate">{currentUser?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-theme-muted uppercase">Roll No / Student ID</span>
                <p className="text-xs font-semibold text-theme-muted truncate">{currentUser?.studentId || 'Registered'}</p>
              </div>
            </div>
          </div>

          {/* Teammates Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-theme-heading uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  Teammates ({teammates.length} Added • Total {totalMembers} Members)
                </label>
                <p className="text-[11px] text-theme-muted">You can apply for 3 to 5 total members in this team registration</p>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                totalMembers >= 3 && totalMembers <= 5
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {totalMembers} / {maxTeamSize} Members
              </span>
            </div>

            {/* Teammates Form Fields */}
            <div className="space-y-3">
              {teammates.map((teammate, idx) => {
                const memberNumber = idx + 2;
                const isRequired = memberNumber <= 3; // First 2 teammates are required to hit 3 members minimum

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-theme-main border border-theme-border space-y-3 relative transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-theme-section border border-theme-border text-theme-heading text-xs font-bold flex items-center justify-center">
                          {memberNumber}
                        </span>
                        <span className="text-xs font-bold text-theme-heading">
                          Member {memberNumber}
                        </span>
                        {isRequired ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Required (Min 3)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-theme-section text-theme-muted border border-theme-border">
                            Optional
                          </span>
                        )}
                      </div>

                      {/* Remove Button (Allowed only when total members > 3) */}
                      {totalMembers > minTeamSize && (
                        <button
                          type="button"
                          onClick={() => removeTeammate(idx)}
                          title="Remove member"
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-theme-heading mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-theme-muted" />
                          <input
                            type="text"
                            required
                            value={teammate.name}
                            onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-theme-card border border-theme-border rounded-xl text-xs font-semibold text-theme-heading placeholder:text-theme-muted focus:outline-none focus:border-theme-accent transition-colors"
                            placeholder="Student Name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-theme-heading mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-theme-muted" />
                          <input
                            type="email"
                            required
                            value={teammate.email}
                            onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-theme-card border border-theme-border rounded-xl text-xs font-semibold text-theme-heading placeholder:text-theme-muted focus:outline-none focus:border-theme-accent transition-colors"
                            placeholder="student@campus.edu"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-theme-heading mb-1">
                          Roll No / ID <span className="text-theme-muted font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-theme-muted" />
                          <input
                            type="text"
                            value={teammate.studentId}
                            onChange={(e) => handleTeammateChange(idx, 'studentId', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-theme-card border border-theme-border rounded-xl text-xs font-semibold text-theme-heading placeholder:text-theme-muted focus:outline-none focus:border-theme-accent transition-colors"
                            placeholder="e.g. CS2026-088"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Member Button */}
            {totalMembers < maxTeamSize ? (
              <button
                type="button"
                onClick={addTeammate}
                className="w-full py-2.5 border-2 border-dashed border-theme-border hover:border-theme-accent rounded-2xl text-xs font-bold text-theme-heading hover:bg-theme-section transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-theme-accent" />
                Add Member {totalMembers + 1} (Up to 5 Members)
              </button>
            ) : (
              <div className="text-center py-2 text-xs font-semibold text-theme-muted bg-theme-section rounded-xl border border-theme-border">
                Maximum 5 members reached for this team registration.
              </div>
            )}
          </div>

          {/* Submission Guidelines */}
          <div className="p-3.5 rounded-xl bg-theme-section border border-theme-border text-[11px] text-theme-muted space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-theme-heading">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registration Summary</span>
            </div>
            <p>• As the team leader, you are applying for {teammates.length} teammates (Total: {totalMembers} members).</p>
            <p>• All {totalMembers} members will be enrolled together under team "{teamName || 'Your Team'}".</p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-theme-border flex justify-end gap-3 items-center">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-theme-heading hover:bg-theme-section rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold bg-theme-btn hover:bg-theme-btn-hover text-white rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering Team...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Submit Team ({totalMembers} Members)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamRegistrationModal;

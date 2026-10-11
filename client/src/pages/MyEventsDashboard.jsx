import React, { useState } from 'react';
import { BookmarkCheck, UserCheck, AlertCircle, Calendar, Clock, MapPin, Trash2, ArrowRight, Users, Check, X } from 'lucide-react';
import API from '../services/api';
import EventDetailModal from '../components/EventDetailModal';

const MyEventsDashboard = ({ userRSVPs, onCancelRSVP, onNavigateToTab, onRSVP }) => {
 const [activeTab, setActiveTab] = useState('confirmed');
 const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [myTeams, setMyTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const { data } = await API.get('/teams/my-teams');
      setMyTeams(data || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  React.useEffect(() => {
    fetchTeams();
  }, []);

  const handleAcceptInvite = async (teamId) => {
    try {
      await API.post(`/teams/${teamId}/accept`);
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.message || 'Error accepting invite');
    }
  };

  const handleRejectInvite = async (teamId) => {
    try {
      await API.post(`/teams/${teamId}/reject`);
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting invite');
    }
  };
  

 const confirmedRSVPs = userRSVPs.filter((r) => r.status === 'confirmed');
 const waitlistedRSVPs = userRSVPs.filter((r) => r.status === 'waitlisted');

 const currentList = activeTab === 'confirmed' ? confirmedRSVPs : waitlistedRSVPs;

 return (
 <div className="space-y-8">
 
 {/* Header */}
 <div className="glass-card rounded-3xl p-6 sm:p-8 border border-theme-border shadow-xl">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-2xl bg-theme-btn text-theme-accent flex items-center justify-center border border-brand-500/30">
 <BookmarkCheck className="w-6 h-6" />
 </div>
 <div>
 <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-heading">My RSVPs & Event Passes</h1>
 <p className="text-xs sm:text-sm text-theme-muted font-medium">Manage your registered campus events and track waitlist queue status</p>
 </div>
 </div>

 <button
 onClick={() => onNavigateToTab('catalog')}
 className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-theme-card hover:bg-theme-section text-theme-text hover:text-theme-heading border border-theme-border transition-colors"
 >
 Explore Event Catalog <ArrowRight className="w-4 h-4" />
 </button>
 </div>

 {/* Tab Toggle */}
 <div className="flex items-center gap-3 mt-6 pt-6 border-t border-theme-border max-w-xl">
 <button
 onClick={() => setActiveTab('confirmed')}
 className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
 activeTab === 'confirmed'
 ? 'bg-theme-success text-white shadow-sm '
 : 'bg-theme-card text-theme-muted hover:text-white border border-theme-border'
 }`}
 >
 <UserCheck className="w-4 h-4" />
 Confirmed Passes ({confirmedRSVPs.length})
 </button>

 <button
 onClick={() => setActiveTab('waitlisted')}
 className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
 activeTab === 'waitlisted'
 ? 'bg-amber-600 text-white shadow-sm '
 : 'bg-theme-card text-theme-muted hover:text-white border border-theme-border'
 }`}
 >
 <AlertCircle className="w-4 h-4" />
 Waitlisted Queue ({waitlistedRSVPs.length})
 </button>

 <button
 onClick={() => setActiveTab('teams')}
 className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
 activeTab === 'teams'
 ? 'bg-theme-btn text-white shadow-sm'
 : 'bg-theme-card text-theme-muted hover:text-white border border-theme-border'
 }`}
 >
 <Users className="w-4 h-4" />
 My Teams ({myTeams.length})
 </button>
 </div>
 </div>

 {/* RSVPs Grid */}
 
      {/* Teams View */}
      {activeTab === 'teams' ? (
        myTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myTeams.map((team) => (
              <div key={team._id} className="glass-card rounded-2xl border border-theme-border p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-theme-section text-theme-accent border border-theme-border">
                      {team.event?.title || 'Event'}
                    </span>
                    <h3 className="text-lg font-bold text-theme-heading mt-2">{team.name}</h3>
                    <p className="text-xs text-theme-muted">Leader: {team.leader?.name} ({team.leader?.email})</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    team.status === 'confirmed' ? 'bg-theme-success/20 text-theme-success border border-theme-success/30' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  }`}>
                    {team.status}
                  </span>
                </div>

                <div className="border-t border-theme-border pt-3 space-y-2">
                  <h4 className="text-xs font-bold text-theme-heading uppercase tracking-wider">Members</h4>
                  <div className="space-y-1.5">
                    {/* Leader */}
                    <div className="flex items-center gap-1.5 text-xs bg-theme-main p-2.5 rounded-xl">
                      <span className="font-semibold text-theme-heading">{team.leader?.name} (Leader)</span>
                      {team.leader?.email && <span className="text-[11px] text-theme-muted font-normal">({team.leader?.email})</span>}
                    </div>
                    {/* Other members */}
                    {team.members.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs bg-theme-main p-2.5 rounded-xl">
                        <span className="font-semibold text-theme-heading">{m.name || m.user?.name || m.email || m.user?.email || `Member ${idx + 2}`}</span>
                        {m.email && <span className="text-[11px] text-theme-muted font-normal">({m.email})</span>}
                        {m.studentId && <span className="text-[10px] px-1.5 py-0.5 bg-theme-section rounded font-mono text-theme-muted">{m.studentId}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Actions for pending invites (if any) */}
                {team.members.some(m => m.status === 'pending') && (
                  <div className="border-t border-theme-border pt-3 flex items-center">
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleAcceptInvite(team._id)}
                        className="flex-1 py-1.5 bg-theme-success text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept Invite
                      </button>
                      <button
                        onClick={() => handleRejectInvite(team._id)}
                        className="flex-1 py-1.5 bg-theme-error text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-2xl border border-theme-border">
            <Users className="w-12 h-12 text-theme-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm font-semibold text-theme-heading">No teams registered yet</p>
            <p className="text-xs text-theme-muted mt-1">Explore events that support team registration to create one!</p>
          </div>
        )
      ) : (
        currentList.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {currentList.map((rsvp) => {
 const event = rsvp.event;
 if (!event) return null;

 return (
 <div key={rsvp._id} className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-theme-border">
 <div className="p-5 space-y-4">
 <div className="flex items-center justify-between">
 <span className="px-3 py-1 rounded-full text-xs font-bold bg-theme-card text-theme-accent border border-brand-500/20">
 {event.category}
 </span>
 <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
 rsvp.status === 'confirmed' ? 'bg-theme-success/20 text-theme-success border border-theme-success/30' : 'bg-theme-accent/20 text-theme-accent border border-theme-accent/30'
 }`}>
 {rsvp.status === 'confirmed' ? <UserCheck className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
 {rsvp.status === 'confirmed' ? 'Confirmed' : 'Waitlisted'}
 </span>
 </div>

 <div>
 <h3
 onClick={() => setSelectedEventModal(event)}
 className="text-lg font-bold text-theme-heading hover:text-theme-accent transition-colors line-clamp-1 cursor-pointer"
 >
 {event.title}
 </h3>
 <p className="text-xs text-theme-muted mt-1 line-clamp-2">{event.description}</p>
 </div>

 <div className="space-y-2 text-xs text-theme-text pt-3 border-t border-theme-border">
 <div className="flex items-center gap-2">
 <Calendar className="w-4 h-4 text-theme-accent shrink-0" />
 <span>{new Date(event.date).toLocaleDateString()}</span>
 </div>
 <div className="flex items-center gap-2">
 <Clock className="w-4 h-4 text-theme-accent shrink-0" />
 <span>{event.time}</span>
 </div>
 <div className="flex items-center gap-2">
 <MapPin className="w-4 h-4 text-theme-error shrink-0" />
 <span>{event.location}</span>
 </div>
 </div>
 </div>

 <div className="p-5 pt-0 flex items-center gap-2">
 <button
 onClick={() => setSelectedEventModal(event)}
 className="flex-1 py-2 rounded-xl text-xs font-bold bg-theme-card hover:bg-theme-section text-theme-text hover:text-theme-heading border border-theme-border transition-colors"
 >
 View Details
 </button>
 <button
 onClick={() => onCancelRSVP(event._id)}
 className="py-2 px-3 rounded-xl text-xs font-bold text-theme-error bg-theme-error/10 hover:bg-theme-error/20 border border-theme-error/20 transition-colors flex items-center gap-1.5"
 >
 <Trash2 className="w-3.5 h-3.5" />
 Cancel
 </button>
 </div>
 </div>
 );
 })}
 </div>
 ) : (
 <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-theme-border">
 <div className="w-16 h-16 rounded-2xl bg-theme-card mx-auto flex items-center justify-center border border-theme-border text-slate-500">
 <BookmarkCheck className="w-8 h-8" />
 </div>
 <h3 className="text-xl font-bold text-theme-heading">
 {activeTab === 'confirmed' ? 'No Confirmed RSVPs Yet' : 'No Waitlisted Events'}
 </h3>
 <p className="text-sm text-theme-muted max-w-md mx-auto">
 {activeTab === 'confirmed'
 ? "You haven't registered for any campus events yet. Explore upcoming fests and workshops!"
 : 'You do not have any waitlisted event passes right now.'}
 </p>
 <button
 onClick={() => onNavigateToTab('catalog')}
 className="px-6 py-2.5 rounded-xl font-bold text-xs bg-theme-btn hover:bg-theme-btn-hover text-white shadow-sm"
 >
 Browse Upcoming Events
 </button>
 </div>
      )
    )}

 {/* Modal View */}
 <EventDetailModal
 event={selectedEventModal}
 userRSVPStatus={selectedEventModal ? activeTab : null}
 isOpen={!!selectedEventModal}
 onClose={() => setSelectedEventModal(null)}
 onRSVP={onRSVP}
 onCancelRSVP={onCancelRSVP}
 />
 </div>
 );
};

export default MyEventsDashboard;

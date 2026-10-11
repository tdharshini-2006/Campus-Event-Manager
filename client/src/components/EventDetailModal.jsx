import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Award, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80';

const EventDetailModal = ({ event, userRSVPStatus, isOpen, onClose, onRSVP, onCancelRSVP, onCreateTeam }) => {
 const { user, isStudent } = useAuth();
 if (!isOpen || !event) return null;

 const attendeeCount = event.attendeeCount || 0;
 const capacity = event.capacity || 1;
 const waitlistCount = event.waitlistCount || 0;
 const isFull = attendeeCount >= capacity;
 const fillPercentage = Math.min(100, Math.round((attendeeCount / capacity) * 100));

 const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
 weekday: 'long',
 month: 'long',
 day: 'numeric',
 year: 'numeric',
 });

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-main backdrop-blur-md animate-fade-in">
 <div className="glass-card rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-theme-border shadow-2xl p-0 relative">
 
 {/* Close Button */}
 <button
 onClick={onClose}
 className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-theme-main hover:bg-theme-card text-theme-text hover:text-theme-heading border border-theme-border shadow-xl transition-all"
 >
 <X className="w-5 h-5" />
 </button>

 {/* Hero Cover Image */}
 <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-theme-card">
 <img
 src={event.imageUrl || defaultImage}
 alt={event.title}
 className="w-full h-full object-cover"
 onError={(e) => { e.target.src = defaultImage; }}
 />
 <div className="absolute inset-0 /50 to-transparent" />

 {/* Category Pill */}
 <div className="absolute top-4 left-4 z-20">
 <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-theme-btn text-white shadow-sm backdrop-blur-md border border-brand-400/40">
 {event.category}
 </span>
 </div>

 <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
 <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-heading leading-tight drop-shadow-md">
 {event.title}
 </h2>
 <p className="text-sm text-theme-accent flex items-center gap-1.5 font-semibold">
 <Award className="w-4 h-4 text-theme-accent" />
 Organized by {event.organizer}
 </p>
 </div>
 </div>

 {/* Body Details */}
 <div className="p-6 sm:p-8 space-y-6">
 {/* Metadata Cards Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="p-4 rounded-2xl bg-theme-card border border-theme-border flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-theme-btn text-theme-accent flex items-center justify-center border border-brand-500/20">
 <Calendar className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[11px] font-bold text-theme-muted uppercase">Date</p>
 <p className="text-xs font-bold text-theme-heading">{formattedDate}</p>
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-theme-card border border-theme-border flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-theme-btn text-theme-accent flex items-center justify-center border border-brand-500/20">
 <Clock className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[11px] font-bold text-theme-muted uppercase">Time</p>
 <p className="text-xs font-bold text-theme-heading">{event.time}</p>
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-theme-card border border-theme-border flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-theme-error flex items-center justify-center border border-rose-500/20">
 <MapPin className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[11px] font-bold text-theme-muted uppercase">Location</p>
 <p className="text-xs font-bold text-theme-heading">{event.location}</p>
 </div>
 </div>
 </div>

 {/* Description */}
 <div className="space-y-2">
 <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider">About This Event</h3>
 <p className="text-sm text-theme-text leading-relaxed whitespace-pre-line">
 {event.description}
 </p>
 </div>

 {/* Capacity Progress Meter */}
 <div className="p-5 rounded-2xl bg-theme-card border border-theme-border space-y-3">
 <div className="flex items-center justify-between text-xs font-bold">
 <span className="flex items-center gap-2 text-theme-heading">
 <Users className="w-4 h-4 text-theme-accent" />
 Live Attendance Status: <span className="text-theme-accent">{attendeeCount} Confirmed</span> / {capacity} Capacity
 </span>

 {isFull ? (
 <span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
 Full ({waitlistCount} Waitlisted)
 </span>
 ) : (
 <span className="text-theme-success bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
 {capacity - attendeeCount} Spots Available
 </span>
 )}
 </div>

 <div className="w-full h-3 rounded-full bg-theme-section overflow-hidden p-0.5">
 <div
 className={`h-full rounded-full transition-all duration-700 ${
 fillPercentage >= 100
 ? ' '
 : ' '
 }`}
 style={{ width: `${fillPercentage}%` }}
 />
 </div>
 </div>

 {/* Footer RSVP Actions */}
 <div className="pt-4 border-t border-theme-border flex items-center justify-between">
 {userRSVPStatus && (
 <div className="flex items-center gap-2 text-xs font-bold text-theme-text">
 <span>Your Status:</span>
 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
 userRSVPStatus === 'confirmed' ? 'bg-theme-success/20 text-theme-success border border-theme-success/30' : 'bg-theme-accent/20 text-theme-accent border border-theme-accent/30'
 }`}>
 {userRSVPStatus === 'confirmed' ? 'RSVP Confirmed' : `Waitlisted Queue #${waitlistCount}`}
 </span>
 </div>
 )}

 <div className="ml-auto flex items-center gap-3">
 <button
 onClick={onClose}
 className="px-5 py-2.5 rounded-xl text-xs font-bold text-theme-muted hover:text-theme-heading bg-theme-card hover:bg-theme-section transition-colors"
 >
 Close
 </button>

 {isStudent ? (
 userRSVPStatus ? (
 <button
 onClick={() => { onCancelRSVP(event._id); onClose(); }}
 className="px-6 py-2.5 rounded-xl font-bold text-xs bg-theme-error hover:opacity-90 text-white shadow-sm transition-all"
 >
 Cancel My RSVP
 </button>
 ) : (
 <div className="flex items-center gap-2">
 <button
 onClick={() => { onRSVP(event._id); onClose(); }}
 className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all flex items-center gap-2 ${
 isFull ? 'bg-amber-600 hover:bg-amber-500' : 'bg-theme-btn hover:bg-theme-btn-hover '
 }`}
 >
 {isFull ? <AlertCircle className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
 {isFull ? 'Join Waitlist' : 'RSVP Now'}
 </button>

 {event.allowTeamRegistration && (
 <button
 onClick={() => { onClose(); onCreateTeam && onCreateTeam(event); }}
 className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-1.5"
 >
 <Users className="w-4 h-4" />
 Register Team
 </button>
 )}
 </div>
 )
 ) : !user ? (
 <button
 onClick={() => { onRSVP(event._id); onClose(); }}
 className="px-6 py-2.5 rounded-xl font-bold text-xs bg-theme-btn text-white"
 >
 Sign in to RSVP
 </button>
 ) : null}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default EventDetailModal;

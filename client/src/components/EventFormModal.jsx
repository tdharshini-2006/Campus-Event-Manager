import React, { useState, useEffect } from 'react';
import { X, Upload, PlusCircle, Edit3, Image as ImageIcon } from 'lucide-react';

const categories = ['Fest', 'Workshop', 'Guest Lecture', 'Competition', 'Cultural', 'Sports', 'Other'];

const EventFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [category, setCategory] = useState('Fest');
 const [date, setDate] = useState('');
 const [time, setTime] = useState('');
 const [location, setLocation] = useState('');
 const [organizer, setOrganizer] = useState('');
 const [capacity, setCapacity] = useState(50);
 const [imageUrl, setImageUrl] = useState('');
 const [imageFile, setImageFile] = useState(null);
  const [allowTeamRegistration, setAllowTeamRegistration] = useState(false);
  const [minTeamSize, setMinTeamSize] = useState(3);
  const [maxTeamSize, setMaxTeamSize] = useState(5);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 if (initialData) {
 setTitle(initialData.title || '');
 setDescription(initialData.description || '');
 setCategory(initialData.category || 'Fest');
 setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
 setTime(initialData.time || '');
 setLocation(initialData.location || '');
 setOrganizer(initialData.organizer || '');
 setCapacity(initialData.capacity || 50);
 setImageUrl(initialData.imageUrl || '');
      setAllowTeamRegistration(initialData.allowTeamRegistration || false);
      setMinTeamSize(initialData.minTeamSize || 3);
      setMaxTeamSize(initialData.maxTeamSize || 5);
 setImageFile(null);
 } else {
 setTitle('');
 setDescription('');
 setCategory('Fest');
 setDate('');
 setTime('');
 setLocation('');
 setOrganizer('');
 setCapacity(50);
 setImageUrl('');
 setImageFile(null);
 setAllowTeamRegistration(false);
 setMinTeamSize(3);
 setMaxTeamSize(5);
 }
 }, [initialData, isOpen]);

 if (!isOpen) return null;

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);

 const formData = new FormData();
 formData.append('title', title);
 formData.append('description', description);
 formData.append('category', category);
 formData.append('date', date);
 formData.append('time', time);
 formData.append('location', location);
 formData.append('organizer', organizer);
 formData.append('capacity', capacity);
  formData.append('allowTeamRegistration', allowTeamRegistration);
  formData.append('minTeamSize', minTeamSize);
  formData.append('maxTeamSize', maxTeamSize);

 if (imageFile) {
 formData.append('image', imageFile);
 } else if (imageUrl) {
 formData.append('imageUrl', imageUrl);
 }

 try {
 await onSubmit(formData, initialData?._id);
 onClose();
 } catch (error) {
 console.error('Error submitting event:', error);
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-main backdrop-blur-md animate-fade-in">
 <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-theme-border shadow-2xl p-6 relative">
 
 {/* Header */}
 <div className="flex items-center justify-between border-b border-theme-border pb-4 mb-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-theme-btn text-theme-accent flex items-center justify-center border border-brand-500/30">
 {initialData ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
 </div>
 <div>
 <h2 className="text-xl font-bold text-theme-heading">
 {initialData ? 'Edit Campus Event' : 'Create New Campus Event'}
 </h2>
 <p className="text-xs text-theme-muted font-medium">Fill in event details and capacity limits</p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 text-theme-muted hover:text-theme-heading rounded-xl hover:bg-theme-section transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Form Body */}
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Event Title *
 </label>
 <input
 type="text"
 required
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="e.g. Annual Hackathon 2026"
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Category *
 </label>
 <select
 value={category}
 onChange={(e) => setCategory(e.target.value)}
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 >
 {categories.map((cat) => (
 <option key={cat} value={cat}>{cat}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Capacity Limit (Max RSVPs) *
 </label>
 <input
 type="number"
 min="1"
 required
 value={capacity}
 onChange={(e) => setCapacity(e.target.value)}
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Description *
 </label>
 <textarea
 required
 rows={3}
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Describe event schedule, highlights, prerequisites..."
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Event Date *
 </label>
 <input
 type="date"
 required
 value={date}
 onChange={(e) => setDate(e.target.value)}
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Event Time *
 </label>
 <input
 type="text"
 required
 value={time}
 onChange={(e) => setTime(e.target.value)}
 placeholder="e.g. 10:00 AM - 01:00 PM"
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Location *
 </label>
 <input
 type="text"
 required
 value={location}
 onChange={(e) => setLocation(e.target.value)}
 placeholder="e.g. Main Auditorium"
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Organizer / Department *
 </label>
 <input
 type="text"
 required
 value={organizer}
 onChange={(e) => setOrganizer(e.target.value)}
 placeholder="e.g. ACM Student Chapter"
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 </div>

 {/* Image Source Selection */}
 <div className="pt-2">
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Event Cover Image (Upload or Image URL)
 </label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div>
 <input
 type="text"
 value={imageUrl}
 onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); }}
 placeholder="Paste Image URL (Unsplash, etc.)"
 className="w-full px-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>

 <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-theme-card border border-dashed border-theme-border hover:border-brand-500 text-xs font-semibold text-theme-text cursor-pointer transition-colors">
 <Upload className="w-4 h-4 text-theme-accent" />
 <span>{imageFile ? imageFile.name : 'Upload File'}</span>
 <input
 type="file"
 accept="image/*"
 onChange={(e) => {
 if (e.target.files[0]) {
 setImageFile(e.target.files[0]);
 setImageUrl('');
 }
 }}
 className="hidden"
 />
 </label>
 </div>
 </div>

 
        {/* Team Registration Settings */}
        <div className="p-4 border border-theme-border rounded-xl bg-theme-section space-y-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowTeamRegistration}
              onChange={(e) => setAllowTeamRegistration(e.target.checked)}
              className="w-4 h-4 text-theme-accent border-gray-300 rounded focus:ring-theme-accent"
            />
            <span className="text-sm font-bold text-theme-heading">Enable Team Registration</span>
          </label>
          
          {allowTeamRegistration && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
                  Min Team Size
                </label>
                <input
                  type="number"
                  min="2"
                  required={allowTeamRegistration}
                  value={minTeamSize}
                  onChange={(e) => setMinTeamSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
                  Max Team Size
                </label>
                <input
                  type="number"
                  min={Math.max(2, minTeamSize)}
                  required={allowTeamRegistration}
                  value={maxTeamSize}
                  onChange={(e) => setMaxTeamSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
 <div className="flex items-center justify-end gap-3 pt-6 border-t border-theme-border">
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-2.5 rounded-xl font-bold text-xs text-theme-muted hover:text-theme-heading bg-theme-card hover:bg-theme-section transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={loading}
 className="px-6 py-2.5 rounded-xl font-bold text-xs bg-theme-btn hover:bg-theme-btn-hover text-white shadow-sm transition-all flex items-center gap-2"
 >
 {loading ? (
 <span>Saving...</span>
 ) : initialData ? (
 <>
 <Edit3 className="w-4 h-4" /> Save Changes
 </>
 ) : (
 <>
 <PlusCircle className="w-4 h-4" /> Create Event
 </>
 )}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
};

export default EventFormModal;

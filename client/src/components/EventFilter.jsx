import React from 'react';
import { Search, Filter, RotateCcw, Sparkles } from 'lucide-react';

const categories = ['All', 'Fest', 'Workshop', 'Guest Lecture', 'Competition', 'Cultural', 'Sports', 'Other'];

const EventFilter = ({
 searchQuery,
 setSearchQuery,
 selectedCategory,
 setSelectedCategory,
 onReset,
}) => {
 return (
 <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4 mb-8">
 <div className="flex flex-col md:flex-row items-center justify-between gap-4">
 
 {/* Search Keyword Bar */}
 <div className="relative w-full md:w-96">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search by title, location, or organizer..."
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
 />
 </div>

 {/* Filter Reset Button */}
 <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
 <div className="flex items-center gap-2 text-xs text-theme-muted font-semibold">
 <Filter className="w-4 h-4 text-theme-accent" />
 <span>Filter Events</span>
 </div>

 {(searchQuery || selectedCategory !== 'All') && (
 <button
 onClick={onReset}
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 Reset Filters
 </button>
 )}
 </div>
 </div>

 {/* Category Pills Slider / Wrap */}
 <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
 {categories.map((cat) => {
 const active = selectedCategory === cat;
 return (
 <button
 key={cat}
 onClick={() => setSelectedCategory(cat)}
 className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
 active
 ? ' text-theme-heading shadow-sm '
 : 'bg-theme-card hover:bg-theme-section text-theme-muted hover:text-theme-heading border border-theme-border'
 }`}
 >
 {cat === 'All' && <Sparkles className="w-3.5 h-3.5" />}
 {cat}
 </button>
 );
 })}
 </div>
 </div>
 );
};

export default EventFilter;

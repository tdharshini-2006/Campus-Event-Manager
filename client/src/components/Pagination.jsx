import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, limit, onPageChange, onLimitChange }) => {
 if (pages <= 1 && total <= limit) return null;

 const pageNumbers = [];
 for (let i = 1; i <= pages; i++) {
 pageNumbers.push(i);
 }

 return (
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-theme-border">
 
 {/* Total & Current Page Info */}
 <div className="text-xs text-theme-muted font-medium">
 Showing Page <span className="font-bold text-theme-heading">{page}</span> of{' '}
 <span className="font-bold text-theme-heading">{pages}</span> ({total} Total Events)
 </div>

 <div className="flex items-center gap-4">
 {/* Page Size Selector */}
 {onLimitChange && (
 <div className="flex items-center gap-2 text-xs text-theme-muted">
 <span>Per page:</span>
 <select
 value={limit}
 onChange={(e) => onLimitChange(Number(e.target.value))}
 className="bg-theme-card border border-theme-border text-theme-heading rounded-lg px-2.5 py-1 focus:outline-none text-xs font-semibold"
 >
 <option value={6}>6</option>
 <option value={12}>12</option>
 <option value={24}>24</option>
 </select>
 </div>
 )}

 {/* Page Number Buttons */}
 <div className="flex items-center gap-1.5">
 <button
 onClick={() => onPageChange(page - 1)}
 disabled={page <= 1}
 className="p-2 rounded-xl bg-theme-card hover:bg-theme-section text-theme-text disabled:opacity-40 disabled:cursor-not-allowed border border-theme-border transition-colors"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>

 {pageNumbers.map((num) => (
 <button
 key={num}
 onClick={() => onPageChange(num)}
 className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
 page === num
 ? 'bg-theme-btn text-white shadow-sm '
 : 'bg-theme-card hover:bg-theme-section text-theme-muted hover:text-white border border-theme-border'
 }`}
 >
 {num}
 </button>
 ))}

 <button
 onClick={() => onPageChange(page + 1)}
 disabled={page >= pages}
 className="p-2 rounded-xl bg-theme-card hover:bg-theme-section text-theme-text disabled:opacity-40 disabled:cursor-not-allowed border border-theme-border transition-colors"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 );
};

export default Pagination;

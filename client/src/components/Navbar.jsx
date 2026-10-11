import React, { useState } from 'react';
import { Calendar, User, LogOut, Shield, BookmarkCheck, PlusCircle, Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab, onOpenCreateModal }) => {
 const { user, logout, isAdmin, isStudent } = useAuth();
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 return (
 <header className="sticky top-0 z-40 glass-nav">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-20">
 
 {/* Brand / Logo */}
 <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
 <div className="w-11 h-11 rounded-2xl p-0.5 shadow-sm ">
 <div className="w-full h-full bg-theme-main rounded-[14px] flex items-center justify-center">
 <Calendar className="w-6 h-6 text-theme-accent" />
 </div>
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h1 className="text-xl font-extrabold tracking-tight from-white ">
 Campus Events
 </h1>
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-theme-accent border border-brand-500/20">
 v1.0
 </span>
 </div>
 <p className="text-xs text-theme-muted font-medium">Event Management Hub</p>
 </div>
 </div>

 {/* Desktop Navigation Links */}
 <nav className="hidden md:flex items-center gap-2 bg-theme-card p-1.5 rounded-2xl border border-theme-border">
 <button
 onClick={() => setActiveTab('catalog')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 activeTab === 'catalog'
 ? 'bg-theme-btn text-white shadow-sm '
 : 'text-theme-muted hover:text-white hover:bg-theme-section'
 }`}
 >
 <Sparkles className="w-4 h-4" />
 Event Catalog
 </button>

 {isStudent && (
 <button
 onClick={() => setActiveTab('my-events')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 activeTab === 'my-events'
 ? 'bg-theme-btn text-white shadow-sm '
 : 'text-theme-muted hover:text-white hover:bg-theme-section'
 }`}
 >
 <BookmarkCheck className="w-4 h-4" />
 My RSVPs
 </button>
 )}

 {isAdmin && (
 <button
 onClick={() => setActiveTab('admin')}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 activeTab === 'admin'
 ? 'bg-purple-600 text-white shadow-sm '
 : 'text-theme-muted hover:text-white hover:bg-theme-section'
 }`}
 >
 <Shield className="w-4 h-4" />
 Admin Portal
 </button>
 )}
 </nav>

 {/* Action & User Profile Section */}
 <div className="hidden md:flex items-center gap-3">
 {isAdmin && (
 <button
 onClick={onOpenCreateModal}
 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold hover: hover: text-theme-heading shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
 >
 <PlusCircle className="w-4 h-4" />
 Create Event
 </button>
 )}

 {user ? (
 <div className="flex items-center gap-3 pl-3 border-l border-theme-border">
 <div className="text-right">
 <p className="text-sm font-bold text-theme-text">{user.name}</p>
 <div className="flex items-center justify-end gap-1.5">
 <span
 className={`inline-block w-2 h-2 rounded-full ${
 isAdmin ? 'bg-purple-400' : 'bg-brand-400'
 }`}
 />
 <span className="text-xs text-theme-muted capitalize font-medium">
 {user.role} {user.department ? `• ${user.department}` : ''}
 </span>
 </div>
 </div>

 <button
 onClick={logout}
 title="Sign Out"
 className="p-2.5 text-theme-muted hover:text-theme-error hover:bg-rose-500/10 rounded-xl transition-all border border-theme-border"
 >
 <LogOut className="w-4 h-4" />
 </button>
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <button
 onClick={() => setActiveTab('login')}
 className="px-4 py-2 text-sm font-semibold text-theme-text hover:text-theme-heading hover:bg-theme-section rounded-xl transition-all"
 >
 Sign In
 </button>
 <button
 onClick={() => setActiveTab('register')}
 className="px-4 py-2.5 text-sm font-bold bg-theme-btn hover:bg-theme-btn-hover text-white rounded-xl shadow-sm transition-all"
 >
 Register
 </button>
 </div>
 )}
 </div>

 {/* Mobile Menu Button */}
 <div className="md:hidden flex items-center gap-2">
 <button
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 className="p-2 text-theme-muted hover:text-theme-heading rounded-xl bg-theme-card border border-theme-border"
 >
 {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
 </button>
 </div>
 </div>
 </div>

 {/* Mobile Drawer */}
 {mobileMenuOpen && (
 <div className="md:hidden border-b border-theme-border bg-theme-main backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
 <button
 onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
 activeTab === 'catalog' ? 'bg-theme-btn text-white' : 'text-theme-text bg-theme-card'
 }`}
 >
 <Sparkles className="w-5 h-5" />
 Event Catalog
 </button>

 {isStudent && (
 <button
 onClick={() => { setActiveTab('my-events'); setMobileMenuOpen(false); }}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
 activeTab === 'my-events' ? 'bg-theme-btn text-white' : 'text-theme-text bg-theme-card'
 }`}
 >
 <BookmarkCheck className="w-5 h-5" />
 My RSVPs
 </button>
 )}

 {isAdmin && (
 <button
 onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
 activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-theme-text bg-theme-card'
 }`}
 >
 <Shield className="w-5 h-5" />
 Admin Portal
 </button>
 )}

 {isAdmin && (
 <button
 onClick={() => { onOpenCreateModal(); setMobileMenuOpen(false); }}
 className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-theme-success text-white shadow-sm"
 >
 <PlusCircle className="w-5 h-5" />
 Create Event
 </button>
 )}

 {user ? (
 <div className="pt-3 border-t border-theme-border flex items-center justify-between">
 <div>
 <p className="font-bold text-theme-heading">{user.name}</p>
 <p className="text-xs text-theme-muted capitalize">{user.role} • {user.email}</p>
 </div>
 <button
 onClick={() => { logout(); setMobileMenuOpen(false); }}
 className="px-3 py-2 text-sm font-semibold text-theme-error bg-rose-500/10 rounded-xl"
 >
 Sign Out
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-2 pt-2">
 <button
 onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }}
 className="py-2.5 text-center font-semibold text-theme-text bg-theme-card rounded-xl border border-theme-border"
 >
 Sign In
 </button>
 <button
 onClick={() => { setActiveTab('register'); setMobileMenuOpen(false); }}
 className="py-2.5 text-center font-bold bg-theme-btn text-white rounded-xl"
 >
 Register
 </button>
 </div>
 )}
 </div>
 )}
 </header>
 );
};

export default Navbar;

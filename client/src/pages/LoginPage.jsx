import React, { useState } from 'react';
import { LogIn, Mail, Lock, Shield, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onNavigateToRegister, onSuccess }) => {
 const { login } = useAuth();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);

 try {
 await login(email, password);
 onSuccess();
 } catch (err) {
 setError(err.response?.data?.message || 'Invalid email or password');
 } finally {
 setLoading(false);
 }
 };

 const handleDemoAdmin = async () => {
 setEmail('admin@campus.edu');
 setPassword('admin123');
 setError('');
 setLoading(true);
 try {
 await login('admin@campus.edu', 'admin123');
 onSuccess();
 } catch (err) {
 setError('Please run seed script `npm run seed` in server folder to generate demo accounts!');
 } finally {
 setLoading(false);
 }
 };

 const handleDemoStudent = async () => {
 setEmail('student1@campus.edu');
 setPassword('student123');
 setError('');
 setLoading(true);
 try {
 await login('student1@campus.edu', 'student123');
 onSuccess();
 } catch (err) {
 setError('Please run seed script `npm run seed` in server folder to generate demo accounts!');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="max-w-md mx-auto my-8">
 <div className="glass-card rounded-3xl p-8 border border-theme-border shadow-2xl space-y-6">
 
 <div className="text-center space-y-2">
 <div className="w-14 h-14 rounded-2xl bg-theme-btn text-theme-accent mx-auto flex items-center justify-center border border-brand-500/30">
 <LogIn className="w-7 h-7" />
 </div>
 <h2 className="text-2xl font-extrabold text-theme-heading">Welcome Back</h2>
 <p className="text-xs text-theme-muted font-medium">Sign in to access your RSVPs and campus pass</p>
 </div>

 {/* Demo Login Shortcuts */}
 <div className="p-3.5 rounded-2xl bg-theme-card border border-theme-border space-y-2">
 <p className="text-[11px] font-bold text-theme-muted uppercase tracking-wider text-center flex items-center justify-center gap-1">
 <Sparkles className="w-3 h-3 text-theme-accent" /> Demo Quick Login Shortcuts
 </p>
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={handleDemoAdmin}
 className="py-2 px-3 rounded-xl text-xs font-bold bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-800/60 transition-colors flex items-center justify-center gap-1.5"
 >
 <Shield className="w-3.5 h-3.5" /> Admin Demo
 </button>
 <button
 type="button"
 onClick={handleDemoStudent}
 className="py-2 px-3 rounded-xl text-xs font-bold bg-brand-950/60 hover:bg-brand-900/80 text-brand-200 border border-brand-800/60 transition-colors flex items-center justify-center gap-1.5"
 >
 <User className="w-3.5 h-3.5" /> Student Demo
 </button>
 </div>
 </div>

 {error && (
 <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-semibold">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Email Address
 </label>
 <div className="relative">
 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="name@campus.edu"
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <input
 type={showPassword ? 'text' : 'password'}
 required
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 <div className="mt-2.5 flex items-center gap-2">
 <input
 type="checkbox"
 id="loginShowPassword"
 checked={showPassword}
 onChange={(e) => setShowPassword(e.target.checked)}
 className="w-4 h-4 rounded border-theme-border text-theme-btn focus:ring-theme-btn cursor-pointer"
 />
 <label htmlFor="loginShowPassword" className="text-xs font-medium text-theme-heading select-none cursor-pointer">
 Show Password
 </label>
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-3 rounded-xl font-bold text-sm bg-theme-btn hover:bg-theme-btn-hover text-white shadow-sm transition-all flex items-center justify-center gap-2"
 >
 {loading ? 'Authenticating...' : 'Sign In'}
 </button>
 </form>

 <div className="text-center pt-2 border-t border-theme-border">
 <p className="text-xs text-theme-muted">
 Don't have an account?{' '}
 <button
 onClick={onNavigateToRegister}
 className="font-bold text-theme-accent hover:underline"
 >
 Create Account
 </button>
 </p>
 </div>
 </div>
 </div>
 );
};

export default LoginPage;

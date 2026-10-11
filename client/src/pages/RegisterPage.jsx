import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, Building, Shield, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const departments = [
 'Computer Science & Engineering',
 'Information Technology',
 'Electronics & Communication',
 'Mechanical Engineering',
 'Civil Engineering',
 'Electrical Engineering',
 'Management & Business',
 'General / Other',
];

const RegisterPage = ({ onNavigateToLogin, onSuccess }) => {
 const { register } = useAuth();
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [role, setRole] = useState('student');
 const [department, setDepartment] = useState(departments[0]);
 const [studentId, setStudentId] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);

 try {
 await register({
 name,
 email,
 password,
 role,
 department,
 studentId,
 });
 onSuccess();
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to create account');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="max-w-md mx-auto my-8">
 <div className="glass-card rounded-3xl p-8 border border-theme-border shadow-2xl space-y-6">
 
 <div className="text-center space-y-2">
 <div className="w-14 h-14 rounded-2xl bg-theme-btn text-theme-accent mx-auto flex items-center justify-center border border-brand-500/30">
 <UserPlus className="w-7 h-7" />
 </div>
 <h2 className="text-2xl font-extrabold text-theme-heading">Create Account</h2>
 <p className="text-xs text-theme-muted font-medium">Join your campus event portal to RSVP & organize</p>
 </div>

 {error && (
 <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-semibold">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Account Role *
 </label>
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => setRole('student')}
 className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
 role === 'student'
 ? 'bg-theme-btn text-white shadow-md'
 : 'bg-theme-card text-theme-muted border border-theme-border'
 }`}
 >
 <User className="w-4 h-4" /> Student
 </button>
 <button
 type="button"
 onClick={() => setRole('admin')}
 className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
 role === 'admin'
 ? 'bg-purple-600 text-white shadow-md'
 : 'bg-theme-card text-theme-muted border border-theme-border'
 }`}
 >
 <Shield className="w-4 h-4" /> Admin / Faculty
 </button>
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Full Name *
 </label>
 <div className="relative">
 <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <input
 type="text"
 required
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="e.g. Alex Rivera"
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Email Address *
 </label>
 <div className="relative">
 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="alex@campus.edu"
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Department *
 </label>
 <div className="relative">
 <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <select
 value={department}
 onChange={(e) => setDepartment(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 >
 {departments.map((d) => (
 <option key={d} value={d}>{d}</option>
 ))}
 </select>
 </div>
 </div>

 {role === 'student' && (
 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Student ID / Roll No (Optional)
 </label>
 <div className="relative">
 <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <input
 type="text"
 value={studentId}
 onChange={(e) => setStudentId(e.target.value)}
 placeholder="e.g. CS2026-042"
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 </div>
 )}

 <div>
 <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-1">
 Password *
 </label>
 <div className="relative">
 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
 <input
 type={showPassword ? 'text' : 'password'}
 required
 minLength="6"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="At least 6 characters"
 className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-heading text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
 />
 </div>
 <div className="mt-2.5 flex items-center gap-2">
 <input
 type="checkbox"
 id="registerShowPassword"
 checked={showPassword}
 onChange={(e) => setShowPassword(e.target.checked)}
 className="w-4 h-4 rounded border-theme-border text-theme-btn focus:ring-theme-btn cursor-pointer"
 />
 <label htmlFor="registerShowPassword" className="text-xs font-medium text-theme-heading select-none cursor-pointer">
 Show Password
 </label>
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-3 rounded-xl font-bold text-sm bg-theme-btn hover:bg-theme-btn-hover text-white shadow-sm transition-all"
 >
 {loading ? 'Creating Account...' : 'Register Account'}
 </button>
 </form>

 <div className="text-center pt-2 border-t border-theme-border">
 <p className="text-xs text-theme-muted">
 Already registered?{' '}
 <button
 onClick={onNavigateToLogin}
 className="font-bold text-theme-accent hover:underline"
 >
 Sign In Here
 </button>
 </p>
 </div>
 </div>
 </div>
 );
};

export default RegisterPage;

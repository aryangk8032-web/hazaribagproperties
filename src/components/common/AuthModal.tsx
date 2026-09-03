import React, { useState } from 'react';
import { AtSign, LoaderCircle, ShieldCheck, User, X } from 'lucide-react';
import { useApp, type UserRole } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithEmail } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Exclude<UserRole, 'admin'>>('buyer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); setMessage('');
    try {
      await signInWithEmail(email.trim(), name.trim(), phone.trim(), role);
      setMessage('We sent a secure sign-in link to your email address.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send a sign-in link.');
    } finally { setLoading(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200" onClick={(event) => event.stopPropagation()}>
      <div className="bg-slate-900 text-white p-5 relative flex items-center justify-between"><BrandLogo variant="horizontal" theme="dark" size="sm" showTagline /><button onClick={closeAuthModal} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20" aria-label="Close sign in"><X size={16} /></button></div>
      <form onSubmit={submit} className="p-6 space-y-4">
        <div><h2 className="text-lg font-bold text-slate-900">Sign in securely</h2><p className="text-xs text-slate-500 mt-1">We use a password-free link so your account and saved listings remain protected.</p></div>
        {message && <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">{message}</div>}
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Full name<div className="relative mt-1"><User size={15} className="absolute left-3 top-2.5 text-slate-400" /><input required value={name} onChange={(event) => setName(event.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm" placeholder="Your name" /></div></label>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email address<div className="relative mt-1"><AtSign size={15} className="absolute left-3 top-2.5 text-slate-400" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm" placeholder="you@example.com" /></div></label>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Phone <span className="normal-case text-slate-400">(optional)</span><input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md text-sm" placeholder="+91 94311 00000" /></label>
        <div><div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">I am here to</div><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setRole('buyer')} className={`py-2 rounded-md border text-xs font-semibold ${role === 'buyer' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'border-slate-200 text-slate-600'}`}>Buy / Rent</button><button type="button" onClick={() => setRole('seller')} className={`py-2 rounded-md border text-xs font-semibold ${role === 'seller' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'border-slate-200 text-slate-600'}`}>List Property</button></div></div>
        <div className="flex gap-2 text-[11px] text-slate-500"><ShieldCheck size={15} className="text-blue-600 shrink-0" />Your access is governed by your Supabase account; admin access cannot be selected here.</div>
        <button disabled={loading} type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-md text-sm flex items-center justify-center gap-2">{loading && <LoaderCircle size={15} className="animate-spin" />}{loading ? 'Sending secure link…' : 'Email me a sign-in link'}</button>
      </form>
    </div>
  </div>;
};

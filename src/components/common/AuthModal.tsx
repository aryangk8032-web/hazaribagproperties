import React, { useEffect, useState } from 'react';
import { AtSign, LockKeyhole, LoaderCircle, Phone, ShieldCheck, User, X } from 'lucide-react';
import { useApp, type UserRole } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

type AuthMode = 'signin' | 'signup' | 'recovery';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, signInWithPassword, signUpWithPassword, requestPasswordReset, updatePassword } = useApp();
  const [mode, setMode] = useState<AuthMode>(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Exclude<UserRole, 'admin'>>('buyer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { if (isAuthModalOpen) { setMode(authModalMode); setMessage(''); setPassword(''); } }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage('');
    setPassword('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signin') {
        await signInWithPassword(email.trim(), password);
        return;
      }

      if (mode === 'recovery') {
        await updatePassword(password);
        return;
      }

      const { confirmationRequired } = await signUpWithPassword(email.trim(), password, name.trim(), phone.trim(), role);
      setMessage(confirmationRequired ? 'Account created. Please confirm your email, then sign in with your password.' : 'Account created and signed in successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not complete that request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" role="presentation">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl" role="dialog" aria-modal="true" aria-labelledby="auth-heading" onClick={(event) => event.stopPropagation()}>
        <div className="relative flex items-center justify-between bg-slate-900 p-5 text-white">
          <BrandLogo variant="horizontal" theme="dark" size="sm" showTagline />
          <button onClick={closeAuthModal} className="rounded-md bg-white/10 p-1.5 hover:bg-white/20" aria-label="Close authentication"><X size={16} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4 p-6">
          <div>
            <h2 id="auth-heading" className="text-lg font-bold text-slate-900">{mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Set a new password'}</h2>
            <p className="mt-1 text-xs text-slate-500">{mode === 'signin' ? 'Sign in with your email address and password.' : mode === 'signup' ? 'Use your email and password to manage saved properties and listings.' : 'Choose a new password for your Hazaribagh Properties account.'}</p>
          </div>

          {message && <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900" role="status">{message}</div>}

          {mode === 'signup' && <>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Full name<div className="relative mt-1"><User size={15} className="absolute left-3 top-2.5 text-slate-400" /><input required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm" placeholder="Your name" /></div></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Phone number<div className="relative mt-1"><Phone size={15} className="absolute left-3 top-2.5 text-slate-400" /><input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm" placeholder="+91 94311 00000" /></div></label>
          </>}

          {mode !== 'recovery' && <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email address<div className="relative mt-1"><AtSign size={15} className="absolute left-3 top-2.5 text-slate-400" /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm" placeholder="you@example.com" /></div></label>}
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{mode === 'recovery' ? 'New password' : 'Password'}<div className="relative mt-1"><LockKeyhole size={15} className="absolute left-3 top-2.5 text-slate-400" /><input required minLength={6} type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm" placeholder="At least 6 characters" /></div></label>

          {mode === 'signup' && <div><div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-700">I am here to</div><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setRole('buyer')} className={`rounded-md border py-2 text-xs font-semibold ${role === 'buyer' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-600'}`}>Buy / Rent</button><button type="button" onClick={() => setRole('seller')} className={`rounded-md border py-2 text-xs font-semibold ${role === 'seller' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-600'}`}>List Property</button></div></div>}

          {mode !== 'recovery' && <div className="flex gap-2 text-[11px] text-slate-500"><ShieldCheck size={15} className="shrink-0 text-blue-600" />Admin access is assigned separately; it cannot be selected during sign-up.</div>}
          <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{loading && <LoaderCircle size={15} className="animate-spin" />}{loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Update password'}</button>
          {mode === 'signin' && <button type="button" onClick={async () => { const address = email.trim(); if (!address) { setMessage('Enter your email address first.'); return; } try { await requestPasswordReset(address); setMessage('If that account exists, a reset link has been sent.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to send a reset link.'); } }} className="block w-full text-center text-xs font-semibold text-blue-700 hover:underline">Forgot password?</button>}
          {mode !== 'recovery' && <p className="text-center text-xs text-slate-600">{mode === 'signin' ? <>New to Hazaribagh Properties? <button type="button" onClick={() => switchMode('signup')} className="font-semibold text-blue-700 hover:underline">Create an account</button></> : <>Already have an account? <button type="button" onClick={() => switchMode('signin')} className="font-semibold text-blue-700 hover:underline">Sign in</button></>}</p>}
        </form>
      </div>
    </div>
  );
};

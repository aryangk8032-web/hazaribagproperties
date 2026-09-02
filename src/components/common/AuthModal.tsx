import React, { useState } from 'react';
import { X, Lock, Phone, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp, UserRole } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, setUserSession, currentUserRole } = useApp();
  const [role, setRole] = useState<UserRole>(currentUserRole || 'buyer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setUserSession(name.trim() || (role === 'admin' ? 'Hazaribagh Properties Admin' : 'Shri Anand Prakash'), `+91 ${phone}`, role);
    closeAuthModal();
    setOtpStep(false);
  };

  const handleQuickRoleSwitch = (targetRole: UserRole) => {
    const defaultNames = {
      buyer: 'Shri Anand Prakash (Buyer)',
      seller: 'Sunil Kumar Sinha (Property Owner)',
      admin: 'Hazaribagh Properties Admin'
    };
    setUserSession(defaultNames[targetRole], '+91 94311 00000', targetRole);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-5 relative flex items-center justify-between">
          <BrandLogo variant="horizontal" theme="dark" size="sm" showTagline={true} />
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Demo quick role switcher for testing */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
              ⚡ Quick Preview Switcher (Choose Persona):
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickRoleSwitch('buyer')}
                className="px-2 py-1.5 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                👤 Buyer
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleSwitch('seller')}
                className="px-2 py-1.5 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                🏠 Seller
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleSwitch('admin')}
                className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <hr className="w-full border-slate-200" />
            <span className="absolute bg-white px-2 text-[11px] text-slate-400 font-medium">or sign in with mobile OTP</span>
          </div>

          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-slate-500">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="94311 00000"
                    className="w-full pl-11 pr-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">I want to:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${role === 'buyer' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Explore & Buy/Rent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${role === 'seller' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    List My Property
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="text-xs text-slate-500">OTP sent to</div>
                <div className="text-sm font-bold text-slate-900">+91 {phone}</div>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-digit demo OTP (e.g. 1234)"
                  className="w-full text-center tracking-widest text-lg font-bold py-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-600"
                  required
                />
                <span className="text-[11px] text-blue-600 text-center block mt-1">
                  Demo mode: Enter any 4 digits to proceed
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                Verify & Continue
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

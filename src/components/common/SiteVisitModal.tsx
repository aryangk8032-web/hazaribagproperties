import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatIndianPrice } from '../../utils/formatters';

export const SiteVisitModal: React.FC = () => {
  const { isSiteVisitOpen, closeSiteVisitModal, selectedPropertyForModal, addLead, showToast } = useApp();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isSiteVisitOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (selectedPropertyForModal) {
      try {
        await addLead({
        propertyId: selectedPropertyForModal.id,
        propertyTitle: selectedPropertyForModal.title,
        propertySlug: selectedPropertyForModal.slug,
        locality: selectedPropertyForModal.locality,
        price: selectedPropertyForModal.price,
        buyerName: name.trim(),
        buyerPhone: `+91 ${cleanPhone.slice(-10)}`,
        buyerEmail: email.trim() || undefined,
        userName: name.trim(),
        userPhone: `+91 ${cleanPhone.slice(-10)}`,
        userEmail: email.trim() || undefined,
        leadType: 'site_visit',
        inquiryType: 'site_visit',
        preferredDate: date,
        preferredTimeSlot: timeSlot,
        message: notes.trim() || `Site visit requested for ${date} (${timeSlot})`,
        status: 'new'
        });
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : 'Unable to schedule the visit.');
        return;
      }
    }

    setIsSubmitted(true);
    showToast('Site visit scheduled! Our concierge will call you shortly.', 'success');
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setError('');
    closeSiteVisitModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
              <Calendar size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Schedule Free Assisted Site Visit</h3>
              <p className="text-xs text-slate-400">With a Hazaribagh Properties property specialist</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Site Visit Request Received</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>! Our local representative will call you on <strong>{phone}</strong> to confirm transport and timing for your visit to {selectedPropertyForModal?.locality || 'the property'}.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Property:</span>
                <span className="font-semibold text-slate-900 line-clamp-1">{selectedPropertyForModal?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Preferred Date:</span>
                <span className="font-medium text-slate-900">{date} ({timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assistance:</span>
                <span className="font-medium text-blue-600">100% Free Concierge Service</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Property Summary Pill */}
            {selectedPropertyForModal && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                {selectedPropertyForModal.images[0] && (
                  <img
                    src={selectedPropertyForModal.images[0].url}
                    alt={selectedPropertyForModal.title}
                    className="w-12 h-12 rounded-md object-cover shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin size={11} className="text-blue-600" />
                    <span>{selectedPropertyForModal.locality}, Hazaribagh</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {selectedPropertyForModal.title}
                  </h4>
                  <div className="text-xs font-bold text-blue-600 mt-0.5">
                    {formatIndianPrice(selectedPropertyForModal.price, selectedPropertyForModal.purpose)}
                  </div>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                1. Select Preferred Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                required
              />
            </div>

            {/* Time slot pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                2. Preferred Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: 'Morning', time: '10 AM - 1 PM' },
                  { id: 'afternoon', label: 'Afternoon', time: '1 PM - 4 PM' },
                  { id: 'evening', label: 'Evening', time: '4 PM - 7 PM' }
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setTimeSlot(slot.id as any)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      timeSlot === slot.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{slot.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. Anand Prakash"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-slate-500">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    placeholder="94311 00000"
                    className="w-full pl-11 pr-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email for confirmation <span className="normal-case text-slate-400">(optional)</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
            </div>

            {/* Optional message */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Special Requests or Questions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need transport assistance from Matwari / want to inspect boundary pillars..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            {/* Trust note */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-50/60 rounded-lg text-[11px] text-blue-900 border border-blue-200/60">
              <ShieldCheck size={16} className="text-blue-600 shrink-0" />
              <span>
                Your contact details are strictly kept confidential with the Hazaribagh Properties concierge team.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} className="text-blue-200" />
              Confirm Site Visit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, MessageSquare, Phone, Send, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatIndianPrice } from '../../utils/formatters';

export const InquiryModal: React.FC = () => {
  const { isInquiryOpen, closeInquiryModal, selectedPropertyForModal, addLead, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isInquiryOpen) return null;

  const handleSubmit = async (e: React.FormEvent, isWhatsApp = false) => {
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
        leadType: isWhatsApp ? 'whatsapp' : 'inquiry',
        inquiryType: isWhatsApp ? 'whatsapp' : 'general_inquiry',
        message: message.trim() || 'Requesting complete property details and pricing sheet.',
        status: 'new'
        });
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : 'Unable to submit your inquiry.');
        return;
      }
    }

    if (isWhatsApp) {
      const waText = encodeURIComponent(
        `Hello Hazaribagh Properties, I am interested in: "${selectedPropertyForModal?.title}" in ${selectedPropertyForModal?.locality} (Listing ID: ${selectedPropertyForModal?.listingId}). My name is ${name}. Please share more details.`
      );
      window.open(`https://wa.me/919431100000?text=${waText}`, '_blank');
      showToast('Opening WhatsApp with listing details pre-filled!', 'success');
      handleClose();
      return;
    }

    setIsSubmitted(true);
    showToast('Inquiry submitted! Our representative will contact you promptly.', 'success');
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setError('');
    closeInquiryModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
              <MessageSquare size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Request Property Details</h3>
              <p className="text-xs text-slate-400">Directly from Hazaribagh Properties desk</p>
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

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Inquiry Received</h4>
              <p className="text-xs text-slate-600">
                Our property advisor will get in touch with you at <strong>+91 {phone}</strong> with complete title copies and pricing breakdown.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-4">
            {selectedPropertyForModal && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-900 line-clamp-1">
                  {selectedPropertyForModal.title}
                </div>
                <div className="text-blue-600 font-bold mt-0.5">
                  {formatIndianPrice(selectedPropertyForModal.price, selectedPropertyForModal.purpose)} • {selectedPropertyForModal.locality}
                </div>
              </div>
            )}

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Rameshwar Kumar"
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                required
              />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email for confirmation <span className="normal-case text-slate-400">(optional)</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Mobile Number (+91)
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Message or Query
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I want to know about exact location, road width, and price negotiation..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck size={14} className="text-blue-600 shrink-0" />
              <span>Owner phone is kept private. All inquiries handled securely.</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Us</span>
              </button>

              <button
                type="submit"
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <Send size={14} />
                <span>Send Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, AlertCircle, X, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VerificationModal: React.FC = () => {
  const { isVerificationModalOpen, closeVerificationModal } = useApp();

  if (!isVerificationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={closeVerificationModal}
            className="absolute top-5 right-5 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/30">
              <ShieldCheck size={24} className="text-blue-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Trust & Safety Standard</span>
              <h3 className="text-xl font-bold text-white">Verified by Hazaribagh Properties</h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Our multi-point manual review process to protect buyers and tenants across Hazaribagh.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600" />
              What We Check Before Verification:
            </h4>
            <div className="grid gap-3 text-sm text-slate-700">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <FileCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-xs font-bold text-slate-900">Ownership & Document Consistency</strong>
                  <span className="text-xs text-slate-600">We inspect seller ownership credentials, registered deed (kewala), and online Jharbhoomi land records / mutation history.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <MapPin size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-xs font-bold text-slate-900">Location & Road Access Confirmation</strong>
                  <span className="text-xs text-slate-600">Verification of exact locality, approach road width (minimum rasta check), and landmark proximity in Hazaribagh.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <ShieldCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-xs font-bold text-slate-900">Genuine Photos & Price Realism</strong>
                  <span className="text-xs text-slate-600">Cross-checking uploaded photography against actual physical attributes and prevailing market circle rates.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Transparency Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 text-amber-950">Important Transparency Note:</span>
              "Verified by Hazaribagh Properties" indicates that our team has completed an editorial and documentary review of the submitted information. It does not constitute a government or legal certification. Buyers and investors must independently complete standard title searches and legal due diligence before financial transactions.
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={closeVerificationModal}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

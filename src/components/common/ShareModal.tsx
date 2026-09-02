import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { Property } from '../../types/property';
import { useApp } from '../../context/AppContext';

interface ShareModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ property, isOpen, onClose }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/property/${property.slug}`
    : `https://hazaribaghproperties.com/property/${property.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Listing URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this verified property in Hazaribagh:\n\n*${property.title}*\n📍 ${property.locality}, Hazaribagh\n💰 View price and details:\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-sm w-full overflow-hidden shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Share2 size={16} className="text-blue-600" />
            <span>Share Property</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
            {property.images[0] && (
              <img src={property.images[0].url} alt="" className="w-12 h-12 rounded-md object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">{property.title}</div>
              <div className="text-[11px] text-slate-500">{property.locality}, Hazaribagh</div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle size={16} />
              <span>Share on WhatsApp</span>
            </button>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors shrink-0 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

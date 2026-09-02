import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3 rounded-lg shadow-lg border text-sm backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900/95 text-white border-blue-500/50'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-white border-rose-800'
              : toast.type === 'warning'
              ? 'bg-amber-950/95 text-white border-amber-800'
              : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />}
          <div className="flex-1 font-medium text-xs leading-snug">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

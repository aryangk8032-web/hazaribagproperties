import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VerificationBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  size = 'md',
  showDetails = false,
  className = ''
}) => {
  const { openVerificationModal } = useApp();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[10px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2'
  };

  const iconSizes = {
    sm: 11,
    md: 12,
    lg: 14
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openVerificationModal();
      }}
      className={`inline-flex items-center font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors group cursor-pointer ${sizeClasses[size]} ${className}`}
      title="Verified by Hazaribagh Properties review team"
    >
      <ShieldCheck size={iconSizes[size]} className="text-emerald-700 shrink-0" />
      <span>Verified</span>
      {showDetails && (
        <Info size={iconSizes[size] - 2} className="text-emerald-600 group-hover:text-emerald-800 shrink-0" />
      )}
    </button>
  );
};

import React from 'react';
import { X, Check } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onClose,
  resultsCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Filter Properties</h3>
            <p className="text-xs text-slate-500">{resultsCount} matching properties in Hazaribagh</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="p-4 overflow-y-auto flex-1">
          <FilterSidebar className="border-0 p-0 shadow-none" />
        </div>

        {/* Footer Apply Button */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check size={18} />
            <span>Apply Filters ({resultsCount} Results)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

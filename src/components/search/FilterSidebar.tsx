import React from 'react';
import { Filter, RotateCcw, Check, ShieldCheck, Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HAZARIBAGH_LOCALITIES } from '../../data/localities';
import { PropertyType, Purpose, AreaUnit, FurnishingStatus, PossessionStatus, OwnershipType } from '../../types/property';
import { formatIndianPrice } from '../../utils/formatters';

interface FilterSidebarProps {
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ className = '' }) => {
  const { filters, setFilters, resetFilters, openUnitConverterModal } = useApp();

  const propertyTypes: { value: PropertyType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Property Types' },
    { value: 'plot', label: 'Plots / Land' },
    { value: 'flat', label: 'Apartments / Flats' },
    { value: 'house', label: 'Independent Houses' },
    { value: 'commercial_shop', label: 'Commercial Shops' },
    { value: 'commercial_office', label: 'Commercial Offices' },
    { value: 'commercial_land', label: 'Commercial Land' }
  ];

  const bedroomsList = [
    { value: 'all', label: 'Any' },
    { value: 1, label: '1 BHK' },
    { value: 2, label: '2 BHK' },
    { value: 3, label: '3 BHK' },
    { value: 4, label: '4+ BHK' }
  ];

  const furnishingList: { value: FurnishingStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Any' },
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'fully-furnished', label: 'Fully Furnished' }
  ];

  const possessionList: { value: PossessionStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Any' },
    { value: 'ready_to_move', label: 'Ready to Move' },
    { value: 'immediate', label: 'Immediate' },
    { value: 'under_construction', label: 'Under Construction' }
  ];

  const postedByList: { value: OwnershipType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'owner', label: 'Owner Direct' },
    { value: 'builder', label: 'Builder / Developer' },
    { value: 'agent', label: 'Verified Agent' }
  ];

  return (
    <aside className={`bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Reset All</span>
        </button>
      </div>

      {/* Verified Only Toggle */}
      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <div>
            <div className="text-xs font-bold text-emerald-950">Verified Properties Only</div>
            <div className="text-[10px] text-emerald-700">Inspected by our local team</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* Purpose (Buy / Rent) */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
          Purpose
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, purpose: 'buy' }))}
            className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              filters.purpose === 'buy'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, purpose: 'rent' }))}
            className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              filters.purpose === 'rent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {/* Locality */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
          Locality
        </label>
        <select
          value={filters.locality || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value || undefined }))}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
        >
          <option value="">All Localities in Hazaribagh</option>
          {HAZARIBAGH_LOCALITIES.map((loc) => (
            <option key={loc.id} value={loc.name}>{loc.name}</option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
          Property Type
        </label>
        <div className="space-y-1">
          {propertyTypes.map((pt) => {
            const isSelected = (filters.propertyType || 'all') === pt.value;
            return (
              <button
                key={pt.value}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, propertyType: pt.value }))}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{pt.label}</span>
                {isSelected && <Check size={13} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Range Slider / Inputs */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
          Budget Range (INR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400">Min:</span>
            <input
              type="number"
              placeholder="e.g. 2000000"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            {filters.minPrice ? (
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
                {formatIndianPrice(filters.minPrice)}
              </span>
            ) : null}
          </div>

          <div>
            <span className="text-[10px] text-slate-400">Max:</span>
            <input
              type="number"
              placeholder="e.g. 8000000"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            {filters.maxPrice ? (
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
                {formatIndianPrice(filters.maxPrice)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bedrooms (For Flats & Houses) */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
          Bedrooms (BHK)
        </label>
        <div className="grid grid-cols-5 gap-1">
          {bedroomsList.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, bedrooms: b.value as any }))}
              className={`py-1.5 text-center text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                filters.bedrooms === b.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posted By */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
          Listed By
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {postedByList.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, listedBy: item.value }))}
              className={`py-1.5 px-2 text-left text-xs rounded-md border transition-colors cursor-pointer ${
                (filters.listedBy || 'all') === item.value
                  ? 'bg-blue-50 text-blue-900 border-blue-600 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Land Unit Quick Helper Link */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={openUnitConverterModal}
          className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Calculator size={14} className="text-blue-600" />
          <span>Need Land Unit Conversion?</span>
        </button>
      </div>
    </aside>
  );
};

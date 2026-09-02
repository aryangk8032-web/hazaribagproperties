import React, { useState } from 'react';
import { Search, MapPin, Building, ChevronDown, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HAZARIBAGH_LOCALITIES } from '../../data/localities';
import { PropertyType, Purpose } from '../../types/property';

export const HeroSearch: React.FC = () => {
  const { filters, setFilters, navigate } = useApp();

  const [purpose, setPurpose] = useState<Purpose>('buy');
  const [locality, setLocality] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<string>('all');
  const [naturalQuery, setNaturalQuery] = useState<string>('');

  const propertyTypes: { value: string; label: string }[] = [
    { value: 'all', label: 'All Property Types' },
    { value: 'plot', label: 'Plot / Land' },
    { value: 'flat', label: 'Apartment / Flat' },
    { value: 'house', label: 'Independent House' },
    { value: 'commercial_shop', label: 'Commercial Shop' },
    { value: 'commercial_office', label: 'Commercial Office' },
    { value: 'commercial_land', label: 'Highway Commercial Land' }
  ];

  const budgetOptionsBuy = [
    { value: 'all', label: 'Any Budget' },
    { value: 'under-30l', label: 'Under ₹30 Lakh', min: 0, max: 3000000 },
    { value: '30l-60l', label: '₹30 Lakh - ₹60 Lakh', min: 3000000, max: 6000000 },
    { value: '60l-1cr', label: '₹60 Lakh - ₹1 Crore', min: 6000000, max: 10000000 },
    { value: 'above-1cr', label: 'Above ₹1 Crore', min: 10000000, max: undefined }
  ];

  const budgetOptionsRent = [
    { value: 'all', label: 'Any Rent' },
    { value: 'under-10k', label: 'Under ₹10,000 / mo', min: 0, max: 10000 },
    { value: '10k-25k', label: '₹10,000 - ₹25,000 / mo', min: 10000, max: 25000 },
    { value: 'above-25k', label: 'Above ₹25,000 / mo', min: 25000, max: undefined }
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    const budgetList = purpose === 'buy' ? budgetOptionsBuy : budgetOptionsRent;
    const selectedBudget = budgetList.find(b => b.value === budgetRange);
    if (selectedBudget) {
      minPrice = selectedBudget.min;
      maxPrice = selectedBudget.max;
    }

    setFilters(prev => ({
      ...prev,
      purpose,
      locality: locality || undefined,
      propertyType: propertyType === 'all' ? 'all' : (propertyType as PropertyType),
      minPrice,
      maxPrice,
      searchQuery: naturalQuery.trim()
    }));

    navigate('/properties');
  };

  const handleQuickTagClick = (tag: string, loc?: string, type?: PropertyType) => {
    setNaturalQuery(tag);
    if (loc) setLocality(loc);
    if (type) setPropertyType(type);
    
    setFilters(prev => ({
      ...prev,
      purpose: 'buy',
      locality: loc || undefined,
      propertyType: type || 'all',
      searchQuery: tag
    }));
    navigate('/properties');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Purpose Tabs */}
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => setPurpose('buy')}
          className={`px-5 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            purpose === 'buy'
              ? 'bg-white text-slate-900 shadow-sm border-t-2 border-blue-600'
              : 'bg-white/60 text-slate-600 hover:bg-white'
          }`}
        >
          Buy Property
        </button>
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`px-5 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            purpose === 'rent'
              ? 'bg-white text-slate-900 shadow-sm border-t-2 border-blue-600'
              : 'bg-white/60 text-slate-600 hover:bg-white'
          }`}
        >
          Rent Property
        </button>
        <span className="text-[11px] text-slate-400 font-medium ml-auto hidden sm:inline-block">
          Explore 100+ verified listings in Hazaribagh
        </span>
      </div>

      {/* Main Search Container */}
      <form 
        onSubmit={handleSearch}
        className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4"
      >
        {/* Natural Search Input Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={naturalQuery}
            onChange={(e) => setNaturalQuery(e.target.value)}
            placeholder="Search by keyword e.g. 'Plot near Lake Road', '3 BHK Hurhuru', 'Shop Bada Bazar'..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Structured Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Locality Selector */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-0.5">
              Locality
            </label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-2.5 text-blue-600 pointer-events-none" />
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer appearance-none"
              >
                <option value="">All Localities in Hazaribagh</option>
                {HAZARIBAGH_LOCALITIES.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.totalListingsCount} listings)
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Property Type Selector */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-0.5">
              Property Type
            </label>
            <div className="relative">
              <Building size={15} className="absolute left-3 top-2.5 text-blue-600 pointer-events-none" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer appearance-none"
              >
                {propertyTypes.map((pt) => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Budget Selector */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ml-0.5">
              Budget Range
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-blue-600 pointer-events-none">₹</span>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer appearance-none"
              >
                {(purpose === 'buy' ? budgetOptionsBuy : budgetOptionsRent).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* CTA Button & Quick Chips */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Search Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Popular:</span>
            <button
              type="button"
              onClick={() => handleQuickTagClick('Plot in Matwari', 'Matwari', 'plot')}
              className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Matwari Plots
            </button>
            <button
              type="button"
              onClick={() => handleQuickTagClick('3 BHK in Hurhuru', 'Hurhuru', 'flat')}
              className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Hurhuru Flats
            </button>
            <button
              type="button"
              onClick={() => handleQuickTagClick('Canary Hill Land', 'Canary Hill Road', 'plot')}
              className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Canary Hill
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            <Search size={16} />
            <span>Search Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
};

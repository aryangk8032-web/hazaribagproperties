import React, { useState } from 'react';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HAZARIBAGH_LOCALITIES } from '../../data/localities';
import { PropertyCard } from '../common/PropertyCard';
import { LocalityCard } from '../common/LocalityCard';

interface LocalityViewProps {
  slug: string;
}

export const LocalityView: React.FC<LocalityViewProps> = ({ slug }) => {
  const { properties, navigate, setQuickFilter } = useApp();

  const currentLocality = HAZARIBAGH_LOCALITIES.find(l => l.slug === slug) || HAZARIBAGH_LOCALITIES[0];
  const [activeTab, setActiveTab] = useState<'all' | 'plots' | 'flats' | 'commercial'>('all');

  // Listings for this locality
  const localityListings = properties.filter(p => 
    p.listingStatus === 'live' && 
    p.locality.toLowerCase().includes(currentLocality.name.toLowerCase())
  );

  const filteredListings = localityListings.filter(p => {
    if (activeTab === 'plots') return p.propertyType === 'plot' || p.propertyType === 'commercial_land';
    if (activeTab === 'flats') return p.propertyType === 'flat' || p.propertyType === 'house';
    if (activeTab === 'commercial') return p.propertyType === 'commercial_shop' || p.propertyType === 'commercial_office';
    return true;
  });

  const otherLocalities = HAZARIBAGH_LOCALITIES.filter(l => l.id !== currentLocality.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Home</button>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-500">Localities in Hazaribagh</span>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-900 font-bold">{currentLocality.name}</span>
      </nav>

      {/* Locality Hero Banner */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 text-white min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-10 border border-slate-800 shadow-sm">
        <img
          src={currentLocality.image}
          alt={`Real Estate in ${currentLocality.name}, Hazaribagh`}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Locality Guide
            </span>
            <span className="text-xs text-blue-200 font-medium">
              PIN {currentLocality.pincode} • Hazaribagh, Jharkhand
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Real Estate in {currentLocality.name}, Hazaribagh
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {currentLocality.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-md bg-slate-800/90 backdrop-blur-xs border border-slate-700">
              <span className="text-slate-400">Plots Benchmark: </span>
              <strong className="text-blue-400 font-semibold">{currentLocality.avgPlotPricePerDecimal}/decimal</strong>
            </div>
            <div className="px-3 py-1.5 rounded-md bg-slate-800/90 backdrop-blur-xs border border-slate-700">
              <span className="text-slate-400">Flats Benchmark: </span>
              <strong className="text-blue-400 font-semibold">{currentLocality.avgFlatPricePerSqFt}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-md bg-slate-800/90 backdrop-blur-xs border border-slate-700">
              <span className="text-slate-400">Total Live Listings: </span>
              <strong className="text-blue-400 font-semibold">{currentLocality.totalListingsCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Locality Highlights & Landmarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-blue-600">
            <Compass size={16} />
            <span>Key Landmarks & Hubs</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {currentLocality.landmarks.map((lm) => (
              <li key={lm} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                <span>{lm}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-blue-600">
            <TrendingUp size={16} />
            <span>Connectivity Highlights</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {currentLocality.connectivityHighlights.map((ch) => (
              <li key={ch} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-blue-600">
            <Sparkles size={16} />
            <span>Popular For</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {currentLocality.popularFor.map((pf) => (
              <li key={pf} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                <span>{pf}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Active Listings in this Locality */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Verified Properties in {currentLocality.name}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredListings.length} available listings
            </p>
          </div>

          {/* Sub-filter tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-md border border-slate-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({localityListings.length})
            </button>
            <button
              onClick={() => setActiveTab('plots')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === 'plots' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plots / Land
            </button>
            <button
              onClick={() => setActiveTab('flats')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === 'flats' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flats & Homes
            </button>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3 shadow-sm">
            <Building size={28} className="mx-auto text-slate-400" />
            <div className="text-sm font-bold text-slate-800">
              No matching properties currently active in {currentLocality.name} for this category.
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Explore All Hazaribagh Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>

      {/* Switch to Other Localities */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Explore Other Localities in Hazaribagh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherLocalities.slice(0, 4).map((loc) => (
            <LocalityCard key={loc.id} locality={loc} />
          ))}
        </div>
      </div>
    </div>
  );
};

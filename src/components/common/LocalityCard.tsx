import React from 'react';
import { MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { Locality } from '../../types/property';
import { useApp } from '../../context/AppContext';

interface LocalityCardProps {
  locality: Locality;
}

export const LocalityCard: React.FC<LocalityCardProps> = ({ locality }) => {
  const { navigate, setQuickFilter } = useApp();

  const handleLocalityClick = () => {
    navigate(`/locality/${locality.slug}`);
  };

  const handleExploreListings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickFilter({ locality: locality.name, searchQuery: locality.name });
    navigate('/properties');
  };

  return (
    <div
      onClick={handleLocalityClick}
      className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between shadow-sm"
    >
      <div className="h-36 relative bg-slate-100 overflow-hidden">
        <img
          src={locality.image}
          alt={`Real estate in ${locality.name}, Hazaribagh`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
          {locality.totalListingsCount} Properties
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-[11px] text-blue-300 font-medium">
            <MapPin size={12} />
            <span>PIN {locality.pincode} • Hazaribagh</span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors">
            {locality.name}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Key benchmark metrics */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[11px] text-slate-500 font-medium">Plots Benchmark:</span>
              <span className="font-bold text-slate-900">{locality.avgPlotPricePerDecimal}/dec</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[11px] text-slate-500 font-medium">Flats Benchmark:</span>
              <span className="font-bold text-slate-900">{locality.avgFlatPricePerSqFt}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {locality.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
            {locality.landmarks[0]}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
            Explore <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
};

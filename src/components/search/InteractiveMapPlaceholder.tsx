import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Info, Building, Eye, X, ArrowUpRight } from 'lucide-react';
import { Property } from '../../types/property';
import { useApp } from '../../context/AppContext';
import { formatIndianPrice } from '../../utils/formatters';

interface InteractiveMapPlaceholderProps {
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
  heightClass?: string;
}

export const InteractiveMapPlaceholder: React.FC<InteractiveMapPlaceholderProps> = ({
  properties,
  onSelectProperty,
  heightClass = 'h-[550px]'
}) => {
  const { navigate } = useApp();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'plots' | 'flats' | 'commercial'>('all');

  // Realistic Hazaribagh Town geographic center: ~23.9935° N, 85.3621° E
  // We project latitude/longitude onto a bounded SVG view box
  const minLat = 23.9600;
  const maxLat = 24.0400;
  const minLng = 85.3100;
  const maxLng = 85.4000;

  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 500;
    return { x: Math.max(40, Math.min(760, x)), y: Math.max(40, Math.min(460, y)) };
  };

  const filteredProperties = properties.filter(p => {
    if (activeLayer === 'plots') return p.propertyType === 'plot' || p.propertyType === 'commercial_land';
    if (activeLayer === 'flats') return p.propertyType === 'flat' || p.propertyType === 'house';
    if (activeLayer === 'commercial') return p.propertyType === 'commercial_shop' || p.propertyType === 'commercial_office';
    return true;
  });

  return (
    <div className={`relative w-full ${heightClass} bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex flex-col select-none`}>
      {/* Map Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 pointer-events-auto">
          <button
            type="button"
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeLayer === 'all' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({properties.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('plots')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeLayer === 'plots' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Plots & Land
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('flats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeLayer === 'flats' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flats & Homes
          </button>
        </div>

        {/* Local Map Legend Badge */}
        <div className="px-3 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 text-white text-xs font-medium flex items-center gap-2 pointer-events-auto">
          <Navigation size={13} className="text-emerald-400" />
          <span>Hazaribagh Hyperlocal Spatial Grid</span>
        </div>
      </div>

      {/* SVG Canvas Map Representation */}
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
            </pattern>
            <radialGradient id="canaryHill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#065f46" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#065f46" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hzbLake" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="500" fill="url(#grid)" />

          {/* Canary Hill Forest Topography */}
          <circle cx="620" cy="90" r="85" fill="url(#canaryHill)" />
          <text x="620" y="85" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.8">
            ▲ Canary Hill (610m)
          </text>
          <text x="620" y="100" fill="#059669" fontSize="9" textAnchor="middle" opacity="0.7">
            Protected Eco-Forest Zone
          </text>

          {/* Hazaribagh Lake */}
          <ellipse cx="460" cy="220" rx="60" ry="25" fill="url(#hzbLake)" stroke="#0369a1" strokeWidth="1" strokeDasharray="3,3" />
          <text x="460" y="224" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
            〰 Hazaribagh Lake
          </text>

          {/* Major Roads / NH-33 Arterials */}
          {/* NH-33 Ranchi-Patna Highway */}
          <path
            d="M 120 480 Q 280 300 380 180 T 700 30"
            fill="none"
            stroke="#475569"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />
          <text x="240" y="340" fill="#94a3b8" fontSize="9" fontWeight="600" transform="rotate(-40 240,340)">
            NH-33 (Ranchi - Patna Corridor)
          </text>

          {/* Ring Road Bypass */}
          <path
            d="M 200 420 Q 420 470 680 380 Q 720 220 580 120"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
            strokeDasharray="4,4"
            opacity="0.5"
          />
          <text x="440" y="445" fill="#64748b" fontSize="8" textAnchor="middle">
            Hazaribagh Outer Bypass
          </text>

          {/* Locality Anchor Labels */}
          {[
            { name: 'Matwari', x: 440, y: 180 },
            { name: 'Hurhuru', x: 330, y: 260 },
            { name: 'Canary Hill Rd', x: 580, y: 130 },
            { name: 'Dipugarha (VBU)', x: 260, y: 150 },
            { name: 'Ramnagar', x: 530, y: 190 },
            { name: 'Shivpuri', x: 480, y: 240 },
            { name: 'College More', x: 400, y: 220 },
            { name: 'Bada Bazar', x: 430, y: 260 },
            { name: 'Korra', x: 600, y: 220 },
            { name: 'Pugmil', x: 280, y: 360 },
            { name: 'Sindoor (Station)', x: 660, y: 100 },
            { name: 'Kadma', x: 220, y: 410 },
          ].map((loc) => (
            <g key={loc.name}>
              <circle cx={loc.x} cy={loc.y} r="3" fill="#64748b" opacity="0.6" />
              <text x={loc.x} y={loc.y - 6} fill="#94a3b8" fontSize="9" fontWeight="500" textAnchor="middle">
                {loc.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Render Interactive Property Pins */}
        {filteredProperties.map((prop) => {
          const { x, y } = projectToMap(prop.latitude, prop.longitude);
          const isSelected = selectedProperty?.id === prop.id;
          const isPlot = prop.propertyType === 'plot' || prop.propertyType === 'commercial_land';

          return (
            <div
              key={prop.id}
              style={{ left: `${(x / 800) * 100}%`, top: `${(y / 500) * 100}%` }}
              onClick={() => {
                setSelectedProperty(prop);
                if (onSelectProperty) onSelectProperty(prop);
              }}
              className="absolute -translate-x-1/2 -translate-y-full cursor-pointer z-30 group"
            >
              {/* Pin Pill with Price */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg transition-all transform hover:scale-110 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 z-40'
                    : isPlot
                    ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                    : 'bg-slate-900 text-emerald-300 border border-emerald-500/50 hover:bg-slate-800'
                }`}
              >
                <MapPin size={12} className={isSelected ? 'text-slate-950' : 'text-emerald-300'} />
                <span>{formatIndianPrice(prop.price, prop.purpose)}</span>
              </div>
              {/* Little Pin Arrow */}
              <div
                className={`w-2 h-2 mx-auto rotate-45 -mt-1 ${
                  isSelected ? 'bg-amber-400' : isPlot ? 'bg-emerald-700' : 'bg-slate-900 border-r border-b border-emerald-500/50'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Selected Property Overlay Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src={selectedProperty.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                alt=""
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  {selectedProperty.locality}
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {selectedProperty.title}
                </h4>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {formatIndianPrice(selectedProperty.price, selectedProperty.purpose)}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProperty(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              ID: {selectedProperty.listingId}
            </span>
            <button
              type="button"
              onClick={() => navigate(`/property/${selectedProperty.slug}`)}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
            >
              <span>View Property</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Map Disclaimer */}
      <div className="absolute bottom-2 left-4 text-[10px] text-slate-500 hidden sm:block pointer-events-none">
        * Hyperlocal approximate coordinate layout. Full Google Maps integration enabled in Phase 2.
      </div>
    </div>
  );
};

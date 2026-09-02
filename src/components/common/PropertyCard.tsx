import React from 'react';
import { Heart, MapPin, BedDouble, Bath, Maximize2, Sparkles, Building, Layers } from 'lucide-react';
import { Property } from '../../types/property';
import { useApp } from '../../context/AppContext';
import { formatIndianPrice, formatArea, calculateRatePerUnit } from '../../utils/formatters';
import { VerificationBadge } from './VerificationBadge';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
  showAdminControls?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  layout = 'grid',
  showAdminControls = false
}) => {
  const { navigate, isPropertySaved, toggleSaveProperty, openSiteVisitModal } = useApp();
  const saved = isPropertySaved(property.id);

  const primaryImage = property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  const isPlot = property.propertyType === 'plot' || property.propertyType === 'commercial_land';
  const areaDisplay = isPlot
    ? `${property.plotArea} ${property.areaUnit || 'decimal'}`
    : property.builtUpArea
    ? `${property.builtUpArea} sq.ft`
    : property.carpetArea
    ? `${property.carpetArea} sq.ft`
    : 'N/A';

  const typeLabels: Record<string, string> = {
    plot: 'Plot / Land',
    flat: 'Apartment / Flat',
    house: 'Independent House',
    villa: 'Luxury Villa',
    commercial_shop: 'Commercial Shop',
    commercial_office: 'Commercial Office',
    commercial_land: 'Commercial Land',
    other: 'Property'
  };

  const handleCardClick = () => {
    navigate(`/property/${property.slug}`);
  };

  if (layout === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col sm:flex-row shadow-sm"
      >
        {/* Image Container */}
        <div className="sm:w-72 h-52 sm:h-auto relative bg-slate-100 shrink-0 overflow-hidden">
          <img
            src={primaryImage}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {property.verificationStatus === 'verified' && <VerificationBadge size="sm" />}
            {property.featured && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProperty(property.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              saved ? 'bg-rose-50 text-rose-600 shadow-sm' : 'bg-slate-900/50 hover:bg-slate-900/80 text-white'
            }`}
            aria-label="Save property"
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90">
            {property.images?.length || 1} Photos
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                {typeLabels[property.propertyType] || 'Property'} • For {property.purpose === 'buy' ? 'Sale' : 'Rent'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono font-medium">
                ID: {property.listingId}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {property.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800">{property.locality}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 truncate">{property.landmark || 'Hazaribagh, Jharkhand'}</span>
            </div>

            {/* Specs Pills */}
            <div className="flex items-center gap-3 text-xs text-slate-700 py-2.5 border-y border-slate-100 flex-wrap">
              <div className="flex items-center gap-1">
                <Maximize2 size={13} className="text-slate-400" />
                <span className="font-semibold text-slate-900">{areaDisplay}</span>
              </div>

              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <BedDouble size={13} className="text-slate-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}

              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath size={13} className="text-slate-400" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}

              {property.roadWidthFt && (
                <div className="text-slate-600">
                  <span className="text-slate-400">Road:</span> {property.roadWidthFt} ft
                </div>
              )}

              {property.facing && (
                <div className="text-slate-600">
                  <span className="text-slate-400">Facing:</span> {property.facing}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-2">
            <div>
              <div className="text-xl font-bold text-slate-900 tracking-tight">
                {formatIndianPrice(property.price, property.purpose)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {isPlot && property.plotArea
                  ? `₹${Math.round(property.price / property.plotArea).toLocaleString('en-IN')} / ${property.areaUnit}`
                  : property.builtUpArea
                  ? `₹${Math.round(property.price / property.builtUpArea).toLocaleString('en-IN')} / sq.ft`
                  : property.isPriceNegotiable ? 'Negotiable' : 'Fixed Price'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openSiteVisitModal(property);
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shadow-sm shadow-blue-500/20"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout Default
  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col shadow-sm"
    >
      {/* Image Container */}
      <div className="h-52 relative bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-50" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {property.verificationStatus === 'verified' && <VerificationBadge size="sm" />}
          {property.featured && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProperty(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
            saved ? 'bg-rose-50 text-rose-600 shadow-sm' : 'bg-slate-900/50 hover:bg-slate-900/80 text-white'
          }`}
          aria-label="Save property"
        >
          <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Bottom image overlay stats */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            {typeLabels[property.propertyType] || 'Property'}
          </span>
          <span className="text-[11px] text-white/90">
            {property.images?.length || 1} Photos
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Rate */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {formatIndianPrice(property.price, property.purpose)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate">
              {isPlot && property.plotArea
                ? `₹${Math.round(property.price / property.plotArea).toLocaleString('en-IN')}/${property.areaUnit}`
                : property.builtUpArea
                ? `₹${Math.round(property.price / property.builtUpArea).toLocaleString('en-IN')}/sq.ft`
                : ''}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{property.locality}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 truncate">{property.landmark || 'Hazaribagh'}</span>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 py-2 border-t border-slate-100 bg-slate-50/80 rounded-lg px-2.5">
            <div className="flex items-center gap-1.5">
              <Maximize2 size={13} className="text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-900 truncate">{areaDisplay}</span>
            </div>

            {property.bedrooms ? (
              <div className="flex items-center gap-1.5">
                <BedDouble size={13} className="text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">{property.bedrooms} BHK</span>
              </div>
            ) : property.roadWidthFt ? (
              <div className="text-slate-600 truncate">
                <span className="text-slate-400">Road:</span> {property.roadWidthFt} ft
              </div>
            ) : (
              <div className="text-slate-600 truncate">
                <span className="text-slate-400">Facing:</span> {property.facing || 'East'}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            By {property.listedBy === 'builder' ? 'Builder' : property.listedBy === 'agent' ? 'Agent' : 'Owner'}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openSiteVisitModal(property);
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Visit Property →
          </button>
        </div>
      </div>
    </div>
  );
};

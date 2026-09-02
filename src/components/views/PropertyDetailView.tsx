import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Maximize2, 
  BedDouble, 
  Bath, 
  Compass, 
  Layers, 
  CheckCircle2, 
  FileCheck, 
  AlertTriangle, 
  ChevronRight, 
  Calculator, 
  Building2, 
  Sparkles, 
  ArrowLeft,
  Eye,
  Info,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatIndianPrice, formatArea, calculateRatePerUnit } from '../../utils/formatters';
import { VerificationBadge } from '../common/VerificationBadge';
import { PropertyCard } from '../common/PropertyCard';
import { ShareModal } from '../common/ShareModal';
import { Property } from '../../types/property';

interface PropertyDetailViewProps {
  slug: string;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ slug }) => {
  const { 
    properties, 
    navigate, 
    isPropertySaved, 
    toggleSaveProperty, 
    openSiteVisitModal, 
    openInquiryModal,
    openUnitConverterModal,
    openVerificationModal
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Find property by slug
  const property = properties.find(p => p.slug === slug || p.id === slug);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Building2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Property Listing Not Found</h2>
        <p className="text-xs text-slate-500">The listing may have been sold or removed.</p>
        <button
          onClick={() => navigate('/properties')}
          className="px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl"
        >
          Browse Available Properties
        </button>
      </div>
    );
  }

  const saved = isPropertySaved(property.id);
  const isPlot = property.propertyType === 'plot' || property.propertyType === 'commercial_land';
  const similarProperties = properties
    .filter(p => p.id !== property.id && p.listingStatus === 'live' && (p.locality === property.locality || p.propertyType === property.propertyType))
    .slice(0, 3);

  const typeLabels: Record<string, string> = {
    plot: 'Plot / Land Parcel',
    flat: 'Apartment / Flat',
    house: 'Independent House / Duplex',
    villa: 'Independent Villa',
    commercial_shop: 'Commercial Retail Shop',
    commercial_office: 'Commercial Office Space',
    commercial_land: 'Highway Commercial Land'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Home</button>
        <ChevronRight size={13} className="text-slate-400" />
        <button onClick={() => navigate('/properties')} className="hover:text-blue-600 cursor-pointer">
          {property.purpose === 'buy' ? 'Buy' : 'Rent'}
        </button>
        <ChevronRight size={13} className="text-slate-400" />
        <button 
          onClick={() => navigate(`/locality/${property.locality.toLowerCase().replace(/\s+/g, '-')}`)}
          className="hover:text-blue-600 font-medium cursor-pointer"
        >
          {property.locality}
        </button>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-[200px]">{property.title}</span>
      </nav>

      {/* Main Title & Action Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
              {typeLabels[property.propertyType] || 'Property'} • For {property.purpose === 'buy' ? 'Sale' : 'Rent'}
            </span>
            {property.verificationStatus === 'verified' && <VerificationBadge size="md" />}
            <span className="text-xs text-slate-400 font-mono">ID: {property.listingId}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <MapPin size={15} className="text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-800">{property.locality}</span>
            <span className="text-slate-300">•</span>
            <span>{property.landmark ? `${property.landmark}, ` : ''}Hazaribagh, Jharkhand – {property.pincode || '825301'}</span>
          </div>
        </div>

        {/* Action Buttons: Save & Share */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => toggleSaveProperty(property.id)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="space-y-3">
        <div className="relative h-[320px] sm:h-[460px] w-full rounded-xl bg-slate-900 overflow-hidden border border-slate-200">
          <img
            src={property.images[activeImageIndex]?.url || property.images[0]?.url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Image caption / count */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
            <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-md text-xs">
              {property.images[activeImageIndex]?.caption || `Photo ${activeImageIndex + 1} of ${property.images.length}`}
            </div>
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-md text-emerald-400 font-medium flex items-center gap-1 text-xs">
              <ShieldCheck size={14} />
              <span>Verified On-Site Photography</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {property.images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {property.images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-blue-600 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details (Left 2 Cols) & Sticky Lead Card (Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Property Details & Specifications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {isPlot ? 'Land Area' : 'Super Built-Up'}
              </span>
              <div className="text-base font-bold text-slate-900">
                {isPlot
                  ? `${property.plotArea} ${property.areaUnit || 'decimal'}`
                  : `${property.builtUpArea || property.carpetArea} sq.ft`}
              </div>
              {isPlot && property.areaUnit === 'decimal' && (
                <div className="text-[10px] text-slate-500 font-medium">
                  ≈ {(property.plotArea! * 435.6).toLocaleString('en-IN')} sq.ft
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Facing
              </span>
              <div className="text-base font-bold text-slate-900">
                {property.facing || 'East Facing'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Vastu Compliant
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Road Width
              </span>
              <div className="text-base font-bold text-slate-900">
                {property.roadWidthFt ? `${property.roadWidthFt} Feet` : '20 Feet'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Frontage Approach
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Possession
              </span>
              <div className="text-base font-bold text-blue-600 capitalize">
                {property.possession?.replace('_', ' ') || 'Immediate'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Ready for Transfer
              </div>
            </div>
          </div>

          {/* Detailed Property Specifications Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              <span>Property Overview & Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Property Type:</span>
                <span className="font-semibold text-slate-900">{typeLabels[property.propertyType]}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Transaction:</span>
                <span className="font-semibold text-slate-900 capitalize">For {property.purpose}</span>
              </div>

              {property.bedrooms && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Bedrooms:</span>
                  <span className="font-semibold text-slate-900">{property.bedrooms} BHK</span>
                </div>
              )}

              {property.bathrooms && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Bathrooms:</span>
                  <span className="font-semibold text-slate-900">{property.bathrooms}</span>
                </div>
              )}

              {property.balconies !== undefined && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Balconies:</span>
                  <span className="font-semibold text-slate-900">{property.balconies}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Ownership Type:</span>
                <span className="font-semibold text-slate-900 capitalize">Direct {property.ownership}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Boundary Wall:</span>
                <span className="font-semibold text-slate-900">
                  {property.boundaryWall ? 'Constructed & Demarcated' : 'Open / Marked'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Water Supply:</span>
                <span className="font-semibold text-slate-900">{property.waterSupply || 'Borewell Available'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Electricity Connection:</span>
                <span className="font-semibold text-slate-900">{property.electricityStatus || 'Available'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Negotiable:</span>
                <span className="font-semibold text-slate-900">
                  {property.isPriceNegotiable ? 'Yes, Open to Discussion' : 'Fixed Price'}
                </span>
              </div>
            </div>
          </div>

          {/* Jharkhand / Hazaribagh Land & Revenue Record Specifics */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck size={18} className="text-blue-600" />
                <span>Jharkhand Revenue & Title Records</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Pre-Checked by Team
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-medium">Khatiyan Type:</span>
                <div className="font-bold text-slate-900">{property.khatiyanType || 'RS Khatiyan (Revision Survey)'}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-medium">Mutation Status (Dakhil Kharij):</span>
                <div className="font-bold text-slate-900">{property.mutationStatus || 'Up-to-date in Jharbhoomi'}</div>
              </div>

              {property.khataNumber && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Khata Number:</span>
                  <div className="font-bold text-slate-900">{property.khataNumber}</div>
                </div>
              )}

              {property.plotNumber && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Plot / Khesra Number:</span>
                  <div className="font-bold text-slate-900">{property.plotNumber}</div>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle size={14} className="text-amber-700" />
                <span>Buyer Due Diligence Advisory</span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                Always review certified copies of RS Khatiyan, Land Possession Certificate (LPC), and recent revenue receipts (Lagaan Rashid) before advancing tokens. Our team assists you during on-site documentation review.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Detailed Property Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                Amenities & Infrastructure
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-xs font-medium text-slate-800">
                    <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                    <span className="capitalize">{item.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Key Landmarks */}
          {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                Locality Distances & Connectivity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.nearbyLandmarks.map((lm) => (
                  <div key={lm.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <MapPin size={13} className="text-blue-600" />
                      <span>{lm.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{lm.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Contact & Pricing Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Price & Action Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-md space-y-5">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  {property.purpose === 'buy' ? 'Total Price' : 'Monthly Rent'}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
                  {formatIndianPrice(property.price, property.purpose)}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {isPlot && property.plotArea
                    ? `₹${Math.round(property.price / property.plotArea).toLocaleString('en-IN')} per ${property.areaUnit || 'decimal'}`
                    : property.builtUpArea
                    ? `₹${Math.round(property.price / property.builtUpArea).toLocaleString('en-IN')} per sq.ft`
                    : property.isPriceNegotiable ? 'Negotiable' : 'Fixed Price'}
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openSiteVisitModal(property)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  <Calendar size={16} />
                  <span>Schedule Free Site Visit</span>
                </button>

                <button
                  type="button"
                  onClick={() => openInquiryModal(property)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-md text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare size={15} />
                  <span>Inquire / Contact Owner</span>
                </button>
              </div>

              {/* Area Converter Quick Trigger */}
              <button
                type="button"
                onClick={openUnitConverterModal}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calculator size={14} className="text-blue-600" />
                <span>Calculate Decimal / Katha / Sq.ft</span>
              </button>

              {/* Trust Summary */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  <span>Zero brokerage for direct buyer inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  <span>On-ground visit escorted by Hazaribagh specialist</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  <span>Verified contact info of genuine seller</span>
                </div>
              </div>
            </div>

            {/* Verification Standard Banner */}
            <div 
              onClick={openVerificationModal}
              className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-2 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-blue-400">
                <ShieldCheck size={16} />
                <span>Hazaribagh Verification Seal</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                This listing was physically visited and checked against land registry records. Read our verification guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Similar Properties in {property.locality}
            </h2>
            <button
              onClick={() => navigate('/properties')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              View All Properties →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarProperties.map((simProp) => (
              <PropertyCard key={simProp.id} property={simProp} />
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        property={property}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  FileCheck, 
  Image, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Calculator,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HAZARIBAGH_LOCALITIES } from '../../data/localities';
import { Property, PropertyType, Purpose, AreaUnit, FurnishingStatus, PossessionStatus, OwnershipType } from '../../types/property';
import { formatIndianPrice } from '../../utils/formatters';

export const AddPropertyWizard: React.FC = () => {
  const { addProperty, navigate, showToast, userName, userPhone, openUnitConverterModal } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    purpose: 'buy',
    propertyType: 'plot',
    price: 3500000,
    isPriceNegotiable: true,
    locality: 'Matwari',
    landmark: 'Near Gandhi Maidan',
    pincode: '825301',
    plotArea: 4.5,
    areaUnit: 'decimal',
    roadWidthFt: 20,
    facing: 'East',
    boundaryWall: true,
    khatiyanType: 'RS Khatiyan',
    mutationStatus: 'Up-to-date',
    khataNumber: '42',
    plotNumber: '118',
    bedrooms: 3,
    bathrooms: 2,
    furnishing: 'unfurnished',
    possession: 'immediate',
    ownership: 'freehold',
    waterSupply: 'Borewell Available',
    electricityStatus: 'Available',
    description: 'Prime residential plot situated in a quiet, well-developed colony of Matwari. Clear title, RS Khatiyan with up-to-date Jharbhoomi mutation. Ready for immediate registry and house construction.',
    amenities: ['water_supply', 'electricity_ready', 'wide_road', 'vastu_compliant'],
    images: [
      {
        id: 'img-user-1',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        caption: 'Front plot view',
        isPrimary: true
      }
    ],
    contactPhone: userPhone || '9431100000',
    contactWhatsapp: userPhone || '9431100000',
    listedBy: 'owner'
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const newImg = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      caption: `Property photo ${formData.images?.length ? formData.images.length + 1 : 1}`,
      isPrimary: (formData.images?.length || 0) === 0
    };
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImg]
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img.id !== id) || []
    }));
  };

  const handleToggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      showToast('Please provide a property title', 'error');
      setStep(1);
      return;
    }

    if (!formData.price || formData.price <= 0) {
      showToast('Please provide a valid price', 'error');
      setStep(1);
      return;
    }

    // Submit as pending_verification
    addProperty({
      ...formData,
      listingStatus: 'pending_verification',
      verificationStatus: 'unverified',
      sellerId: 'user-seller-current',
      sellerName: userName || 'Property Owner',
      latitude: 23.9935,
      longitude: 85.3621,
      nearbyLandmarks: [
        { name: 'Hazaribagh Lake', distance: '1.2 km' },
        { name: 'DC Office', distance: '1.8 km' }
      ]
    });

    showToast('Listing submitted successfully! Our team will review title documents for verification.', 'success');
    navigate('/dashboard');
  };

  const isPlot = formData.propertyType === 'plot' || formData.propertyType === 'commercial_land';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Owner & Builder Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          List Your Property in Hazaribagh
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reach genuine buyers and tenants. All listings undergo document & on-site verification before going live.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-4">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Location & Specs' },
          { num: 3, label: 'Land Records' },
          { num: 4, label: 'Photos & Contact' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : step > s.num
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s.num ? <Check size={14} /> : s.num}
            </div>
            <span className={`text-xs hidden sm:inline ${step === s.num ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              <span>Step 1: Basic Listing Information</span>
            </h2>

            {/* Purpose */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                Listing Purpose *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, purpose: 'buy' }))}
                  className={`p-3 rounded-lg border text-xs font-bold text-left transition-all cursor-pointer ${
                    formData.purpose === 'buy'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🏡 Sell Property
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, purpose: 'rent' }))}
                  className={`p-3 rounded-lg border text-xs font-bold text-left transition-all cursor-pointer ${
                    formData.purpose === 'rent'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🔑 Rent Out Property
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                Property Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { value: 'plot', label: 'Plot / Land' },
                  { value: 'flat', label: 'Apartment' },
                  { value: 'house', label: 'House' },
                  { value: 'commercial_shop', label: 'Shop' },
                  { value: 'commercial_office', label: 'Office' },
                  { value: 'commercial_land', label: 'Comm. Land' },
                ].map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: pt.value as PropertyType }))}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      formData.propertyType === pt.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                Property Title / Headline *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. 4.5 Decimal Prime Residential Plot in Matwari Near Lake Road"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Price & Negotiability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                  {formData.purpose === 'buy' ? 'Total Asking Price (INR) *' : 'Monthly Rent (INR) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                {formData.price ? (
                  <span className="text-xs text-blue-700 font-semibold block">
                    Formatted: {formatIndianPrice(formData.price, formData.purpose)}
                  </span>
                ) : null}
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-md border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPriceNegotiable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPriceNegotiable: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-800">Price is open to reasonable negotiation</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Area Specs */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              <span>Step 2: Location & Physical Dimensions</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                  Locality in Hazaribagh *
                </label>
                <select
                  value={formData.locality}
                  onChange={(e) => setFormData(prev => ({ ...prev, locality: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  {HAZARIBAGH_LOCALITIES.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                  Landmark / Colony Name
                </label>
                <input
                  type="text"
                  value={formData.landmark || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                  placeholder="e.g. Near Lake Road, Gandhi Maidan"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.pincode || '825301'}
                  onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Area Dimensions */}
            {isPlot ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Land Area & Unit</span>
                  <button
                    type="button"
                    onClick={openUnitConverterModal}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Calculator size={13} />
                    <span>Unit Converter</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Land Size</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.plotArea || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, plotArea: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Measurement Unit</label>
                    <select
                      value={formData.areaUnit || 'decimal'}
                      onChange={(e) => setFormData(prev => ({ ...prev, areaUnit: e.target.value as AreaUnit }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      <option value="decimal">Decimal (1 Decimal = 435.6 sq.ft)</option>
                      <option value="katha">Katha (1 Katha ≈ 3.75 - 4 Decimals)</option>
                      <option value="sqft">Square Feet (sq.ft)</option>
                      <option value="acre">Acre</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Built-Up Area (sq.ft)</label>
                  <input
                    type="number"
                    value={formData.builtUpArea || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, builtUpArea: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g. 1350"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Bedrooms (BHK)</label>
                  <select
                    value={formData.bedrooms || 3}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms || 2}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Approach Road & Facing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Road Width (Feet)</label>
                <input
                  type="number"
                  value={formData.roadWidthFt || 20}
                  onChange={(e) => setFormData(prev => ({ ...prev, roadWidthFt: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Facing</label>
                <select
                  value={formData.facing || 'East'}
                  onChange={(e) => setFormData(prev => ({ ...prev, facing: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="East">East Facing (Vastu Preferred)</option>
                  <option value="North">North Facing</option>
                  <option value="West">West Facing</option>
                  <option value="South">South Facing</option>
                  <option value="North-East">North-East Facing</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Boundary Wall</label>
                <select
                  value={formData.boundaryWall ? 'yes' : 'no'}
                  onChange={(e) => setFormData(prev => ({ ...prev, boundaryWall: e.target.value === 'yes' }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="yes">Yes, Constructed</option>
                  <option value="no">No / Open Land</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Jharkhand Land Records & Revenue Verification */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileCheck size={18} className="text-blue-600" />
              <span>Step 3: Jharkhand Revenue & Title Information</span>
            </h2>

            <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Why we ask for Khatiyan details:</strong>
                Clear Khatiyan and mutation details allow us to assign the <strong>Verified Trust Badge</strong> to your listing, making it receive 4x more genuine buyer inquiries.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Khatiyan Type</label>
                <select
                  value={formData.khatiyanType || 'RS Khatiyan'}
                  onChange={(e) => setFormData(prev => ({ ...prev, khatiyanType: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="RS Khatiyan">RS Khatiyan (Revision Survey - Standard)</option>
                  <option value="CS Khatiyan">CS Khatiyan (Cadastral Survey)</option>
                  <option value="Direct Freehold Registry">Direct Freehold Registry</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Jharbhoomi Mutation Status</label>
                <select
                  value={formData.mutationStatus || 'Up-to-date'}
                  onChange={(e) => setFormData(prev => ({ ...prev, mutationStatus: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="Up-to-date">Up-to-date in Jharbhoomi Portal (Online)</option>
                  <option value="Offline Mutation Done">Offline Mutation Done</option>
                  <option value="Applied / In Process">Applied / In Process</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Khata Number</label>
                <input
                  type="text"
                  value={formData.khataNumber || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, khataNumber: e.target.value }))}
                  placeholder="e.g. 42"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1">Plot / Khesra Number</label>
                <input
                  type="text"
                  value={formData.plotNumber || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, plotNumber: e.target.value }))}
                  placeholder="e.g. 118"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                Detailed Property Description *
              </label>
              <textarea
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Highlight nearby schools, road connectivity, water availability, and any special features..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Photos, Amenities & Contact */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Image size={18} className="text-blue-600" />
              <span>Step 4: Photography & Contact Details</span>
            </h2>

            {/* Amenities Grid */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                Select Amenities & Infrastructure
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'water_supply', label: 'Borewell / Water' },
                  { key: 'electricity_ready', label: 'Electricity Ready' },
                  { key: 'wide_road', label: 'Wide Pitch Road' },
                  { key: 'boundary_wall', label: 'Demarcated Boundary' },
                  { key: 'vastu_compliant', label: 'Vastu Compliant' },
                  { key: 'drainage_system', label: 'Drainage Facility' },
                  { key: 'car_parking', label: 'Car Parking' },
                  { key: 'gated_security', label: 'Gated Security' },
                ].map((amenity) => {
                  const isChecked = formData.amenities?.includes(amenity.key);
                  return (
                    <button
                      key={amenity.key}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity.key)}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{amenity.label}</span>
                      {isChecked && <Check size={14} className="text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photos Strip */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                Property Photos
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL (Unsplash or image hosting link)..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Photo</span>
                </button>
              </div>

              {/* Photo preview thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images?.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-200 h-24 bg-slate-100">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded opacity-90 hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    {img.isPrimary && (
                      <span className="absolute bottom-1 left-1 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                  Your Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+91 94311 00000"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                  Listed By
                </label>
                <select
                  value={formData.listedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, listedBy: e.target.value as any }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="owner">Direct Owner</option>
                  <option value="builder">Builder / Developer</option>
                  <option value="agent">Authorized Real Estate Agent</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <span>Next: {step === 1 ? 'Location & Specs' : step === 2 ? 'Land Records' : 'Photos & Submit'}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Check size={16} />
              <span>Submit Listing for Free Verification</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { ChevronRight, Building2, ShieldCheck, MapPin, Calculator, Layers, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyType, Purpose } from '../../types/property';
import { PropertyCard } from '../common/PropertyCard';
import { HAZARIBAGH_LOCALITIES } from '../../data/localities';

interface CategorySEOViewProps {
  categoryKey: 'plots' | 'flats' | 'houses' | 'commercial' | 'rentals';
}

export const CategorySEOView: React.FC<CategorySEOViewProps> = ({ categoryKey }) => {
  const { properties, navigate, setQuickFilter, openUnitConverterModal } = useApp();

  const categoryConfigs = {
    plots: {
      title: 'Plots & Land for Sale in Hazaribagh',
      type: 'plot' as PropertyType,
      purpose: 'buy' as Purpose,
      description: 'Find verified residential and commercial plots for sale in Hazaribagh. Search by decimal and katha in Matwari, Hurhuru, Canary Hill Road, and NH-33 bypass corridor with verified RS Khatiyan and mutation records.',
      rates: '₹2.5 Lakh – ₹9.5 Lakh per Decimal',
      tagline: 'Decimal & Katha Land Parcels'
    },
    flats: {
      title: 'Flats & Apartments for Sale in Hazaribagh',
      type: 'flat' as PropertyType,
      purpose: 'buy' as Purpose,
      description: 'Explore 2 BHK, 3 BHK, and 4 BHK modern apartments in gated residential societies across Hazaribagh. Enjoy lift backup, dedicated parking, and 24x7 security near Lake Road and College More.',
      rates: '₹2,400 – ₹4,200 per sq.ft',
      tagline: 'Modern Living & Gated Communities'
    },
    houses: {
      title: 'Independent Houses & Duplexes for Sale in Hazaribagh',
      type: 'house' as PropertyType,
      purpose: 'buy' as Purpose,
      description: 'Discover independent houses, modern duplexes, and private bungalows in peaceful residential colonies of Hazaribagh like Matwari, Ramnagar, and Canary Hill.',
      rates: '₹45 Lakh – ₹1.65 Crore',
      tagline: 'Private Land & Freehold Homes'
    },
    commercial: {
      title: 'Commercial Shops & Highway Land in Hazaribagh',
      type: 'commercial_shop' as PropertyType,
      purpose: 'buy' as Purpose,
      description: 'Find high-visibility commercial shops in Bada Bazar, Jhanda Chowk, and commercial land along Ranchi-Patna NH-33 corridor suitable for showrooms, warehouses, and hospitals.',
      rates: 'High ROI Retail & Highway Frontage',
      tagline: 'Commercial Real Estate'
    },
    rentals: {
      title: 'Properties for Rent in Hazaribagh',
      type: 'flat' as PropertyType,
      purpose: 'rent' as Purpose,
      description: 'Browse verified houses, apartments, and commercial office spaces available for rent in Hazaribagh. Direct owner listings with zero hidden brokerage.',
      rates: '₹7,000 – ₹35,000 / month',
      tagline: 'Rental Homes & Office Spaces'
    }
  };

  const config = categoryConfigs[categoryKey];

  // Filter listings
  const filteredListings = properties.filter(p => {
    if (p.listingStatus !== 'live') return false;
    if (categoryKey === 'rentals') return p.purpose === 'rent';
    if (categoryKey === 'plots') return p.propertyType === 'plot' || p.propertyType === 'commercial_land';
    if (categoryKey === 'commercial') return p.propertyType === 'commercial_shop' || p.propertyType === 'commercial_office' || p.propertyType === 'commercial_land';
    return p.propertyType === config.type && p.purpose === config.purpose;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Home</button>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-slate-900 font-bold">{config.title}</span>
      </nav>

      {/* Hero Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-10 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {config.tagline}
          </span>
          <span className="text-xs text-blue-200 font-semibold">
            Benchmark: {config.rates}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {config.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {config.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => {
              setQuickFilter({ propertyType: config.type, purpose: config.purpose });
              navigate('/properties');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            Apply Filters & Search
          </button>
          {categoryKey === 'plots' && (
            <button
              onClick={openUnitConverterModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white rounded-md flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Calculator size={14} className="text-blue-400" />
              <span>Decimal to Katha Converter</span>
            </button>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Available Listings ({filteredListings.length})
          </h2>
          <span className="text-xs text-slate-500">100% Verified in Hazaribagh</span>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3 shadow-sm">
            <Building2 size={32} className="mx-auto text-slate-400" />
            <div className="text-sm font-bold text-slate-800">
              No listings currently live in this exact category.
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Browse All Properties
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

      {/* Locality Quick Links for this Category */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Popular Localities for {categoryKey === 'plots' ? 'Plots' : 'Real Estate'} in Hazaribagh
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {HAZARIBAGH_LOCALITIES.slice(0, 8).map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                setQuickFilter({ locality: loc.name, propertyType: config.type });
                navigate('/properties');
              }}
              className="p-3 bg-white hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 rounded-lg text-left font-medium text-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <div className="font-bold text-slate-900">{loc.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{loc.avgPlotPricePerDecimal}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Building2, ShieldCheck, MapPin, Phone, Mail, ArrowUpRight, Calculator, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HAZARIBAGH_LOCALITIES } from '../../data/localities';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  const { navigate, setQuickFilter, openUnitConverterModal, openVerificationModal } = useApp();

  const handleLocalityClick = (slug: string) => {
    navigate(`/locality/${slug}`);
  };

  const handleCategoryClick = (type: any, purpose: 'buy' | 'rent') => {
    setQuickFilter({ propertyType: type, purpose });
    navigate('/properties');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Local Credibility */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigate('/')}
              className="cursor-pointer inline-block"
            >
              <BrandLogo variant="horizontal" theme="dark" size="md" showTagline={true} />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier digital real estate discovery & listing portal built specifically for Hazaribagh, Jharkhand. Discover verified plots, independent homes, flats, and commercial properties with assisted site visits.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-400 shrink-0" />
                <span>Lake Road, Near Gandhi Maidan, Matwari, Hazaribagh, Jharkhand – 825301</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <span>Concierge Desk: +91 94311 00000 (Mon–Sat, 9:30 AM – 7:00 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <span>help@hazaribaghproperties.com</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={openVerificationModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-emerald-400 transition-colors"
              >
                <ShieldCheck size={14} />
                <span>Verification Standard</span>
              </button>

              <button
                onClick={openUnitConverterModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
              >
                <Calculator size={14} className="text-amber-400" />
                <span>Area Converter</span>
              </button>
            </div>
          </div>

          {/* Col 2: Property Types & Buy */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Buy in Hazaribagh
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => navigate('/plots-for-sale-in-hazaribagh')}
                  className="hover:text-white transition-colors"
                >
                  Plots / Land for Sale
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/flats-for-sale-in-hazaribagh')}
                  className="hover:text-white transition-colors"
                >
                  Flats & Apartments for Sale
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('house', 'buy')}
                  className="hover:text-white transition-colors"
                >
                  Independent Duplex Houses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('commercial_shop', 'buy')}
                  className="hover:text-white transition-colors"
                >
                  Commercial Retail Shops
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('commercial_land', 'buy')}
                  className="hover:text-white transition-colors"
                >
                  Highway Commercial Land
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Localities */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Top Localities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {HAZARIBAGH_LOCALITIES.slice(0, 7).map((loc) => (
                <li key={loc.id}>
                  <button
                    onClick={() => handleLocalityClick(loc.slug)}
                    className="hover:text-white transition-colors flex items-center justify-between w-full"
                  >
                    <span>{loc.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{loc.totalListingsCount} listings</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Real Estate Guides & Portals */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Guides & Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => navigate('/property-guides')}
                  className="hover:text-white transition-colors"
                >
                  Hazaribagh Property Guides
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/property-guides/plot-buying-checklist-in-jharkhand')}
                  className="hover:text-white transition-colors"
                >
                  Jharkhand Land Record Checklist
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/list-property')}
                  className="hover:text-blue-400 transition-colors text-blue-400 font-medium"
                >
                  + List Your Property (Free)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Seller Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/admin')}
                  className="hover:text-white transition-colors text-amber-400 font-medium"
                >
                  Admin Verification Desk
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Transparency & Legal Disclaimer */}
        <div className="pt-6 text-[11px] text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> Hazaribagh Properties is an independent hyperlocal digital discovery and listing platform. Listing information, dimensions, prices, and amenities are provided by property owners, builders, and verified sources. While our team performs preliminary verification of documentation and on-site characteristics, prospective buyers, investors, and tenants are advised to independently verify all revenue records (RS Khatiyan, Jharbhoomi mutation, LPC, Register-II) and conduct due diligence prior to financial agreements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-slate-400">
            <div>
              © {new Date().getFullYear()} Hazaribagh Properties. All rights reserved. Built for Hazaribagh, Jharkhand.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="hover:text-white cursor-pointer" onClick={() => navigate('/property-guides')}>Local Property Laws</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer" onClick={openVerificationModal}>Verification Standards</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer" onClick={openUnitConverterModal}>Unit Converter</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Calendar, 
  Compass, 
  PlusCircle, 
  FileText, 
  BadgePercent, 
  PhoneCall, 
  Calculator,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSearch } from '../search/HeroSearch';
import { PropertyCard } from '../common/PropertyCard';
import { LocalityCard } from '../common/LocalityCard';
import { HAZARIBAGH_LOCALITIES } from '../../data/localities';
import { PROPERTY_GUIDES } from '../../data/propertyGuides';
import { PropertyType } from '../../types/property';

export const HomeView: React.FC = () => {
  const { properties, navigate, setQuickFilter, openUnitConverterModal, openVerificationModal } = useApp();

  // Filter properties
  const liveProperties = properties.filter(p => p.listingStatus === 'live');
  const featuredProperties = liveProperties.filter(p => p.featured).slice(0, 4);
  const recentProperties = liveProperties.slice(0, 6);

  const handleCategoryClick = (type: PropertyType, purpose: 'buy' | 'rent' = 'buy') => {
    setQuickFilter({ propertyType: type, purpose });
    navigate('/properties');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-7 text-center">
          {/* Micro Trust Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-bold uppercase tracking-wider text-slate-700 mx-auto">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Verified Real Estate Discovery • Hazaribagh, Jharkhand</span>
          </div>

          {/* Main Headline & Supporting Message */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Verified Properties in <span className="text-blue-600">Hazaribagh</span>.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Explore inspected plots, residential houses, apartments, and commercial properties across Matwari, Hurhuru, Canary Hill Road, and key localities.
            </p>
          </div>

          {/* Central Property Search Bar */}
          <div className="pt-1">
            <HeroSearch />
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600" />
              <span>100% Verified Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600" />
              <span>Assisted Site Visits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600" />
              <span>Direct Owner & Builder Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BROWSE BY PROPERTY TYPE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Categories
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Browse Real Estate by Type
            </h2>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            {
              title: 'Land & Plots',
              type: 'plot' as PropertyType,
              subtitle: 'Decimal & Katha Parcels',
              count: '42+ Available',
              icon: '📐',
              image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
              route: '/plots-for-sale-in-hazaribagh'
            },
            {
              title: 'Modern Flats',
              type: 'flat' as PropertyType,
              subtitle: '2 & 3 BHK Apartments',
              count: '28+ Available',
              icon: '🏢',
              image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
              route: '/flats-for-sale-in-hazaribagh'
            },
            {
              title: 'Independent Houses',
              type: 'house' as PropertyType,
              subtitle: 'Bungalows & Duplexes',
              count: '16+ Available',
              icon: '🏡',
              image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
              route: '/houses-for-sale-in-hazaribagh'
            },
            {
              title: 'Commercial Retail',
              type: 'commercial_shop' as PropertyType,
              subtitle: 'Shops & Highway Land',
              count: '14+ Available',
              icon: '🏪',
              image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
              route: '/commercial-property-in-hazaribagh'
            },
            {
              title: 'Rental Properties',
              type: 'flat' as PropertyType,
              purpose: 'rent' as const,
              subtitle: 'Homes & Office Floors',
              count: '18+ Available',
              icon: '🔑',
              image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
              route: '/property-for-rent-in-hazaribagh'
            }
          ].map((cat) => (
            <div
              key={cat.title}
              onClick={() => cat.route ? navigate(cat.route) : handleCategoryClick(cat.type, (cat as any).purpose || 'buy')}
              className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-3.5 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm"
            >
              <div className="h-24 w-full rounded-lg bg-slate-100 overflow-hidden relative mb-3">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xs font-bold text-white">
                  {cat.icon}
                </span>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                <span>{cat.count}</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR LOCALITIES IN HAZARIBAGH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Hyperlocal Geography
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Popular Localities in Hazaribagh
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore property rates, neighborhood amenities, and active listings by area.
            </p>
          </div>
          <button
            onClick={() => navigate('/locality/matwari')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Localities</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HAZARIBAGH_LOCALITIES.slice(0, 8).map((locality) => (
            <LocalityCard key={locality.id} locality={locality} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED VERIFIED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Verified Inventory
              </span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Featured
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Featured Properties in Hazaribagh
            </h2>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All {liveProperties.length} Properties</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 5. HOW BUYING THROUGH HAZARIBAGH PROPERTIES WORKS */}
      <section className="bg-slate-100/80 border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Assisted Discovery Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How Buying Through Hazaribagh Properties Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We connect buyers and owners with verified documentation, accurate measurements, and on-ground visit assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                step: '01',
                title: 'Discover Verified Listings',
                desc: 'Browse accurate plots, flats, and houses with verified Khatiyan, road width, and real photography.'
              },
              {
                step: '02',
                title: 'Request Assisted Site Visit',
                desc: 'Pick your preferred date and time. Our local Hazaribagh property specialist coordinates access.'
              },
              {
                step: '03',
                title: 'Inspect On-Site with Specialist',
                desc: 'Walk through the land boundaries or apartment layout with full physical transparency.'
              },
              {
                step: '04',
                title: 'Get Title & Legal Guidance',
                desc: 'Receive assistance on mutation copies, circle rates, and Sub-Registrar Office processes.'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5 shadow-sm"
              >
                <div className="text-xs font-bold text-blue-600 font-mono tracking-wider">
                  STEP {item.step}
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RECENTLY LISTED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Fresh Marketplace
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Recently Added in Hazaribagh
            </h2>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Listings</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 7. SELLER BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden border border-slate-800 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-semibold border border-slate-700">
              <PlusCircle size={14} />
              Property Owners, Builders & Agents
            </span>

            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Have a plot, home or flat to sell or rent in Hazaribagh?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              List your property for free. Our team reviews title documents and on-site details before publishing, ensuring genuine buyer inquiries without spam calls.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/list-property')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs sm:text-sm transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle size={16} />
                <span>List Your Property Free</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-md text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Seller Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HAZARIBAGH REAL ESTATE GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Knowledge Hub
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Hazaribagh Property Guides & Legal Basics
            </h2>
          </div>
          <button
            onClick={() => navigate('/property-guides')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Guides</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROPERTY_GUIDES.map((guide) => (
            <div
              key={guide.id}
              onClick={() => navigate(`/property-guides/${guide.slug}`)}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-4 space-y-3 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="text-blue-600 font-bold uppercase tracking-wider">{guide.category}</span>
                  <span>{guide.readTime}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Read Full Guide</span>
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

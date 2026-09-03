import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Heart, 
  PlusCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  Calculator, 
  User, 
  LogOut, 
  ChevronDown,
  Compass,
  FileText,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';

export const Header: React.FC = () => {
  const { 
    currentPath, 
    navigate, 
    savedPropertyIds, 
    openUnitConverterModal, 
    openAuthModal, 
    currentUserRole, 
    userName, 
    isLoggedIn, 
    logout,
    setQuickFilter
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleNav = (path: string, filterUpdates?: any) => {
    if (filterUpdates) {
      setQuickFilter(filterUpdates);
    }
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Buy', path: '/properties', filter: { purpose: 'buy' } },
    { label: 'Rent', path: '/properties', filter: { purpose: 'rent' } },
    { label: 'Plots / Land', path: '/plots-for-sale-in-hazaribagh', filter: { propertyType: 'plot', purpose: 'buy' } },
    { label: 'Flats', path: '/flats-for-sale-in-hazaribagh', filter: { propertyType: 'flat', purpose: 'buy' } },
    { label: 'Commercial', path: '/properties', filter: { propertyType: 'commercial_shop' } },
    { label: 'Localities', path: '/locality/matwari' },
    { label: 'Guides', path: '/property-guides' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top micro bar for trust & quick local tools */}
      <div className="bg-slate-900 text-slate-400 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="text-slate-200">100% Verified Real Estate Portal</span> • Hazaribagh, Jharkhand
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin size={12} className="text-blue-400" />
              Matwari • Hurhuru • Canary Hill • Dipugarha • Korra
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openUnitConverterModal}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-[11px] cursor-pointer"
            >
              <Calculator size={12} className="text-amber-400" />
              <span>Land Converter (Decimal / Katha / Sq.ft)</span>
            </button>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Role:</span>
              <span className="bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {currentUserRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('/')}
          className="cursor-pointer select-none group"
        >
          <BrandLogo variant="horizontal" size="sm" showTagline={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.label}
                onClick={() => handleNav(link.path, link.filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-slate-100 text-blue-600 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search trigger */}
          <button
            onClick={() => handleNav('/properties')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Search Properties"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Favourites / Saved */}
          <button
            onClick={() => handleNav('/properties', { savedOnly: true })}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Saved Properties"
            aria-label="Saved Properties"
          >
            <Heart size={18} className={savedPropertyIds.length > 0 ? 'text-rose-600' : ''} />
            {savedPropertyIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedPropertyIds.length}
              </span>
            )}
          </button>

          {/* User account */}
          <div className="relative">
            <button
              onClick={() => isLoggedIn ? setIsUserDropdownOpen(!isUserDropdownOpen) : openAuthModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-800 transition-colors shadow-2xs"
            >
              <User size={14} className="text-slate-500" />
              <span className="hidden sm:inline-block max-w-[90px] truncate">
                {isLoggedIn ? (currentUserRole === 'admin' ? 'Admin Portal' : 'My Account') : 'Sign in'}
              </span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-bold text-slate-900 truncate">{userName}</div>
                  <div className="text-[11px] text-blue-600 font-medium capitalize">
                    Role: {currentUserRole}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNav('/dashboard')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md flex items-center justify-between"
                  >
                    <span>Seller Dashboard</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Owner</span>
                  </button>

                  {currentUserRole === 'admin' && <button
                    onClick={() => handleNav('/admin')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md flex items-center justify-between"
                  >
                    <span>Admin Verification</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>
                  </button>}

                  <button
                    onClick={() => handleNav('/property-guides')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"
                  >
                    <FileText size={13} className="text-slate-400" />
                    <span>Hazaribagh Guides</span>
                  </button>

                  <button
                    onClick={openUnitConverterModal}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"
                  >
                    <Calculator size={13} className="text-slate-400" />
                    <span>Unit Converter Tool</span>
                  </button>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => { void logout(); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2"><LogOut size={13} /> Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: List Property */}
          <button
            onClick={() => handleNav('/list-property')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>List Property</span>
          </button>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-md"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('/properties', { purpose: 'buy' })}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-bold text-xs text-slate-900"
            >
              🏡 Buy Property
            </button>
            <button
              onClick={() => handleNav('/properties', { purpose: 'rent' })}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-bold text-xs text-slate-900"
            >
              🔑 Rent Homes & Shops
            </button>
            <button
              onClick={() => handleNav('/plots-for-sale-in-hazaribagh', { propertyType: 'plot' })}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-bold text-xs text-slate-900"
            >
              📐 Plots & Land
            </button>
            <button
              onClick={() => handleNav('/flats-for-sale-in-hazaribagh', { propertyType: 'flat' })}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-bold text-xs text-slate-900"
            >
              🏢 Modern Flats
            </button>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNav('/locality/matwari')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md flex items-center justify-between"
            >
              <span>Explore Hazaribagh Localities</span>
              <span className="text-[10px] text-slate-400">14 Localities</span>
            </button>
            <button
              onClick={() => handleNav('/property-guides')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Property Guides & Legal Checklist
            </button>
            <button
              onClick={() => {
                openUnitConverterModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-1.5"
            >
              <Calculator size={14} className="text-slate-400" />
              <span>Land Area Unit Converter</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => handleNav('/list-property')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
            >
              <PlusCircle size={16} />
              <span>List Your Property</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNav('/dashboard')}
                className="py-2 bg-slate-100 text-slate-800 font-medium rounded-md text-xs text-center hover:bg-slate-200"
              >
                Seller Dashboard
              </button>
              <button
                onClick={() => handleNav('/admin')}
                className="py-2 bg-slate-900 text-white font-medium rounded-md text-xs text-center hover:bg-slate-800"
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

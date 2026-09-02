import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Map as MapIcon, 
  Columns, 
  ArrowUpDown, 
  X, 
  RotateCcw, 
  Building2, 
  MapPin,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';
import { FilterSidebar } from '../search/FilterSidebar';
import { MobileFilterSheet } from '../search/MobileFilterSheet';
import { InteractiveMapPlaceholder } from '../search/InteractiveMapPlaceholder';
import { formatIndianPrice } from '../../utils/formatters';

const SEARCH_STOP_WORDS = new Set(['a', 'an', 'and', 'at', 'for', 'in', 'near', 'of', 'the']);

const PROPERTY_TYPE_SEARCH_TERMS: Record<string, string> = {
  plot: 'plot plots land',
  flat: 'flat flats apartment apartments',
  house: 'house houses home homes',
  villa: 'villa villas house houses',
  commercial_shop: 'commercial shop shops retail',
  commercial_office: 'commercial office offices workspace',
  commercial_land: 'commercial plot plots land',
  other: 'property properties'
};

export const PropertiesView: React.FC = () => {
  const { properties, savedPropertyIds, filters, setFilters, resetFilters, openUnitConverterModal } = useApp();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'split'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Must be live listing for public discovery
      if (p.listingStatus !== 'live') return false;

      // Purpose
      if (filters.purpose && p.purpose !== filters.purpose) return false;

      // Property Type
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (p.propertyType !== filters.propertyType) return false;
      }

      // Locality
      if (filters.locality && filters.locality !== '') {
        if (p.locality.toLowerCase() !== filters.locality.toLowerCase()) return false;
      }

      // Price range
      if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;

      // Bedrooms
      if (filters.bedrooms && filters.bedrooms !== 'all') {
        if (filters.bedrooms === 4) {
          if (!p.bedrooms || p.bedrooms < 4) return false;
        } else if (p.bedrooms !== filters.bedrooms) {
          return false;
        }
      }

      // Furnishing
      if (filters.furnishing && filters.furnishing !== 'all') {
        if (p.furnishing !== filters.furnishing) return false;
      }

      // Possession
      if (filters.possession && filters.possession !== 'all') {
        if (p.possession !== filters.possession) return false;
      }

      // Listed By
      if (filters.listedBy && filters.listedBy !== 'all') {
        if (p.listedBy !== filters.listedBy) return false;
      }

      // Verified Only
      if (filters.verifiedOnly && p.verificationStatus !== 'verified') return false;

      // Saved listings
      if (filters.savedOnly && !savedPropertyIds.includes(p.id)) return false;

      // Natural Search query
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const searchTerms = filters.searchQuery
          .toLowerCase()
          .replace(/[_-]+/g, ' ')
          .split(/\s+/)
          .filter(term => term && !SEARCH_STOP_WORDS.has(term));
        const searchableText = [
          p.title,
          p.locality,
          p.landmark,
          p.description,
          PROPERTY_TYPE_SEARCH_TERMS[p.propertyType],
          p.bedrooms ? `${p.bedrooms} bhk bedroom bedrooms` : ''
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .replace(/[_-]+/g, ' ');

        if (!searchTerms.every(term => searchableText.includes(term))) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'area_desc') return (b.builtUpArea || b.plotArea || 0) - (a.builtUpArea || a.plotArea || 0);
      // Default: Featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, savedPropertyIds, filters]);

  // Active filter tags for quick removal
  const activeTags: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.locality) {
    activeTags.push({
      key: 'locality',
      label: `Locality: ${filters.locality}`,
      onRemove: () => setFilters(prev => ({ ...prev, locality: undefined }))
    });
  }
  if (filters.propertyType && filters.propertyType !== 'all') {
    activeTags.push({
      key: 'type',
      label: `Type: ${filters.propertyType.replace('_', ' ')}`,
      onRemove: () => setFilters(prev => ({ ...prev, propertyType: 'all' }))
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    activeTags.push({
      key: 'price',
      label: `Price: ${filters.minPrice ? formatIndianPrice(filters.minPrice) : '₹0'} - ${filters.maxPrice ? formatIndianPrice(filters.maxPrice) : 'Any'}`,
      onRemove: () => setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }))
    });
  }
  if (filters.bedrooms && filters.bedrooms !== 'all') {
    activeTags.push({
      key: 'bedrooms',
      label: filters.bedrooms === 4 ? '4+ BHK' : `${filters.bedrooms} BHK`,
      onRemove: () => setFilters(prev => ({ ...prev, bedrooms: 'all' }))
    });
  }
  if (filters.verifiedOnly) {
    activeTags.push({
      key: 'verified',
      label: 'Verified Only',
      onRemove: () => setFilters(prev => ({ ...prev, verifiedOnly: false }))
    });
  }
  if (filters.savedOnly) {
    activeTags.push({
      key: 'saved',
      label: 'Saved Properties',
      onRemove: () => setFilters(prev => ({ ...prev, savedOnly: false }))
    });
  }
  if (filters.searchQuery) {
    activeTags.push({
      key: 'search',
      label: `Search: "${filters.searchQuery}"`,
      onRemove: () => setFilters(prev => ({ ...prev, searchQuery: '' }))
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search e.g. Matwari plot, 3 BHK Hurhuru..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Purpose Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setFilters(prev => ({ ...prev, purpose: 'buy' }))}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  filters.purpose === 'buy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, purpose: 'rent' }))}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  filters.purpose === 'rent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Rent
              </button>
            </div>

            {/* Mobile Filter Sheet Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeTags.length > 0 && `(${activeTags.length})`}</span>
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1">Active Filters:</span>
            {activeTags.map((tag) => (
              <span
                key={tag.key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-medium"
              >
                <span>{tag.label}</span>
                <button
                  onClick={tag.onRemove}
                  className="p-0.5 hover:bg-blue-200 rounded-full cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-blue-600 font-semibold ml-2 underline underline-offset-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Control Bar: Result Count, Sort, and View Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {filters.savedOnly
              ? 'Saved Properties'
              : `${filters.purpose === 'buy' ? 'Properties for Sale' : 'Properties for Rent'} in Hazaribagh`}
          </h1>
          <p className="text-xs text-slate-500">
            Showing <strong>{filteredProperties.length}</strong> verified properties
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ArrowUpDown size={14} className="text-slate-400" />
            <span className="font-medium hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newly Listed</option>
              <option value="area_desc">Largest Area</option>
            </select>
          </div>

          {/* View Toggles (Grid / List / Map / Split) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="List View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Map View"
            >
              <MapIcon size={15} />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md transition-colors hidden md:block cursor-pointer ${viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Split View"
            >
              <Columns size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <FilterSidebar />
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* MAP ONLY VIEW */}
          {viewMode === 'map' && (
            <InteractiveMapPlaceholder properties={filteredProperties} heightClass="h-[600px]" />
          )}

          {/* SPLIT VIEW (Map on top / side + Properties list) */}
          {viewMode === 'split' && (
            <div className="space-y-6">
              <InteractiveMapPlaceholder properties={filteredProperties} heightClass="h-[380px]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} layout="grid" />
                ))}
              </div>
            </div>
          )}

          {/* GRID & LIST VIEWS */}
          {(viewMode === 'grid' || viewMode === 'list') && (
            <>
              {filteredProperties.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Building2 size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      No Properties Match Your Filter Criteria
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Try expanding your budget range, clearing specific localities, or resetting all filters to see available listings in Hazaribagh.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
                  {filteredProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} layout={viewMode} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Filter Drawer */}
      <MobileFilterSheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        resultsCount={filteredProperties.length}
      />
    </div>
  );
};

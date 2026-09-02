import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Lead, FilterState, PropertyType, Purpose, AreaUnit } from '../types/property';
import { INITIAL_PROPERTIES, INITIAL_LEADS } from '../data/mockProperties';

export type UserRole = 'buyer' | 'seller' | 'admin';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation & Routing
  currentPath: string;
  navigate: (path: string, params?: Record<string, string>) => void;
  routeParams: Record<string, string>;
  
  // Properties State
  properties: Property[];
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  isPropertySaved: (id: string) => boolean;
  addProperty: (property: Partial<Property>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  getPropertyBySlug: (slug: string) => Property | undefined;
  getPropertyById: (id: string) => Property | undefined;
  
  // Admin & Verification actions
  approveListing: (id: string) => void;
  rejectListing: (id: string, reason?: string) => void;
  requestChangesListing: (id: string, reason: string) => void;
  toggleFeatured: (id: string) => void;
  toggleListingStatus: (id: string, newStatus: Property['listingStatus']) => void;
  
  // Leads & Inquiries
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStatus: (id: string, status: Lead['status'], notes?: string) => void;
  
  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setQuickFilter: (updates: Partial<FilterState>) => void;
  
  // Global Modals & Utilities
  isSiteVisitOpen: boolean;
  openSiteVisitModal: (property?: Property) => void;
  closeSiteVisitModal: () => void;
  selectedPropertyForModal?: Property;
  
  isInquiryOpen: boolean;
  openInquiryModal: (property?: Property) => void;
  closeInquiryModal: () => void;
  
  isUnitConverterOpen: boolean;
  openUnitConverterModal: () => void;
  closeUnitConverterModal: () => void;
  
  isVerificationModalOpen: boolean;
  openVerificationModal: () => void;
  closeVerificationModal: () => void;
  
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  
  // User profile & role
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  userPhone: string;
  userName: string;
  setUserSession: (name: string, phone: string, role: UserRole) => void;
  logout: () => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
}

const DEFAULT_FILTERS: FilterState = {
  purpose: 'buy',
  propertyType: 'all',
  locality: '',
  minPrice: undefined,
  maxPrice: undefined,
  minArea: undefined,
  maxArea: undefined,
  areaUnit: 'decimal',
  bedrooms: 'all',
  furnishing: 'all',
  possession: 'all',
  listedBy: 'all',
  verifiedOnly: false,
  sortBy: 'featured',
  searchQuery: ''
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '/' ? path : '/';
    }
    return '/';
  });

  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Sync with browser URL / PopState
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, params?: Record<string, string>) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    if (params) {
      setRouteParams(params);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Properties State with LocalStorage persistence
  const [properties, setProperties] = useState<Property[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hzb_properties');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore error
        }
      }
    }
    return INITIAL_PROPERTIES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hzb_properties', JSON.stringify(properties));
    }
  }, [properties]);

  // Saved Properties
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hzb_saved_props');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return ['prop-1', 'prop-2'];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hzb_saved_props', JSON.stringify(savedPropertyIds));
    }
  }, [savedPropertyIds]);

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Property removed from saved listings', 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast('Property saved to your favourites', 'success');
        return [...prev, id];
      }
    });
  };

  const isPropertySaved = (id: string) => savedPropertyIds.includes(id);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hzb_leads');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_LEADS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hzb_leads', JSON.stringify(leads));
    }
  }, [leads]);

  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
    // increment leads count on property
    setProperties(prev => prev.map(p => p.id === newLead.propertyId ? { ...p, leadsCount: (p.leadsCount || 0) + 1 } : p));
  };

  const updateLeadStatus = (id: string, status: Lead['status'], notes?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        return {
          ...lead,
          status,
          ...(notes ? { adminNotes: notes } : {})
        };
      }
      return lead;
    }));
    showToast(`Lead status updated to ${status.replace('_', ' ')}`, 'success');
  };

  // Add / Update Property
  const addProperty = (newPropData: Partial<Property>): Property => {
    const id = `prop-${Date.now()}`;
    const listingId = `HP-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = `${(newPropData.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${listingId.toLowerCase()}`;
    
    const newProperty: Property = {
      id,
      listingId,
      slug,
      purpose: newPropData.purpose || 'buy',
      propertyType: newPropData.propertyType || 'plot',
      title: newPropData.title || 'Untitled Property',
      description: newPropData.description || '',
      price: newPropData.price || 0,
      monthlyRent: newPropData.monthlyRent,
      securityDeposit: newPropData.securityDeposit,
      maintenanceCharges: newPropData.maintenanceCharges,
      isPriceNegotiable: !!newPropData.isPriceNegotiable,
      locality: newPropData.locality || 'Matwari',
      localitySlug: newPropData.localitySlug || (newPropData.locality || 'matwari').toLowerCase().replace(/\s+/g, '-'),
      address: newPropData.address || 'Hazaribagh',
      landmark: newPropData.landmark,
      city: 'Hazaribagh',
      state: 'Jharkhand',
      pincode: newPropData.pincode || '825301',
      latitude: newPropData.latitude || 23.9935,
      longitude: newPropData.longitude || 85.3621,
      bedrooms: newPropData.bedrooms,
      bathrooms: newPropData.bathrooms,
      balconies: newPropData.balconies,
      builtUpArea: newPropData.builtUpArea,
      carpetArea: newPropData.carpetArea,
      plotArea: newPropData.plotArea,
      areaUnit: newPropData.areaUnit || 'decimal',
      roadWidthFt: newPropData.roadWidthFt,
      facing: newPropData.facing,
      isBoundaryWallMade: newPropData.isBoundaryWallMade,
      isCornerPlot: newPropData.isCornerPlot,
      landUse: newPropData.landUse,
      floorNumber: newPropData.floorNumber,
      totalFloors: newPropData.totalFloors,
      furnishing: newPropData.furnishing,
      possession: newPropData.possession,
      amenities: newPropData.amenities || [],
      highlights: newPropData.highlights || [],
      images: newPropData.images?.length ? newPropData.images : [
        { id: 'img-def', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
      ],
      verificationStatus: 'pending',
      listingStatus: 'under_review',
      listedBy: newPropData.listedBy || 'owner',
      ownerName: newPropData.ownerName || 'Property Owner',
      ownerPhone: newPropData.ownerPhone || '+91 98765 43210',
      ownerEmail: newPropData.ownerEmail,
      privateDocuments: newPropData.privateDocuments || [],
      featured: false,
      viewsCount: 0,
      leadsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const getPropertyBySlug = (slug: string) => {
    return properties.find(p => p.slug === slug || p.id === slug || p.listingId.toLowerCase() === slug.toLowerCase());
  };

  const getPropertyById = (id: string) => {
    return properties.find(p => p.id === id || p.listingId === id);
  };

  // Admin Listing Verification Actions
  const approveListing = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          listingStatus: 'live',
          verificationStatus: 'verified',
          verificationNotes: 'Verified by Hazaribagh Properties review team. Title deed & on-site details validated.',
          adminChangeRequestReason: undefined,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    showToast('Listing successfully approved and published as Verified!', 'success');
  };

  const rejectListing = (id: string, reason?: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          listingStatus: 'rejected',
          adminChangeRequestReason: reason || 'Listing rejected due to non-compliant documentation or location mismatch.',
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    showToast('Listing status set to Rejected.', 'info');
  };

  const requestChangesListing = (id: string, reason: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          listingStatus: 'changes_requested',
          adminChangeRequestReason: reason,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    showToast('Changes requested from property seller.', 'warning');
  };

  const toggleFeatured = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        const next = !p.featured;
        showToast(next ? 'Marked as Featured property' : 'Removed from Featured', 'info');
        return { ...p, featured: next };
      }
      return p;
    }));
  };

  const toggleListingStatus = (id: string, newStatus: Property['listingStatus']) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, listingStatus: newStatus, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
    showToast(`Listing status updated to ${newStatus.replace('_', ' ')}`, 'info');
  };

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setQuickFilter = (updates: Partial<FilterState>) => {
    // Quick links represent a new search preset, so stale filters from a
    // previous visit (including saved-only mode) must not leak into it.
    setFilters({ ...DEFAULT_FILTERS, ...updates });
  };

  // Modals state
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isUnitConverterOpen, setIsUnitConverterOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<Property | undefined>();

  const openSiteVisitModal = (property?: Property) => {
    setSelectedPropertyForModal(property);
    setIsSiteVisitOpen(true);
  };
  const closeSiteVisitModal = () => {
    setIsSiteVisitOpen(false);
  };

  const openInquiryModal = (property?: Property) => {
    setSelectedPropertyForModal(property);
    setIsInquiryOpen(true);
  };
  const closeInquiryModal = () => {
    setIsInquiryOpen(false);
  };

  const openUnitConverterModal = () => setIsUnitConverterOpen(true);
  const closeUnitConverterModal = () => setIsUnitConverterOpen(false);

  const openVerificationModal = () => setIsVerificationModalOpen(true);
  const closeVerificationModal = () => setIsVerificationModalOpen(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // User Profile & Role Simulation
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('buyer');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // default logged in for smooth preview
  const [userName, setUserName] = useState('Shri Anand Prakash');
  const [userPhone, setUserPhone] = useState('+91 94311 88776');

  const setUserSession = (name: string, phone: string, role: UserRole) => {
    setUserName(name);
    setUserPhone(phone);
    setCurrentUserRole(role);
    setIsLoggedIn(true);
    showToast(`Signed in as ${name} (${role})`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Signed out successfully', 'info');
  };

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        routeParams,
        properties,
        savedPropertyIds,
        toggleSaveProperty,
        isPropertySaved,
        addProperty,
        updateProperty,
        getPropertyBySlug,
        getPropertyById,
        approveListing,
        rejectListing,
        requestChangesListing,
        toggleFeatured,
        toggleListingStatus,
        leads,
        addLead,
        updateLeadStatus,
        filters,
        setFilters,
        resetFilters,
        setQuickFilter,
        isSiteVisitOpen,
        openSiteVisitModal,
        closeSiteVisitModal,
        selectedPropertyForModal,
        isInquiryOpen,
        openInquiryModal,
        closeInquiryModal,
        isUnitConverterOpen,
        openUnitConverterModal,
        closeUnitConverterModal,
        isVerificationModalOpen,
        openVerificationModal,
        closeVerificationModal,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        currentUserRole,
        setCurrentUserRole,
        isLoggedIn,
        userName,
        userPhone,
        setUserSession,
        logout,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

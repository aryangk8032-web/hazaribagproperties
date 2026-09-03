import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AreaUnit, FilterState, Lead, Property } from '../types/property';
import { INITIAL_PROPERTIES, INITIAL_LEADS } from '../data/mockProperties';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { createLead, createProperty, fetchAccessibleLeads, fetchAccessibleProperties, fetchPublishedProperties, fetchSavedPropertyIds, persistLeadStatus, persistPropertyUpdate, toggleSavedProperty } from '../services/propertyRepository';

export type UserRole = 'buyer' | 'seller' | 'admin';
type Toast = { id: string; type: 'success' | 'info' | 'warning' | 'error'; message: string };

interface AppContextType {
  currentPath: string; navigate: (path: string, params?: Record<string, string>) => void; routeParams: Record<string, string>;
  properties: Property[]; savedPropertyIds: string[]; toggleSaveProperty: (id: string) => Promise<void>; isPropertySaved: (id: string) => boolean;
  addProperty: (property: Partial<Property>) => Promise<Property>; updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  getPropertyBySlug: (slug: string) => Property | undefined; getPropertyById: (id: string) => Property | undefined;
  approveListing: (id: string) => Promise<void>; rejectListing: (id: string, reason?: string) => Promise<void>; requestChangesListing: (id: string, reason: string) => Promise<void>;
  updatePropertyVerification: (id: string, status: Property['verificationStatus'], notes: string) => Promise<void>; toggleFeatured: (id: string) => Promise<void>; toggleListingStatus: (id: string, status: Property['listingStatus']) => Promise<void>;
  leads: Lead[]; addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<void>; updateLeadStatus: (id: string, status: Lead['status'], notes?: string) => Promise<void>;
  filters: FilterState; setFilters: React.Dispatch<React.SetStateAction<FilterState>>; resetFilters: () => void; setQuickFilter: (updates: Partial<FilterState>) => void;
  isSiteVisitOpen: boolean; openSiteVisitModal: (property?: Property) => void; closeSiteVisitModal: () => void; selectedPropertyForModal?: Property;
  isInquiryOpen: boolean; openInquiryModal: (property?: Property) => void; closeInquiryModal: () => void;
  isUnitConverterOpen: boolean; openUnitConverterModal: () => void; closeUnitConverterModal: () => void;
  isVerificationModalOpen: boolean; openVerificationModal: () => void; closeVerificationModal: () => void;
  isAuthModalOpen: boolean; openAuthModal: (mode?: 'signin' | 'signup') => void; closeAuthModal: () => void;
  currentUserRole: UserRole; setCurrentUserRole: (role: UserRole) => void; currentUserId?: string; isLoggedIn: boolean; isReady: boolean; userPhone: string; userName: string;
  signInWithEmail: (email: string, name: string, phone: string, role: Exclude<UserRole, 'admin'>) => Promise<void>; logout: () => Promise<void>;
  toasts: Toast[]; showToast: (message: string, type?: Toast['type']) => void;
}

const DEFAULT_FILTERS: FilterState = { purpose: 'buy', propertyType: 'all', locality: '', minPrice: undefined, maxPrice: undefined, minArea: undefined, maxArea: undefined, areaUnit: 'decimal' as AreaUnit, bedrooms: 'all', furnishing: 'all', possession: 'all', listedBy: 'all', verifiedOnly: false, sortBy: 'featured', searchQuery: '' };
const AppContext = createContext<AppContextType | undefined>(undefined);

const makeProperty = (input: Partial<Property>, userName: string, userPhone: string): Property => {
  const id = `prop-${crypto.randomUUID()}`;
  const listingId = `HP-${Math.floor(1000 + Math.random() * 9000)}`;
  const slug = `${(input.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${listingId.toLowerCase()}`;
  const now = new Date().toISOString();
  return {
    id, listingId, slug, purpose: input.purpose || 'buy', propertyType: input.propertyType || 'plot', title: input.title || 'Untitled Property', description: input.description || '', price: input.price || 0,
    monthlyRent: input.monthlyRent, securityDeposit: input.securityDeposit, maintenanceCharges: input.maintenanceCharges, isPriceNegotiable: Boolean(input.isPriceNegotiable),
    locality: input.locality || 'Matwari', localitySlug: input.localitySlug || (input.locality || 'matwari').toLowerCase().replace(/\s+/g, '-'), address: input.address || 'Hazaribagh', landmark: input.landmark, city: 'Hazaribagh', state: 'Jharkhand', pincode: input.pincode || '825301', latitude: input.latitude || 23.9935, longitude: input.longitude || 85.3621,
    bedrooms: input.bedrooms, bathrooms: input.bathrooms, balconies: input.balconies, builtUpArea: input.builtUpArea, carpetArea: input.carpetArea, plotArea: input.plotArea, areaUnit: input.areaUnit || 'decimal', roadWidthFt: input.roadWidthFt, facing: input.facing, isBoundaryWallMade: input.isBoundaryWallMade, isCornerPlot: input.isCornerPlot, landUse: input.landUse, floorNumber: input.floorNumber, totalFloors: input.totalFloors, furnishing: input.furnishing, possession: input.possession,
    amenities: input.amenities || [], highlights: input.highlights || [], images: input.images?.length ? input.images : [{ id: 'img-def', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isPrimary: true }],
    verificationStatus: 'pending', listingStatus: 'under_review', listedBy: input.listedBy || 'owner', sellerId: input.sellerId, sellerName: input.sellerName || userName, ownerName: input.ownerName || userName, ownerPhone: input.ownerPhone || userPhone, ownerEmail: input.ownerEmail, contactPhone: input.contactPhone || userPhone, privateDocuments: input.privateDocuments || [], featured: false, viewsCount: 0, leadsCount: 0, createdAt: now, updatedAt: now,
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [properties, setProperties] = useState<Property[]>(isSupabaseConfigured ? [] : INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(isSupabaseConfigured ? [] : INITIAL_LEADS);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('buyer');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(!isSupabaseConfigured);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false); const [isInquiryOpen, setIsInquiryOpen] = useState(false); const [isUnitConverterOpen, setIsUnitConverterOpen] = useState(false); const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false); const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<Property>();

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID(); setToasts((items) => [...items, { id, message, type }]); window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4000);
  }, []);

  const refreshData = useCallback(async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { const publicProperties = await fetchPublishedProperties(); setProperties(publicProperties || []); setLeads([]); setSavedPropertyIds([]); setCurrentUserId(undefined); return; }
    const [{ data: profile, error: profileError }, accessibleProperties, accessibleLeads, savedIds] = await Promise.all([
      supabase.from('profiles').select('full_name, phone, role').single(), fetchAccessibleProperties(), fetchAccessibleLeads(), fetchSavedPropertyIds(),
    ]);
    if (profileError) throw profileError;
    setProperties(accessibleProperties); setLeads(accessibleLeads); setSavedPropertyIds(savedIds); setCurrentUserId(user.id); setUserName(profile?.full_name || user.email || 'Account'); setUserPhone(profile?.phone || ''); setCurrentUserRole((profile?.role as UserRole) || 'buyer'); setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    let active = true;
    const initialise = async () => { try { await refreshData(); } catch (error) { console.error('Marketplace data load failed:', error instanceof Error ? error.message : JSON.stringify(error)); if (active) showToast('Unable to load marketplace data. Please refresh.', 'error'); } finally { if (active) setIsReady(true); } };
    void initialise();
    if (!supabase) return () => { active = false; };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void refreshData().catch(console.error); });
    return () => { active = false; subscription.unsubscribe(); };
  }, [refreshData, showToast]);

  useEffect(() => { const onPopState = () => setCurrentPath(window.location.pathname || '/'); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []);
  const navigate = (path: string, params?: Record<string, string>) => { window.history.pushState({}, '', path); setCurrentPath(path); setRouteParams(params || {}); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const requireLogin = () => { if (isLoggedIn || !isSupabaseConfigured) return true; showToast('Please sign in to continue.', 'info'); setIsAuthModalOpen(true); return false; };
  const isPropertySaved = (id: string) => savedPropertyIds.includes(id);
  const toggleSaveProperty = async (id: string) => { if (!requireLogin()) return; const saved = isPropertySaved(id); try { await toggleSavedProperty(id, saved); setSavedPropertyIds((items) => saved ? items.filter((item) => item !== id) : [...items, id]); showToast(saved ? 'Property removed from saved listings' : 'Property saved to your favourites', saved ? 'info' : 'success'); } catch (error) { showToast(error instanceof Error ? error.message : 'Could not update saved properties.', 'error'); } };
  const addProperty = async (input: Partial<Property>) => { if (!requireLogin()) throw new Error('Sign in required'); const property = makeProperty(input, userName, userPhone); await createProperty(property); setProperties((items) => [property, ...items]); showToast('Listing submitted for verification.', 'success'); return property; };
  const updateProperty = async (id: string, updates: Partial<Property>) => { const property = properties.find((item) => item.id === id); if (!property) return; const next = { ...property, ...updates, updatedAt: new Date().toISOString() }; await persistPropertyUpdate(next); setProperties((items) => items.map((item) => item.id === id ? next : item)); };
  const updatePropertyVerification = async (id: string, verificationStatus: Property['verificationStatus'], notes: string) => { const status: Property['listingStatus'] = verificationStatus === 'rejected' ? 'rejected' : 'live'; await updateProperty(id, { verificationStatus, verificationNotes: notes, listingStatus: status, adminChangeRequestReason: undefined }); showToast(status === 'live' ? 'Listing approved and published.' : 'Listing rejected.', status === 'live' ? 'success' : 'warning'); };
  const approveListing = async (id: string) => updatePropertyVerification(id, 'verified', 'Verified by the Hazaribagh Properties review team.');
  const rejectListing = async (id: string, reason?: string) => updateProperty(id, { listingStatus: 'rejected', verificationStatus: 'rejected', adminChangeRequestReason: reason || 'Listing rejected during review.' });
  const requestChangesListing = async (id: string, reason: string) => updateProperty(id, { listingStatus: 'changes_requested', adminChangeRequestReason: reason });
  const toggleFeatured = async (id: string) => { const property = properties.find((item) => item.id === id); if (property) await updateProperty(id, { featured: !property.featured }); };
  const toggleListingStatus = async (id: string, listingStatus: Property['listingStatus']) => updateProperty(id, { listingStatus });
  const addLead = async (input: Omit<Lead, 'id' | 'createdAt'>) => { if (!requireLogin()) throw new Error('Sign in required'); const lead: Lead = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }; const { notificationSent } = await createLead(lead); setLeads((items) => [lead, ...items]); showToast(notificationSent ? 'Inquiry received. Confirmation details have been sent.' : 'Inquiry received. We will contact you shortly.', notificationSent ? 'success' : 'info'); };
  const updateLeadStatus = async (id: string, status: Lead['status'], notes?: string) => { await persistLeadStatus(id, status); setLeads((items) => items.map((lead) => lead.id === id ? { ...lead, status, ...(notes ? { adminNotes: notes } : {}) } : lead)); showToast(`Lead status updated to ${status.replace('_', ' ')}.`, 'success'); };
  const signInWithEmail = async (email: string, name: string, phone: string, role: Exclude<UserRole, 'admin'>) => { if (!supabase) throw new Error('Authentication is not configured.'); const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin, data: { full_name: name, phone, requested_role: role } } }); if (error) throw error; showToast('Check your email for a secure sign-in link.', 'success'); };
  const logout = async () => { if (supabase) { const { error } = await supabase.auth.signOut(); if (error) throw error; } setIsLoggedIn(false); setCurrentUserRole('buyer'); setCurrentUserId(undefined); setUserName(''); setUserPhone(''); setLeads([]); setSavedPropertyIds([]); showToast('Signed out successfully.', 'info'); };

  const value: AppContextType = { currentPath, navigate, routeParams, properties, savedPropertyIds, toggleSaveProperty, isPropertySaved, addProperty, updateProperty, getPropertyBySlug: (slug) => properties.find((item) => item.slug === slug || item.id === slug || item.listingId.toLowerCase() === slug.toLowerCase()), getPropertyById: (id) => properties.find((item) => item.id === id || item.listingId === id), approveListing, rejectListing, requestChangesListing, updatePropertyVerification, toggleFeatured, toggleListingStatus, leads, addLead, updateLeadStatus, filters, setFilters, resetFilters: () => setFilters(DEFAULT_FILTERS), setQuickFilter: (updates) => setFilters({ ...DEFAULT_FILTERS, ...updates }), isSiteVisitOpen, openSiteVisitModal: (property) => { setSelectedPropertyForModal(property); setIsSiteVisitOpen(true); }, closeSiteVisitModal: () => setIsSiteVisitOpen(false), selectedPropertyForModal, isInquiryOpen, openInquiryModal: (property) => { setSelectedPropertyForModal(property); setIsInquiryOpen(true); }, closeInquiryModal: () => setIsInquiryOpen(false), isUnitConverterOpen, openUnitConverterModal: () => setIsUnitConverterOpen(true), closeUnitConverterModal: () => setIsUnitConverterOpen(false), isVerificationModalOpen, openVerificationModal: () => setIsVerificationModalOpen(true), closeVerificationModal: () => setIsVerificationModalOpen(false), isAuthModalOpen, openAuthModal: () => setIsAuthModalOpen(true), closeAuthModal: () => setIsAuthModalOpen(false), currentUserRole, setCurrentUserRole, currentUserId, isLoggedIn, isReady, userPhone, userName, signInWithEmail, logout, toasts, showToast };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => { const context = useContext(AppContext); if (!context) throw new Error('useApp must be used within an AppProvider'); return context; };

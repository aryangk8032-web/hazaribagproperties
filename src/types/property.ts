export type Purpose = 'buy' | 'rent';

export type PropertyType = 
  | 'plot'
  | 'flat'
  | 'house'
  | 'villa'
  | 'commercial_shop'
  | 'commercial_office'
  | 'commercial_land'
  | 'other';

export type AreaUnit = 'sq.ft' | 'decimal' | 'katha' | 'acre' | 'sq.m';

export type ListingStatus = 
  | 'draft'
  | 'under_review'
  | 'pending_verification'
  | 'changes_requested'
  | 'approved'
  | 'live'
  | 'rejected'
  | 'sold'
  | 'rented';

export type VerificationStatus = 'pending' | 'verified' | 'unverified' | 'rejected';

export type OwnershipType = 'owner' | 'agent' | 'builder';

export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished';

export type FacingDirection = 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';

export type PossessionStatus = 'ready_to_move' | 'under_construction' | 'immediate';

export interface Locality {
  id: string;
  name: string;
  slug: string;
  description: string;
  pincode: string;
  avgPlotPricePerDecimal: string; // e.g. "₹8 Lakh - ₹15 Lakh / decimal"
  avgFlatPricePerSqFt: string;    // e.g. "₹2,800 - ₹3,600 / sq.ft"
  avgRent2BHK?: string;
  landmarks: string[];
  connectivityHighlights: string[];
  schoolsNearby?: string[];
  hospitalsNearby?: string[];
  popularFor: string[];
  image: string;
  latitude: number;
  longitude: number;
  totalListingsCount: number;
}

export interface PropertyMedia {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface PropertyDocument {
  id: string;
  name: string;
  docType: 'ownership_deed' | 'mutation_receipt' | 'tax_receipt' | 'khatiyan' | 'id_proof' | 'other';
  fileUrl?: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface NearbyLandmark {
  name: string;
  distance: string;
}

export interface Property {
  id: string;
  slug: string;
  listingId: string; // e.g. "HP-1024"
  purpose: Purpose;
  propertyType: PropertyType;
  title: string;
  description: string;
  price: number; // in INR
  monthlyRent?: number;
  securityDeposit?: number;
  maintenanceCharges?: number;
  isPriceNegotiable: boolean;
  
  // Location
  locality: string;
  localitySlug?: string;
  address?: string;
  landmark?: string;
  city?: string; // "Hazaribagh"
  state?: string; // "Jharkhand"
  pincode?: string;
  latitude: number;
  longitude: number;
  
  // Residential details
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  builtUpArea?: number; // in sq.ft
  carpetArea?: number;  // in sq.ft
  floorNumber?: number;
  totalFloors?: number;
  furnishing?: FurnishingStatus;
  possession?: PossessionStatus;
  possessionDate?: string;
  ageOfProperty?: string;
  
  // Plot / Land details
  plotArea?: number; // value in areaUnit
  areaUnit: AreaUnit;
  roadWidthFt?: number;
  facing?: FacingDirection | string;
  boundaryWall?: boolean;
  isBoundaryWallMade?: boolean;
  isCornerPlot?: boolean;
  landUse?: 'Residential' | 'Commercial' | 'Agricultural' | 'Mixed';
  
  // Jharkhand Land & Title specifics
  khatiyanType?: string;
  mutationStatus?: string;
  khataNumber?: string;
  plotNumber?: string;
  waterSupply?: string;
  electricityStatus?: string;
  ownership?: string;

  // Commercial details
  washrooms?: number;
  suitableFor?: string[];
  
  // General details
  amenities: string[];
  highlights?: string[];
  images: PropertyMedia[];
  videoUrl?: string;
  nearbyLandmarks?: NearbyLandmark[];
  
  // Trust & Metadata
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  listingStatus: ListingStatus;
  listedBy: OwnershipType;
  sellerId?: string;
  sellerName?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  privateDocuments?: PropertyDocument[];
  
  featured: boolean;
  viewsCount?: number;
  leadsCount?: number;
  createdAt: string;
  updatedAt?: string;
  adminChangeRequestReason?: string;
}

export interface Lead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertySlug?: string;
  locality?: string;
  price?: number;
  userName: string;
  userPhone: string;
  userEmail?: string;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  leadType: 'site_visit' | 'inquiry' | 'whatsapp' | 'call';
  inquiryType?: 'site_visit' | 'general_inquiry' | 'price_negotiation' | 'whatsapp';
  preferredDate?: string;
  preferredTimeSlot?: 'morning' | 'afternoon' | 'evening' | string;
  message?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled' | 'visit_scheduled' | 'visited' | 'negotiating' | 'closed' | 'lost';
  createdAt: string;
  adminNotes?: string;
}

export interface FilterState {
  purpose: Purpose;
  propertyType?: PropertyType | 'all';
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  areaUnit: AreaUnit;
  bedrooms?: number | 'all';
  furnishing?: FurnishingStatus | 'all';
  possession?: PossessionStatus | 'all';
  listedBy?: OwnershipType | 'all';
  verifiedOnly: boolean;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'featured' | 'area_desc';
  searchQuery: string;
  savedOnly?: boolean;
}

export interface PropertyGuideSection {
  heading: string;
  text: string;
  points?: string[];
  callout?: string;
}

export interface PropertyGuide {
  id: string;
  slug: string;
  title: string;
  category: 'Buying' | 'Selling' | 'Land Records' | 'Legal' | 'Localities' | 'Registration';
  readTime: string;
  publishedAt: string;
  summary: string;
  content: PropertyGuideSection[];
  author: string;
}

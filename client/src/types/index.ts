// ==========================================
// Hamro Awas Client TypeScript Types
// ==========================================

export enum UserRole {
  GUEST = 'GUEST',
  BUYER = 'BUYER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum PropertyCategory {
  LAND = 'LAND',
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  FLAT = 'FLAT',
  ROOM_RENTAL = 'ROOM_RENTAL',
  COMMERCIAL_BUILDING = 'COMMERCIAL_BUILDING',
  OFFICE_SPACE = 'OFFICE_SPACE',
  SHOP = 'SHOP',
  HOSTEL = 'HOSTEL',
  WAREHOUSE = 'WAREHOUSE',
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  PENDING = 'PENDING',
}

export enum PriceType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum VisitStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  profile?: UserProfile;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  address?: string;
  district?: string;
  city?: string;
  municipality?: string;
  citizenshipNo?: string;
  panNo?: string;
  bio?: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceType: PriceType;
  category: PropertyCategory;
  status: PropertyStatus;
  area: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  parking: boolean;
  parkingSpaces?: number;
  waterSupply: boolean;
  roadAccess: boolean;
  roadWidth?: string;
  facingDirection?: string;
  ownershipType?: string;
  builtYear?: number;
  latitude?: number;
  longitude?: number;
  district: string;
  city: string;
  municipality?: string;
  ward?: string;
  streetAddress?: string;
  isVerified: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  videos?: PropertyVideo[];
  documents?: PropertyDocument[];
  amenities?: PropertyAmenityRelation[];
  owner?: User;
  reviews?: Review[];
  _count?: {
    reviews: number;
    wishlistedBy: number;
    visitRequests: number;
  };
}

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

export interface PropertyVideo {
  id: string;
  url: string;
  title?: string;
}

export interface PropertyDocument {
  id: string;
  url: string;
  type: string;
  isVerified: boolean;
}

export interface PropertyAmenityRelation {
  amenity: Amenity;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  visitorId: string;
  ownerId: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: VisitStatus;
  message?: string;
  ownerNotes?: string;
  property?: Property;
  visitor?: User;
  owner?: User;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId?: string;
  reviewerId: string;
  targetUserId?: string;
  rating: number;
  comment?: string;
  type: string;
  reviewer?: User;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: string[];
  propertyId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  isRead: boolean;
  seenAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface FinanceRequest {
  id: string;
  propertyId?: string;
  loanAmount: number;
  monthlyIncome?: number;
  employmentType?: string;
  status: string;
  notes?: string;
  property?: Property;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  author?: User;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface CompanyService {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  price?: number;
}

// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  priceType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: string;
  district?: string;
  city?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'BUYER' | 'OWNER';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  pendingApprovals: number;
  totalVisits: number;
  totalReviews: number;
  totalFinanceRequests: number;
}

export interface EMICalculation {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

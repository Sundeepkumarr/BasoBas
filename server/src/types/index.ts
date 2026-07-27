// ==========================================
// Basobas — Shared TypeScript Types
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

export enum ReviewType {
  PROPERTY = 'PROPERTY',
  OWNER = 'OWNER',
  COMPANY = 'COMPANY',
}

export enum NotificationType {
  BOOKING = 'BOOKING',
  CHAT = 'CHAT',
  VERIFICATION = 'VERIFICATION',
  FINANCE = 'FINANCE',
  SYSTEM = 'SYSTEM',
}

export enum FinanceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_REVIEW = 'IN_REVIEW',
}

export enum DocumentType {
  CITIZENSHIP = 'CITIZENSHIP',
  LAND_CERTIFICATE = 'LAND_CERTIFICATE',
  BLUEPRINT = 'BLUEPRINT',
  TAX_CLEARANCE = 'TAX_CLEARANCE',
  OWNERSHIP_DEED = 'OWNERSHIP_DEED',
  OTHER = 'OTHER',
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PropertyFilterQuery extends PaginationQuery {
  category?: PropertyCategory;
  status?: PropertyStatus;
  priceType?: PriceType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: boolean;
  waterSupply?: boolean;
  roadAccess?: boolean;
  district?: string;
  city?: string;
  municipality?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// File Upload
export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

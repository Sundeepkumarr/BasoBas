import { z } from 'zod';

// ==========================================
// AUTH VALIDATORS
// ==========================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().optional(),
  role: z.enum(['BUYER', 'OWNER']).default('BUYER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// ==========================================
// PROPERTY VALIDATORS
// ==========================================

export const createPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  priceType: z.enum(['SALE', 'RENT']).default('SALE'),
  category: z.enum([
    'LAND', 'HOUSE', 'APARTMENT', 'FLAT', 'ROOM_RENTAL',
    'COMMERCIAL_BUILDING', 'OFFICE_SPACE', 'SHOP', 'HOSTEL', 'WAREHOUSE',
  ]),
  area: z.number().positive('Area must be positive'),
  areaUnit: z.string().default('sq.ft'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  floors: z.number().int().min(0).optional(),
  parking: z.boolean().default(false),
  parkingSpaces: z.number().int().min(0).optional(),
  waterSupply: z.boolean().default(true),
  roadAccess: z.boolean().default(true),
  roadWidth: z.string().optional(),
  facingDirection: z.string().optional(),
  ownershipType: z.string().optional(),
  builtYear: z.number().int().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  municipality: z.string().optional(),
  ward: z.string().optional(),
  streetAddress: z.string().optional(),
  amenityIds: z.array(z.string()).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  priceType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  parking: z.string().optional(),
  waterSupply: z.string().optional(),
  roadAccess: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  municipality: z.string().optional(),
  sortBy: z.enum(['price', 'createdAt', 'area', 'viewCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  isFeatured: z.string().optional(),
});

// ==========================================
// VISIT VALIDATORS
// ==========================================

export const createVisitSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().optional(),
  message: z.string().optional(),
});

// ==========================================
// REVIEW VALIDATORS
// ==========================================

export const createReviewSchema = z.object({
  propertyId: z.string().optional(),
  targetUserId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters').optional(),
  type: z.enum(['PROPERTY', 'OWNER', 'COMPANY']).default('PROPERTY'),
});

// ==========================================
// FINANCE VALIDATORS
// ==========================================

export const createFinanceRequestSchema = z.object({
  propertyId: z.string().optional(),
  loanAmount: z.number().positive('Loan amount must be positive'),
  monthlyIncome: z.number().positive().optional(),
  employmentType: z.string().optional(),
  employerName: z.string().optional(),
  notes: z.string().optional(),
});

// ==========================================
// PROFILE VALIDATORS
// ==========================================

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  municipality: z.string().optional(),
  citizenshipNo: z.string().optional(),
  panNo: z.string().optional(),
  bio: z.string().max(500).optional(),
});

// ==========================================
// CHAT VALIDATORS
// ==========================================

export const createChatSchema = z.object({
  participantId: z.string().min(1, 'Participant ID is required'),
  propertyId: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['TEXT', 'IMAGE', 'FILE']).default('TEXT'),
});

// ==========================================
// BLOG VALIDATORS
// ==========================================

export const createBlogPostSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

// ==========================================
// CONTACT VALIDATORS
// ==========================================

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>;
export type CreateVisitInput = z.infer<typeof createVisitSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateFinanceRequestInput = z.infer<typeof createFinanceRequestSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

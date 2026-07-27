import { Property, PropertyCategory, PriceType, PropertyStatus, User, UserRole, Category, FAQ, BlogPost, CompanyService, Review, Notification, VisitRequest, VisitStatus } from '@/types';

// ==========================================
// MOCK USERS
// ==========================================

export const mockUsers: User[] = [
  {
    id: '1', email: 'admin@basobas.com', role: UserRole.ADMIN, isVerified: true,
    profile: { id: 'p1', fullName: 'Basobas Admin' }, createdAt: '2026-01-01',
  },
  {
    id: '2', email: 'ramesh@example.com', phone: '+9779841000001', role: UserRole.OWNER, isVerified: true,
    profile: { id: 'p2', fullName: 'Ramesh Shrestha', district: 'Kathmandu', city: 'Kathmandu', bio: 'Property developer with 10+ years experience.' },
    createdAt: '2026-02-15',
  },
  {
    id: '3', email: 'sita@example.com', phone: '+9779841000002', role: UserRole.OWNER, isVerified: true,
    profile: { id: 'p3', fullName: 'Sita Gurung', district: 'Lalitpur', city: 'Lalitpur', bio: 'Real estate enthusiast.' },
    createdAt: '2026-03-01',
  },
  {
    id: '4', email: 'buyer@example.com', role: UserRole.BUYER, isVerified: true,
    profile: { id: 'p4', fullName: 'Hari Bahadur', district: 'Bhaktapur', city: 'Bhaktapur' },
    createdAt: '2026-04-10',
  },
];

// ==========================================
// MOCK PROPERTIES
// ==========================================

export const mockProperties: Property[] = [
  {
    id: '1', ownerId: '2', title: 'Luxurious 3BHK House in Budhanilkantha', slug: 'luxurious-3bhk-house-budhanilkantha',
    description: 'Beautiful 3BHK house located in the serene neighborhood of Budhanilkantha. Features modern architecture, spacious rooms, and a beautiful garden. Walking distance to schools and hospitals. Perfect for families looking for a premium living experience.',
    price: 25000000, priceType: PriceType.SALE, category: PropertyCategory.HOUSE, status: PropertyStatus.AVAILABLE,
    area: 2800, areaUnit: 'sq.ft', bedrooms: 3, bathrooms: 3, floors: 3, parking: true, parkingSpaces: 2,
    waterSupply: true, roadAccess: true, roadWidth: '20 feet', facingDirection: 'South', ownershipType: 'Freehold', builtYear: 2022,
    latitude: 27.7772, longitude: 85.3588, district: 'Kathmandu', city: 'Kathmandu', municipality: 'Kathmandu Metropolitan', ward: '16',
    isVerified: true, isApproved: true, isFeatured: true, viewCount: 245, createdAt: '2026-06-01', updatedAt: '2026-06-01',
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', isPrimary: true, order: 0 },
      { id: 'img1b', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', isPrimary: false, order: 1 },
      { id: 'img1c', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', isPrimary: false, order: 2 },
    ],
    owner: mockUsers[1],
    amenities: [{ amenity: { id: 'a1', name: 'Garden', icon: '🌳' } }, { amenity: { id: 'a2', name: 'Parking', icon: '🅿️' } }, { amenity: { id: 'a3', name: 'Security', icon: '🔒' } }],
    _count: { reviews: 5, wishlistedBy: 12, visitRequests: 8 },
  },
  {
    id: '2', ownerId: '2', title: 'Prime Commercial Land in Thamel', slug: 'prime-commercial-land-thamel',
    description: 'Prime commercial land located in the heart of Thamel, ideal for hotel, restaurant, or commercial complex. Excellent road access and high foot traffic area.',
    price: 85000000, priceType: PriceType.SALE, category: PropertyCategory.LAND, status: PropertyStatus.AVAILABLE,
    area: 5000, areaUnit: 'sq.ft', roadAccess: true, roadWidth: '16 feet', facingDirection: 'East', ownershipType: 'Freehold',
    parking: false, waterSupply: true,
    latitude: 27.7154, longitude: 85.3123, district: 'Kathmandu', city: 'Kathmandu', municipality: 'Kathmandu Metropolitan', ward: '26',
    isVerified: true, isApproved: true, isFeatured: true, viewCount: 420, createdAt: '2026-05-20', updatedAt: '2026-05-20',
    images: [{ id: 'img2', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop', isPrimary: true, order: 0 }],
    owner: mockUsers[1], _count: { reviews: 3, wishlistedBy: 8, visitRequests: 15 },
  },
  {
    id: '3', ownerId: '3', title: 'Modern Apartment in Jhamsikhel', slug: 'modern-apartment-jhamsikhel',
    description: 'Brand new 2BHK apartment in the trendy neighborhood of Jhamsikhel. Features modern amenities, earthquake-resistant design, 24/7 security, and stunning city views.',
    price: 18500000, priceType: PriceType.SALE, category: PropertyCategory.APARTMENT, status: PropertyStatus.AVAILABLE,
    area: 1200, areaUnit: 'sq.ft', bedrooms: 2, bathrooms: 2, floors: 1, parking: true, parkingSpaces: 1,
    waterSupply: true, roadAccess: true, roadWidth: '14 feet', facingDirection: 'West', ownershipType: 'Leasehold', builtYear: 2024,
    latitude: 27.6803, longitude: 85.3157, district: 'Lalitpur', city: 'Lalitpur', municipality: 'Lalitpur Metropolitan', ward: '3',
    isVerified: true, isApproved: true, isFeatured: true, viewCount: 312, createdAt: '2026-06-10', updatedAt: '2026-06-10',
    images: [{ id: 'img3', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', isPrimary: true, order: 0 }],
    owner: mockUsers[2],
    amenities: [{ amenity: { id: 'a4', name: 'Elevator', icon: '🛗' } }, { amenity: { id: 'a5', name: 'Gym', icon: '💪' } }, { amenity: { id: 'a6', name: 'CCTV', icon: '📹' } }],
    _count: { reviews: 7, wishlistedBy: 18, visitRequests: 10 },
  },
  {
    id: '4', ownerId: '3', title: 'Cozy Room for Rent in Pulchowk', slug: 'cozy-room-rent-pulchowk',
    description: 'Comfortable furnished room available for rent in Pulchowk area. Ideal for students and working professionals. Includes WiFi, water supply, and access to shared kitchen.',
    price: 8000, priceType: PriceType.RENT, category: PropertyCategory.ROOM_RENTAL, status: PropertyStatus.AVAILABLE,
    area: 200, areaUnit: 'sq.ft', bedrooms: 1, bathrooms: 1, waterSupply: true, roadAccess: true,
    parking: false, facingDirection: 'North', district: 'Lalitpur', city: 'Lalitpur', municipality: 'Lalitpur Metropolitan', ward: '5',
    isVerified: false, isApproved: true, isFeatured: false, viewCount: 89, createdAt: '2026-07-01', updatedAt: '2026-07-01',
    images: [{ id: 'img4', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', isPrimary: true, order: 0 }],
    owner: mockUsers[2], _count: { reviews: 2, wishlistedBy: 5, visitRequests: 4 },
  },
  {
    id: '5', ownerId: '2', title: 'Office Space for Rent in Durbar Marg', slug: 'office-space-durbar-marg',
    description: 'Premium office space available for rent in Durbar Marg, the business hub of Kathmandu. Spacious open floor plan, modern interiors, elevator access, and ample parking.',
    price: 150000, priceType: PriceType.RENT, category: PropertyCategory.OFFICE_SPACE, status: PropertyStatus.AVAILABLE,
    area: 3500, areaUnit: 'sq.ft', bathrooms: 4, floors: 2, parking: true, parkingSpaces: 5,
    waterSupply: true, roadAccess: true, roadWidth: '30 feet', facingDirection: 'South',
    district: 'Kathmandu', city: 'Kathmandu', municipality: 'Kathmandu Metropolitan', ward: '31',
    isVerified: true, isApproved: true, isFeatured: true, viewCount: 198, createdAt: '2026-06-15', updatedAt: '2026-06-15',
    images: [{ id: 'img5', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', isPrimary: true, order: 0 }],
    owner: mockUsers[1],
    amenities: [{ amenity: { id: 'a4', name: 'Elevator', icon: '🛗' } }, { amenity: { id: 'a12', name: 'Internet/WiFi', icon: '📶' } }],
    _count: { reviews: 4, wishlistedBy: 9, visitRequests: 7 },
  },
  {
    id: '6', ownerId: '3', title: 'Beautiful 4BHK Villa in Godawari', slug: 'beautiful-4bhk-villa-godawari',
    description: 'Stunning 4BHK villa surrounded by nature in the beautiful Godawari area. Features traditional Newari architecture blended with modern comforts.',
    price: 45000000, priceType: PriceType.SALE, category: PropertyCategory.HOUSE, status: PropertyStatus.AVAILABLE,
    area: 4200, areaUnit: 'sq.ft', bedrooms: 4, bathrooms: 4, floors: 2, parking: true, parkingSpaces: 3,
    waterSupply: true, roadAccess: true, roadWidth: '12 feet', facingDirection: 'East', ownershipType: 'Freehold', builtYear: 2021,
    district: 'Lalitpur', city: 'Lalitpur', municipality: 'Godawari Municipality',
    isVerified: true, isApproved: true, isFeatured: true, viewCount: 356, createdAt: '2026-05-01', updatedAt: '2026-05-01',
    images: [{ id: 'img6', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', isPrimary: true, order: 0 }],
    owner: mockUsers[2], _count: { reviews: 6, wishlistedBy: 22, visitRequests: 12 },
  },
  {
    id: '7', ownerId: '2', title: 'Shop Space in New Road', slug: 'shop-space-new-road',
    description: 'Prime shop space available on the ground floor of a commercial building on New Road. High visibility and foot traffic.',
    price: 75000, priceType: PriceType.RENT, category: PropertyCategory.SHOP, status: PropertyStatus.AVAILABLE,
    area: 450, areaUnit: 'sq.ft', bathrooms: 1, waterSupply: true, roadAccess: true, roadWidth: '24 feet',
    parking: false, facingDirection: 'South', district: 'Kathmandu', city: 'Kathmandu',
    isVerified: false, isApproved: true, isFeatured: false, viewCount: 143, createdAt: '2026-06-20', updatedAt: '2026-06-20',
    images: [{ id: 'img7', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop', isPrimary: true, order: 0 }],
    owner: mockUsers[1], _count: { reviews: 1, wishlistedBy: 3, visitRequests: 6 },
  },
  {
    id: '8', ownerId: '2', title: 'Commercial Building for Sale in Putalisadak', slug: 'commercial-building-putalisadak',
    description: 'Multi-story commercial building at a prime location in Putalisadak. Currently generating rental income. Excellent investment opportunity.',
    price: 120000000, priceType: PriceType.SALE, category: PropertyCategory.COMMERCIAL_BUILDING, status: PropertyStatus.AVAILABLE,
    area: 12000, areaUnit: 'sq.ft', bathrooms: 8, floors: 6, parking: true, parkingSpaces: 8,
    waterSupply: true, roadAccess: true, roadWidth: '28 feet', facingDirection: 'West', ownershipType: 'Freehold', builtYear: 2019,
    district: 'Kathmandu', city: 'Kathmandu', municipality: 'Kathmandu Metropolitan',
    isVerified: true, isApproved: true, isFeatured: true, viewCount: 520, createdAt: '2026-04-15', updatedAt: '2026-04-15',
    images: [{ id: 'img8', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', isPrimary: true, order: 0 }],
    owner: mockUsers[1], _count: { reviews: 8, wishlistedBy: 15, visitRequests: 20 },
  },
];

// ==========================================
// MOCK CATEGORIES
// ==========================================

export const mockCategories: Category[] = [
  { id: '1', name: 'Land', slug: 'land', icon: '🏞️', description: 'Plots of land for sale' },
  { id: '2', name: 'House', slug: 'house', icon: '🏠', description: 'Residential houses' },
  { id: '3', name: 'Apartment', slug: 'apartment', icon: '🏢', description: 'Modern apartments' },
  { id: '4', name: 'Flat', slug: 'flat', icon: '🏬', description: 'Residential flats' },
  { id: '5', name: 'Room Rental', slug: 'room-rental', icon: '🛏️', description: 'Single rooms for rent' },
  { id: '6', name: 'Commercial Building', slug: 'commercial-building', icon: '🏗️', description: 'Commercial properties' },
  { id: '7', name: 'Office Space', slug: 'office-space', icon: '💼', description: 'Office spaces' },
  { id: '8', name: 'Shop', slug: 'shop', icon: '🏪', description: 'Shop spaces' },
  { id: '9', name: 'Hostel', slug: 'hostel', icon: '🏨', description: 'Hostel accommodations' },
  { id: '10', name: 'Warehouse', slug: 'warehouse', icon: '🏭', description: 'Storage and warehouse' },
];

// ==========================================
// MOCK FAQS
// ==========================================

export const mockFAQs: FAQ[] = [
  { id: '1', question: 'How does Basobas work?', answer: 'Basobas connects property owners directly with buyers and renters. We provide verification, documentation support, and legal assistance to ensure safe transactions. No middlemen involved.', category: 'General', order: 1 },
  { id: '2', question: 'Is Basobas free to use?', answer: 'Browsing and searching properties is completely free. We charge a small service fee only when a transaction is completed successfully.', category: 'General', order: 2 },
  { id: '3', question: 'How are properties verified?', answer: 'Our team physically inspects properties and verifies all ownership documents before marking them as verified on the platform.', category: 'Verification', order: 3 },
  { id: '4', question: 'Can I schedule a property visit?', answer: 'Yes! Simply click the "Book Visit" button on any property listing, choose your preferred date and time, and the owner will confirm your visit.', category: 'Visits', order: 4 },
  { id: '5', question: 'What documents do I need to buy property?', answer: 'You will need citizenship documents, PAN number, and financial documents. Our team provides complete guidance.', category: 'Legal', order: 5 },
  { id: '6', question: 'How does the finance module work?', answer: 'Our finance module helps you calculate EMI, explore loan options, and connect with partner banks. Estimate affordability before making a decision.', category: 'Finance', order: 6 },
  { id: '7', question: 'Is my data safe?', answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal and financial information.', category: 'Security', order: 7 },
  { id: '8', question: 'How can I list my property?', answer: 'Register as a property owner, complete your profile verification, and use the "Add Property" feature from your dashboard.', category: 'Owners', order: 8 },
];

// ==========================================
// MOCK SERVICES
// ==========================================

export const mockServices: CompanyService[] = [
  { id: '1', name: 'Property Verification', slug: 'property-verification', description: 'Complete physical inspection and document verification of properties to ensure authenticity and legal compliance.', icon: '✅', price: 5000 },
  { id: '2', name: 'Legal Assistance', slug: 'legal-assistance', description: 'Expert legal support for property transactions, documentation, registration, and dispute resolution.', icon: '⚖️', price: 15000 },
  { id: '3', name: 'Documentation Support', slug: 'documentation-support', description: 'Help with preparing all necessary documents for buying, selling, or renting properties in Nepal.', icon: '📄', price: 3000 },
  { id: '4', name: 'Tax Guidance', slug: 'tax-guidance', description: 'Professional guidance on property taxes, capital gains tax, and registration fees to avoid surprises.', icon: '🧾', price: 5000 },
  { id: '5', name: 'Visit Management', slug: 'visit-management', description: 'Organized and scheduled property visits with our team assistance for safety and convenience.', icon: '📅', price: 2000 },
  { id: '6', name: 'Fair Price Assessment', slug: 'fair-price-assessment', description: 'Market analysis and fair price guidance based on location, property type, and current market trends.', icon: '💰', price: 8000 },
];

// ==========================================
// MOCK REVIEWS
// ==========================================

export const mockReviews: Review[] = [
  { id: '1', propertyId: '1', reviewerId: '4', rating: 5, comment: 'Excellent property! The location is perfect and the house is beautifully built.', type: 'PROPERTY', reviewer: mockUsers[3], createdAt: '2026-06-15' },
  { id: '2', propertyId: '1', reviewerId: '4', rating: 4, comment: 'Very good property. Slightly overpriced but overall a great find.', type: 'PROPERTY', reviewer: mockUsers[3], createdAt: '2026-06-20' },
  { id: '3', propertyId: '3', reviewerId: '4', rating: 5, comment: 'Modern design, great amenities. Love the city view from the balcony!', type: 'PROPERTY', reviewer: mockUsers[3], createdAt: '2026-07-01' },
];

// ==========================================
// MOCK NOTIFICATIONS
// ==========================================

export const mockNotifications: Notification[] = [
  { id: '1', title: 'Welcome to Basobas!', message: 'Start exploring properties in your area.', type: 'SYSTEM', isRead: false, createdAt: '2026-07-17T10:00:00Z' },
  { id: '2', title: 'Property Verified', message: 'Your property "Luxurious 3BHK House" has been verified.', type: 'VERIFICATION', isRead: false, createdAt: '2026-07-16T15:30:00Z' },
  { id: '3', title: 'New Visit Request', message: 'You have a new visit request for your property in Budhanilkantha.', type: 'BOOKING', isRead: true, createdAt: '2026-07-15T09:00:00Z' },
  { id: '4', title: 'Finance Update', message: 'Your finance request has been approved.', type: 'FINANCE', isRead: true, createdAt: '2026-07-14T11:00:00Z' },
];

// ==========================================
// MOCK BLOG
// ==========================================

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1', title: 'Top 10 Neighborhoods in Kathmandu for First-Time Buyers', slug: 'top-10-neighborhoods-kathmandu',
    content: 'Kathmandu Valley offers diverse neighborhoods each with unique character...',
    excerpt: 'Discover the best neighborhoods in Kathmandu for your first property purchase.',
    coverImage: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=400&fit=crop',
    tags: ['kathmandu', 'buying-guide'], isPublished: true, publishedAt: '2026-06-15', author: mockUsers[0], createdAt: '2026-06-15',
  },
  {
    id: '2', title: 'Understanding Property Registration in Nepal', slug: 'property-registration-nepal-guide',
    content: 'Property registration in Nepal involves several steps and government offices...',
    excerpt: 'Everything you need to know about registering property in Nepal.',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    tags: ['legal', 'guide'], isPublished: true, publishedAt: '2026-07-01', author: mockUsers[0], createdAt: '2026-07-01',
  },
  {
    id: '3', title: 'Real Estate Market Trends in Nepal 2026', slug: 'real-estate-trends-nepal-2026',
    content: 'The Nepal real estate market has shown remarkable resilience and growth...',
    excerpt: 'Explore the latest real estate market trends shaping Nepal in 2026.',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    tags: ['market-trends', '2026'], isPublished: true, publishedAt: '2026-07-10', author: mockUsers[0], createdAt: '2026-07-10',
  },
];

// ==========================================
// MOCK TESTIMONIALS
// ==========================================

export const mockTestimonials = [
  { id: '1', name: 'Bikash Maharjan', role: 'Home Buyer', content: 'Basobas made finding my dream home incredibly easy. The verification process gave me complete confidence in my purchase.', rating: 5, location: 'Lalitpur' },
  { id: '2', name: 'Anita Thapa', role: 'Property Owner', content: 'As a property owner, I love how Basobas helps me reach genuine buyers. The documentation support is excellent!', rating: 5, location: 'Kathmandu' },
  { id: '3', name: 'Sunil Rai', role: 'Tenant', content: 'Found a perfect room near my university through Basobas. The process was smooth and transparent from start to finish.', rating: 4, location: 'Bhaktapur' },
];

// ==========================================
// MOCK STATS
// ==========================================

export const mockStats = {
  totalProperties: 1200,
  happyCustomers: 850,
  verifiedOwners: 340,
  citiesCovered: 25,
};

// ==========================================
// DISTRICTS OF NEPAL
// ==========================================

export const nepalDistricts = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kaski', 'Chitwan', 'Morang', 'Sunsari',
  'Jhapa', 'Rupandehi', 'Parsa', 'Bara', 'Banke', 'Kailali', 'Makwanpur',
  'Kavrepalanchok', 'Nuwakot', 'Dhading', 'Sindhupalchok', 'Dolakha', 'Ramechhap',
];

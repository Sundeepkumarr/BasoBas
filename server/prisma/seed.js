"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Clear existing data
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.financeRequest.deleteMany();
    await prisma.review.deleteMany();
    await prisma.visitRequest.deleteMany();
    await prisma.propertyAmenity.deleteMany();
    await prisma.propertyDocument.deleteMany();
    await prisma.propertyVideo.deleteMany();
    await prisma.propertyImage.deleteMany();
    await prisma.property.deleteMany();
    await prisma.amenity.deleteMany();
    await prisma.category.deleteMany();
    await prisma.fAQ.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.companyService.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.user.deleteMany();
    const hashedPassword = await bcryptjs_1.default.hash('Password123', 12);
    // ==========================================
    // USERS
    // ==========================================
    const admin = await prisma.user.create({
        data: {
            email: 'admin@hamroawas.com',
            password: hashedPassword,
            role: 'ADMIN',
            isVerified: true,
            profile: { create: { fullName: 'Hamro Awas Admin' } },
        },
    });
    const owner1 = await prisma.user.create({
        data: {
            email: 'ramesh@example.com',
            password: hashedPassword,
            role: 'OWNER',
            isVerified: true,
            phone: '+9779841000001',
            profile: {
                create: {
                    fullName: 'Ramesh Shrestha',
                    district: 'Kathmandu',
                    city: 'Kathmandu',
                    municipality: 'Kathmandu Metropolitan',
                    bio: 'Property developer with 10+ years experience in Kathmandu Valley.',
                },
            },
        },
    });
    const owner2 = await prisma.user.create({
        data: {
            email: 'sita@example.com',
            password: hashedPassword,
            role: 'OWNER',
            isVerified: true,
            phone: '+9779841000002',
            profile: {
                create: {
                    fullName: 'Sita Gurung',
                    district: 'Lalitpur',
                    city: 'Lalitpur',
                    municipality: 'Lalitpur Metropolitan',
                    bio: 'Real estate enthusiast with properties across Patan.',
                },
            },
        },
    });
    const buyer = await prisma.user.create({
        data: {
            email: 'buyer@example.com',
            password: hashedPassword,
            role: 'BUYER',
            isVerified: true,
            profile: { create: { fullName: 'Hari Bahadur', district: 'Bhaktapur', city: 'Bhaktapur' } },
        },
    });
    const tenant = await prisma.user.create({
        data: {
            email: 'tenant@example.com',
            password: hashedPassword,
            role: 'TENANT',
            profile: { create: { fullName: 'Gita Tamang', district: 'Kathmandu', city: 'Kathmandu' } },
        },
    });
    // ==========================================
    // CATEGORIES
    // ==========================================
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'Land', slug: 'land', icon: '🏞️', description: 'Plots of land for sale' } }),
        prisma.category.create({ data: { name: 'House', slug: 'house', icon: '🏠', description: 'Residential houses' } }),
        prisma.category.create({ data: { name: 'Apartment', slug: 'apartment', icon: '🏢', description: 'Modern apartments' } }),
        prisma.category.create({ data: { name: 'Flat', slug: 'flat', icon: '🏬', description: 'Residential flats' } }),
        prisma.category.create({ data: { name: 'Room Rental', slug: 'room-rental', icon: '🛏️', description: 'Single rooms for rent' } }),
        prisma.category.create({ data: { name: 'Commercial Building', slug: 'commercial-building', icon: '🏗️', description: 'Commercial properties' } }),
        prisma.category.create({ data: { name: 'Office Space', slug: 'office-space', icon: '💼', description: 'Office spaces for rent or sale' } }),
        prisma.category.create({ data: { name: 'Shop', slug: 'shop', icon: '🏪', description: 'Shop spaces' } }),
        prisma.category.create({ data: { name: 'Hostel', slug: 'hostel', icon: '🏨', description: 'Hostel accommodations' } }),
        prisma.category.create({ data: { name: 'Warehouse', slug: 'warehouse', icon: '🏭', description: 'Storage and warehouse spaces' } }),
    ]);
    // ==========================================
    // AMENITIES
    // ==========================================
    const amenities = await Promise.all([
        prisma.amenity.create({ data: { name: 'Swimming Pool', icon: '🏊' } }),
        prisma.amenity.create({ data: { name: 'Garden', icon: '🌳' } }),
        prisma.amenity.create({ data: { name: 'Gym', icon: '💪' } }),
        prisma.amenity.create({ data: { name: 'Parking', icon: '🅿️' } }),
        prisma.amenity.create({ data: { name: 'Security', icon: '🔒' } }),
        prisma.amenity.create({ data: { name: 'Elevator', icon: '🛗' } }),
        prisma.amenity.create({ data: { name: 'Balcony', icon: '🌅' } }),
        prisma.amenity.create({ data: { name: 'Rooftop', icon: '🏙️' } }),
        prisma.amenity.create({ data: { name: 'CCTV', icon: '📹' } }),
        prisma.amenity.create({ data: { name: 'Solar Power', icon: '☀️' } }),
        prisma.amenity.create({ data: { name: 'Backup Generator', icon: '⚡' } }),
        prisma.amenity.create({ data: { name: 'Internet/WiFi', icon: '📶' } }),
    ]);
    // ==========================================
    // PROPERTIES
    // ==========================================
    const properties = [
        {
            ownerId: owner1.id,
            title: 'Luxurious 3BHK House in Budhanilkantha',
            slug: 'luxurious-3bhk-house-budhanilkantha',
            description: 'Beautiful 3BHK house located in the serene neighborhood of Budhanilkantha. Features modern architecture, spacious rooms, and a beautiful garden. Walking distance to schools and hospitals. Perfect for families looking for a premium living experience in Kathmandu.',
            price: 25000000,
            priceType: 'SALE',
            category: 'HOUSE',
            status: 'AVAILABLE',
            area: 2800,
            bedrooms: 3,
            bathrooms: 3,
            floors: 3,
            parking: true,
            parkingSpaces: 2,
            waterSupply: true,
            roadAccess: true,
            roadWidth: '20 feet',
            facingDirection: 'South',
            ownershipType: 'Freehold',
            builtYear: 2022,
            latitude: 27.7772,
            longitude: 85.3588,
            district: 'Kathmandu',
            city: 'Kathmandu',
            municipality: 'Kathmandu Metropolitan',
            ward: '16',
            isVerified: true,
            isApproved: true,
            isFeatured: true,
            viewCount: 245,
        },
        {
            ownerId: owner1.id,
            title: 'Prime Commercial Land in Thamel',
            slug: 'prime-commercial-land-thamel',
            description: 'Prime commercial land located in the heart of Thamel, ideal for hotel, restaurant, or commercial complex. Excellent road access and high foot traffic area. This is a rare opportunity to own property in the most popular tourist district of Kathmandu.',
            price: 85000000,
            priceType: 'SALE',
            category: 'LAND',
            status: 'AVAILABLE',
            area: 5000,
            roadAccess: true,
            roadWidth: '16 feet',
            facingDirection: 'East',
            ownershipType: 'Freehold',
            latitude: 27.7154,
            longitude: 85.3123,
            district: 'Kathmandu',
            city: 'Kathmandu',
            municipality: 'Kathmandu Metropolitan',
            ward: '26',
            isVerified: true,
            isApproved: true,
            isFeatured: true,
            viewCount: 420,
        },
        {
            ownerId: owner2.id,
            title: 'Modern Apartment in Jhamsikhel',
            slug: 'modern-apartment-jhamsikhel',
            description: 'Brand new 2BHK apartment in the trendy neighborhood of Jhamsikhel, Lalitpur. Features modern amenities, earthquake-resistant design, 24/7 security, and stunning city views. Close to restaurants, cafes, and embassy area.',
            price: 18500000,
            priceType: 'SALE',
            category: 'APARTMENT',
            status: 'AVAILABLE',
            area: 1200,
            bedrooms: 2,
            bathrooms: 2,
            floors: 1,
            parking: true,
            parkingSpaces: 1,
            waterSupply: true,
            roadAccess: true,
            roadWidth: '14 feet',
            facingDirection: 'West',
            ownershipType: 'Leasehold',
            builtYear: 2024,
            latitude: 27.6803,
            longitude: 85.3157,
            district: 'Lalitpur',
            city: 'Lalitpur',
            municipality: 'Lalitpur Metropolitan',
            ward: '3',
            isVerified: true,
            isApproved: true,
            isFeatured: true,
            viewCount: 312,
        },
        {
            ownerId: owner2.id,
            title: 'Cozy Room for Rent in Pulchowk',
            slug: 'cozy-room-rent-pulchowk',
            description: 'Comfortable furnished room available for rent in Pulchowk area. Ideal for students and working professionals. Includes WiFi, water supply, and access to shared kitchen. Close to Pulchowk Engineering Campus and bus stops.',
            price: 8000,
            priceType: 'RENT',
            category: 'ROOM_RENTAL',
            status: 'AVAILABLE',
            area: 200,
            bedrooms: 1,
            bathrooms: 1,
            waterSupply: true,
            roadAccess: true,
            facingDirection: 'North',
            district: 'Lalitpur',
            city: 'Lalitpur',
            municipality: 'Lalitpur Metropolitan',
            ward: '5',
            isApproved: true,
            viewCount: 89,
        },
        {
            ownerId: owner1.id,
            title: 'Office Space for Rent in Durbar Marg',
            slug: 'office-space-durbar-marg',
            description: 'Premium office space available for rent in Durbar Marg, the business hub of Kathmandu. Spacious open floor plan, modern interiors, elevator access, and ample parking. Ideal for corporate offices, IT companies, and consultancy firms.',
            price: 150000,
            priceType: 'RENT',
            category: 'OFFICE_SPACE',
            status: 'AVAILABLE',
            area: 3500,
            bathrooms: 4,
            floors: 2,
            parking: true,
            parkingSpaces: 5,
            waterSupply: true,
            roadAccess: true,
            roadWidth: '30 feet',
            facingDirection: 'South',
            district: 'Kathmandu',
            city: 'Kathmandu',
            municipality: 'Kathmandu Metropolitan',
            ward: '31',
            isVerified: true,
            isApproved: true,
            isFeatured: true,
            viewCount: 198,
        },
        {
            ownerId: owner1.id,
            title: 'Warehouse Space in Balaju Industrial Area',
            slug: 'warehouse-balaju-industrial',
            description: 'Large warehouse space available in Balaju Industrial District. Suitable for manufacturing, storage, and distribution. Good road access for heavy vehicles. Power supply and water available.',
            price: 200000,
            priceType: 'RENT',
            category: 'WAREHOUSE',
            status: 'AVAILABLE',
            area: 8000,
            parking: true,
            parkingSpaces: 10,
            waterSupply: true,
            roadAccess: true,
            roadWidth: '40 feet',
            district: 'Kathmandu',
            city: 'Kathmandu',
            municipality: 'Kathmandu Metropolitan',
            ward: '16',
            isApproved: true,
            viewCount: 67,
        },
        {
            ownerId: owner2.id,
            title: 'Beautiful 4BHK Villa in Godawari',
            slug: 'beautiful-4bhk-villa-godawari',
            description: 'Stunning 4BHK villa surrounded by nature in the beautiful Godawari area. Features traditional Newari architecture blended with modern comforts. Spacious garden, mountain views, and fresh air. Perfect retreat from the city hustle.',
            price: 45000000,
            priceType: 'SALE',
            category: 'HOUSE',
            status: 'AVAILABLE',
            area: 4200,
            bedrooms: 4,
            bathrooms: 4,
            floors: 2,
            parking: true,
            parkingSpaces: 3,
            waterSupply: true,
            roadAccess: true,
            roadWidth: '12 feet',
            facingDirection: 'East',
            ownershipType: 'Freehold',
            builtYear: 2021,
            latitude: 27.5937,
            longitude: 85.3788,
            district: 'Lalitpur',
            city: 'Lalitpur',
            municipality: 'Godawari Municipality',
            isVerified: true,
            isApproved: true,
            isFeatured: true,
            viewCount: 356,
        },
        {
            ownerId: owner1.id,
            title: 'Shop Space in New Road',
            slug: 'shop-space-new-road',
            description: 'Prime shop space available on the ground floor of a commercial building on New Road. High visibility and foot traffic. Perfect for retail, electronics, or fashion store. Well-maintained building with modern facilities.',
            price: 75000,
            priceType: 'RENT',
            category: 'SHOP',
            status: 'AVAILABLE',
            area: 450,
            bathrooms: 1,
            waterSupply: true,
            roadAccess: true,
            roadWidth: '24 feet',
            facingDirection: 'South',
            district: 'Kathmandu',
            city: 'Kathmandu',
            municipality: 'Kathmandu Metropolitan',
            ward: '22',
            isApproved: true,
            viewCount: 143,
        },
        {
            ownerId: owner2.id,
            title: 'Student Hostel near Tribhuvan University',
            slug: 'student-hostel-tribhuvan-university',
            description: 'Well-managed student hostel with 50+ rooms near Tribhuvan University campus. Includes mess facility, WiFi, study room, and recreation area. Separate boys and girls sections available. Affordable monthly rates.',
            price: 5000,
            priceType: 'RENT',
            category: 'HOSTEL',
            status: 'AVAILABLE',
            area: 150,
            bedrooms: 1,
            bathrooms: 1,
            waterSupply: true,
            roadAccess: true,
            district: 'Kathmandu',
            city: 'Kirtipur',
            municipality: 'Kirtipur Municipality',
            isApproved: true,
            viewCount: 231,
        },
        {
            ownerId: owner1.id,
            title: 'Commercial Building for Sale in Putalisadak',
            slug: 'commercial-building-putalisadak',
            description: 'Multi-story commercial building located at a prime location in Putalisadak. Currently generating rental income from tenants. Excellent investment opportunity with high ROI. Building is earthquake-resistant and well-maintained.',
            price: 120000000,
            priceType: 'SALE',
            category: 'COMMERCIAL_BUILDING',
            status: 'AVAILABLE',
            area: 12000,
            bathrooms: 8,
            floors: 6,
            parking: true,
            parkingSpaces: 8,
            waterSupply: true,
            roadAccess: true,
            roadWidth: '28 feet',
            facingDirection: 'West',
            ownershipType: 'Freehold',
            builtYear: 2019,
            latitude: 27.7050,
            longitude: 85.3200,
            district: 'Kathmandu',
            city: 'Kathmandu',
            municipality: 'Kathmandu Metropolitan',
            ward: '29',
            isVerified: true,
            isApproved: true,
            isFeatured: true,
            viewCount: 520,
        },
    ];
    const createdProperties = await Promise.all(properties.map((p) => prisma.property.create({ data: p })));
    // Add placeholder images
    for (const property of createdProperties) {
        await prisma.propertyImage.create({
            data: {
                propertyId: property.id,
                url: `https://placehold.co/800x600/0F766E/white?text=${encodeURIComponent(property.category)}`,
                isPrimary: true,
                order: 0,
            },
        });
        await prisma.propertyImage.create({
            data: {
                propertyId: property.id,
                url: `https://placehold.co/800x600/115E59/white?text=Interior`,
                order: 1,
            },
        });
        await prisma.propertyImage.create({
            data: {
                propertyId: property.id,
                url: `https://placehold.co/800x600/134E4A/white?text=View`,
                order: 2,
            },
        });
    }
    // Add amenities to some properties
    for (let i = 0; i < createdProperties.length; i++) {
        const numAmenities = Math.min(3 + (i % 4), amenities.length);
        for (let j = 0; j < numAmenities; j++) {
            await prisma.propertyAmenity.create({
                data: {
                    propertyId: createdProperties[i].id,
                    amenityId: amenities[j].id,
                },
            });
        }
    }
    // ==========================================
    // REVIEWS
    // ==========================================
    await prisma.review.createMany({
        data: [
            { propertyId: createdProperties[0].id, reviewerId: buyer.id, rating: 5, comment: 'Excellent property! The location is perfect and the house is beautifully built.', type: 'PROPERTY' },
            { propertyId: createdProperties[0].id, reviewerId: tenant.id, rating: 4, comment: 'Very good property. Slightly overpriced but overall a great find.', type: 'PROPERTY' },
            { propertyId: createdProperties[2].id, reviewerId: buyer.id, rating: 5, comment: 'Modern design, great amenities. Love the city view from the balcony!', type: 'PROPERTY' },
            { propertyId: createdProperties[6].id, reviewerId: buyer.id, rating: 5, comment: 'Dream home! The Godawari location is serene and the architecture is stunning.', type: 'PROPERTY' },
            { targetUserId: owner1.id, reviewerId: buyer.id, rating: 5, comment: 'Very professional and transparent. Highly recommended owner.', type: 'OWNER' },
            { targetUserId: owner2.id, reviewerId: buyer.id, rating: 4, comment: 'Responsive and helpful throughout the process.', type: 'OWNER' },
        ],
    });
    // ==========================================
    // FAQS
    // ==========================================
    await prisma.fAQ.createMany({
        data: [
            { question: 'How does Hamro Awas work?', answer: 'Hamro Awas connects property owners directly with buyers and renters. We provide verification, documentation support, and legal assistance to ensure safe transactions.', category: 'General', order: 1 },
            { question: 'Is Hamro Awas free to use?', answer: 'Browsing and searching properties is completely free. We charge a small service fee only when a transaction is completed successfully.', category: 'General', order: 2 },
            { question: 'How are properties verified?', answer: 'Our team physically inspects properties and verifies all ownership documents before marking them as verified on the platform.', category: 'Verification', order: 3 },
            { question: 'Can I schedule a property visit?', answer: 'Yes! Simply click the "Book Visit" button on any property listing, choose your preferred date and time, and the owner will confirm your visit.', category: 'Visits', order: 4 },
            { question: 'What documents do I need to buy property?', answer: 'You will need citizenship documents, PAN number, and financial documents. Our team provides complete guidance on documentation requirements.', category: 'Legal', order: 5 },
            { question: 'How does the finance module work?', answer: 'Our finance module helps you calculate EMI, explore loan options, and connect with partner banks. You can estimate affordability before making a decision.', category: 'Finance', order: 6 },
            { question: 'Is my data safe on Hamro Awas?', answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal and financial information.', category: 'Security', order: 7 },
            { question: 'How can I list my property?', answer: 'Register as a property owner, complete your profile verification, and then use the "Add Property" feature from your dashboard to list your property.', category: 'Owners', order: 8 },
        ],
    });
    // ==========================================
    // COMPANY SERVICES
    // ==========================================
    await prisma.companyService.createMany({
        data: [
            { name: 'Property Verification', slug: 'property-verification', description: 'Complete physical inspection and document verification of properties.', icon: '✅', price: 5000 },
            { name: 'Legal Assistance', slug: 'legal-assistance', description: 'Expert legal support for property transactions, documentation, and registration.', icon: '⚖️', price: 15000 },
            { name: 'Documentation Support', slug: 'documentation-support', description: 'Help with preparing all necessary documents for buying, selling, or renting.', icon: '📄', price: 3000 },
            { name: 'Tax Guidance', slug: 'tax-guidance', description: 'Professional guidance on property taxes, capital gains, and registration fees.', icon: '🧾', price: 5000 },
            { name: 'Visit Management', slug: 'visit-management', description: 'Organized and scheduled property visits with our team assistance.', icon: '📅', price: 2000 },
            { name: 'Fair Price Assessment', slug: 'fair-price-assessment', description: 'Market analysis and fair price guidance based on location and property type.', icon: '💰', price: 8000 },
        ],
    });
    // ==========================================
    // BLOG POSTS
    // ==========================================
    await prisma.blogPost.createMany({
        data: [
            {
                authorId: admin.id,
                title: 'Top 10 Neighborhoods in Kathmandu for First-Time Buyers',
                slug: 'top-10-neighborhoods-kathmandu',
                content: 'Kathmandu Valley offers diverse neighborhoods each with unique character. From the bustling streets of Thamel to the serene hills of Budhanilkantha, here are our top picks for first-time property buyers in Nepal\'s capital...',
                excerpt: 'Discover the best neighborhoods in Kathmandu for your first property purchase.',
                tags: ['kathmandu', 'buying-guide', 'neighborhoods'],
                isPublished: true,
                publishedAt: new Date('2026-06-15'),
            },
            {
                authorId: admin.id,
                title: 'Understanding Property Registration in Nepal: A Complete Guide',
                slug: 'property-registration-nepal-guide',
                content: 'Property registration in Nepal involves several steps and government offices. This comprehensive guide walks you through the entire process, from document preparation to final registration at the Land Revenue Office...',
                excerpt: 'Everything you need to know about registering property in Nepal.',
                tags: ['legal', 'registration', 'guide'],
                isPublished: true,
                publishedAt: new Date('2026-07-01'),
            },
            {
                authorId: admin.id,
                title: 'Real Estate Market Trends in Nepal 2026',
                slug: 'real-estate-trends-nepal-2026',
                content: 'The Nepal real estate market has shown remarkable resilience and growth. Key trends include increasing demand for apartments in urban areas, rising land prices in suburban regions, and growing interest in sustainable construction...',
                excerpt: 'Explore the latest real estate market trends shaping Nepal in 2026.',
                tags: ['market-trends', 'analysis', '2026'],
                isPublished: true,
                publishedAt: new Date('2026-07-10'),
            },
        ],
    });
    // Add some wishlist entries
    await prisma.wishlist.createMany({
        data: [
            { userId: buyer.id, propertyId: createdProperties[0].id },
            { userId: buyer.id, propertyId: createdProperties[2].id },
            { userId: buyer.id, propertyId: createdProperties[6].id },
        ],
    });
    // Add notifications
    await prisma.notification.createMany({
        data: [
            { userId: buyer.id, title: 'Welcome to Hamro Awas!', message: 'Start exploring properties in your area.', type: 'SYSTEM' },
            { userId: owner1.id, title: 'Property Verified', message: 'Your property "Luxurious 3BHK House" has been verified.', type: 'VERIFICATION' },
            { userId: owner1.id, title: 'New Visit Request', message: 'You have a new visit request for your property.', type: 'BOOKING' },
        ],
    });
    console.log('✅ Database seeded successfully!');
    console.log(`   - ${5} users created`);
    console.log(`   - ${categories.length} categories created`);
    console.log(`   - ${amenities.length} amenities created`);
    console.log(`   - ${createdProperties.length} properties created`);
    console.log(`   - Reviews, FAQs, Blog Posts, Services, and Notifications seeded`);
}
main()
    .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map

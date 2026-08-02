import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, AppError, paginationHelper, buildPaginationMeta, generateSlug } from '../../utils';
import { UserRole } from '../../types';
import { CreatePropertyInput, PropertyQueryInput } from '../../validators';

export const getProperties = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as PropertyQueryInput;
  const { skip, take, page, limit } = paginationHelper(query.page, query.limit);

  // Build where clause
  const where: any = { deletedAt: null, isApproved: true };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { district: { contains: query.search, mode: 'insensitive' } },
      { city: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.category) where.category = query.category;
  if (query.status) where.status = query.status;
  if (query.priceType) where.priceType = query.priceType;
  if (query.district) where.district = { contains: query.district, mode: 'insensitive' };
  if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
  if (query.municipality) where.municipality = { contains: query.municipality, mode: 'insensitive' };
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = query.minPrice;
    if (query.maxPrice) where.price.lte = query.maxPrice;
  }
  if (query.minArea || query.maxArea) {
    where.area = {};
    if (query.minArea) where.area.gte = query.minArea;
    if (query.maxArea) where.area.lte = query.maxArea;
  }
  if (query.bedrooms) where.bedrooms = { gte: query.bedrooms };
  if (query.bathrooms) where.bathrooms = { gte: query.bathrooms };
  if (query.parking === 'true') where.parking = true;
  if (query.waterSupply === 'true') where.waterSupply = true;
  if (query.roadAccess === 'true') where.roadAccess = true;
  if (query.isFeatured === 'true') where.isFeatured = true;

  const orderBy: any = {};
  orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        owner: { include: { profile: true } },
        _count: { select: { reviews: true, wishlistedBy: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  res.json({
    success: true,
    data: properties,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

export const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) throw AppError.badRequest('Missing id');

  const property = await prisma.property.findUnique({
    where: { id, deletedAt: null },
    include: {
      images: { orderBy: { order: 'asc' } },
      videos: true,
      documents: true,
      amenities: { include: { amenity: true } },
      owner: { include: { profile: true } },
      reviews: {
        include: { reviewer: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true, wishlistedBy: true, visitRequests: true } },
    },
  });

  if (!property) {
    throw AppError.notFound('Property not found');
  }

  // Increment view count
  await prisma.property.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  res.json({ success: true, data: property });
});

export const createProperty = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as CreatePropertyInput;
  const ownerId = req.user!.userId;
  const slug = generateSlug(data.title) + '-' + Date.now().toString(36);

  const { amenityIds, ...propertyData } = data;

  const property = await prisma.property.create({
    data: {
      ...propertyData,
      slug,
      ownerId,
      amenities: amenityIds?.length
        ? { create: amenityIds.map((id) => ({ amenityId: id })) }
        : undefined,
    } as any,
    include: { images: true, amenities: { include: { amenity: true } } },
  });

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: property,
  });
});

export const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) throw AppError.badRequest('Missing id');
  const data = req.body;
  const userId = req.user!.userId;

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound('Property not found');
  if (existing.ownerId !== userId && req.user!.role !== UserRole.ADMIN) {
    throw AppError.forbidden('You can only edit your own properties');
  }

  const { amenityIds, ...propertyData } = data;

  const property = await prisma.property.update({
    where: { id },
    data: propertyData,
    include: { images: true },
  });

  res.json({ success: true, message: 'Property updated', data: property });
});

export const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) throw AppError.badRequest('Missing id');
  const userId = req.user!.userId;

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound('Property not found');
  if (existing.ownerId !== userId && req.user!.role !== UserRole.ADMIN) {
    throw AppError.forbidden('You can only delete your own properties');
  }

  // Soft delete
  await prisma.property.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  res.json({ success: true, message: 'Property deleted' });
});

export const getFeaturedProperties = catchAsync(async (_req: Request, res: Response) => {
  const properties = await prisma.property.findMany({
    where: { isFeatured: true, isApproved: true, deletedAt: null, status: 'AVAILABLE' },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      owner: { include: { profile: true } },
      _count: { select: { reviews: true } },
    },
  });

  res.json({ success: true, data: properties });
});

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json({ success: true, data: categories });
});

export const getOwnerProperties = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user!.userId;
  const properties = await prisma.property.findMany({
    where: { ownerId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      _count: { select: { reviews: true, visitRequests: true, wishlistedBy: true } },
    },
  });

  res.json({ success: true, data: properties });
});

export const uploadPropertyImages = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) throw AppError.badRequest('Missing id');
  const files = req.files as Express.Multer.File[];

  if (!files?.length) {
    throw AppError.badRequest('No images uploaded');
  }

  const images = await Promise.all(
    files.map((file, index) =>
      prisma.propertyImage.create({
        data: {
          propertyId: id,
          url: `/uploads/${file.filename}`,
          isPrimary: index === 0,
          order: index,
        },
      })
    )
  );

  res.status(201).json({ success: true, data: images });
});

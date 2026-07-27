import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, AppError } from '../../utils';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: { id: id as string, deletedAt: null },
    include: { profile: true },
  });

  if (!user) throw AppError.notFound('User not found');

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      profile: user.profile,
      createdAt: user.createdAt,
    },
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = req.body;

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, fullName: data.fullName || '', ...data },
  });

  res.json({ success: true, message: 'Profile updated', data: profile });
});

export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const file = req.file;

  if (!file) throw AppError.badRequest('No file uploaded');

  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatar: `/uploads/${file.filename}` },
  });

  res.json({ success: true, data: { avatar: user.avatar } });
});

// Wishlist
export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      property: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          owner: { include: { profile: true } },
          _count: { select: { reviews: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: wishlist });
});

export const toggleWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { propertyId } = req.body;

  const existing = await prisma.wishlist.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: { userId_propertyId: { userId, propertyId } },
    });
    res.json({ success: true, message: 'Removed from wishlist', data: { wishlisted: false } });
  } else {
    await prisma.wishlist.create({ data: { userId, propertyId } });
    res.json({ success: true, message: 'Added to wishlist', data: { wishlisted: true } });
  }
});

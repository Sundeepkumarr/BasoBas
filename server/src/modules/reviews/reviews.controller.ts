import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, AppError, paginationHelper, buildPaginationMeta } from '../../utils';

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { propertyId, targetUserId, rating, comment, type } = req.body;
  const reviewerId = req.user!.userId;

  const review = await prisma.review.create({
    data: { propertyId, reviewerId, targetUserId, rating, comment, type },
    include: { reviewer: { include: { profile: true } } },
  });

  res.status(201).json({ success: true, data: review });
});

export const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const { page, limit } = req.query as any;
  const { skip, take } = paginationHelper(page, limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { propertyId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { reviewer: { include: { profile: true } } },
    }),
    prisma.review.count({ where: { propertyId } }),
  ]);

  // Calculate average rating
  const avgResult = await prisma.review.aggregate({
    where: { propertyId },
    _avg: { rating: true },
    _count: true,
  });

  res.json({
    success: true,
    data: reviews,
    meta: { averageRating: avgResult._avg.rating || 0, totalReviews: avgResult._count },
    pagination: buildPaginationMeta(total, page || 1, limit || 10),
  });
});

export const getUserReviews = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const reviews = await prisma.review.findMany({
    where: { targetUserId: userId },
    orderBy: { createdAt: 'desc' },
    include: { reviewer: { include: { profile: true } } },
  });

  res.json({ success: true, data: reviews });
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw AppError.notFound('Review not found');
  if (review.reviewerId !== userId && req.user!.role !== 'ADMIN') {
    throw AppError.forbidden('You can only delete your own reviews');
  }

  await prisma.review.delete({ where: { id } });
  res.json({ success: true, message: 'Review deleted' });
});

import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, paginationHelper, buildPaginationMeta } from '../../utils';

export const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const [totalUsers, totalProperties, pendingApprovals, totalVisits, totalReviews, totalFinanceRequests] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { isApproved: false, deletedAt: null } }),
    prisma.visitRequest.count(),
    prisma.review.count(),
    prisma.financeRequest.count(),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProperties,
      pendingApprovals,
      totalVisits,
      totalReviews,
      totalFinanceRequests,
    },
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, role, search } = req.query as any;
  const { skip, take } = paginationHelper(page, limit);

  const where: any = { deletedAt: null };
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { fullName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { profile: true, _count: { select: { properties: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users.map(({ password: _omit, ...safeUser }) => safeUser),
    pagination: buildPaginationMeta(total, page || 1, limit || 20),
  });
});

export const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, status, isApproved } = req.query as any;
  const { skip, take } = paginationHelper(page, limit);

  const where: any = { deletedAt: null };
  if (status) where.status = status;
  if (isApproved !== undefined) where.isApproved = isApproved === 'true';

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        owner: { include: { profile: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  res.json({
    success: true,
    data: properties,
    pagination: buildPaginationMeta(total, page || 1, limit || 20),
  });
});

export const approveProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const property = await prisma.property.update({
    where: { id },
    data: { isApproved: true },
  });
  res.json({ success: true, message: 'Property approved', data: property });
});

export const rejectProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const property = await prisma.property.update({
    where: { id },
    data: { isApproved: false, status: 'PENDING' },
  });
  res.json({ success: true, message: 'Property rejected', data: property });
});

export const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });

  res.json({ success: true, message: `User ${updated.isActive ? 'activated' : 'deactivated'}`, data: updated });
});

export const verifyUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id },
    data: { isVerified: true },
  });
  res.json({ success: true, message: 'User verified', data: user });
});

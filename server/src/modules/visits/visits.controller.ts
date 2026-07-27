import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, AppError, paginationHelper, buildPaginationMeta } from '../../utils';

export const createVisit = catchAsync(async (req: Request, res: Response) => {
  const { propertyId, scheduledDate, scheduledTime, message } = req.body;
  const visitorId = req.user!.userId;

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw AppError.notFound('Property not found');
  if (property.ownerId === visitorId) throw AppError.badRequest('You cannot visit your own property');

  const visit = await prisma.visitRequest.create({
    data: {
      propertyId,
      visitorId,
      ownerId: property.ownerId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      message,
    },
    include: {
      property: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      visitor: { include: { profile: true } },
    },
  });

  res.status(201).json({ success: true, message: 'Visit request sent', data: visit });
});

export const getVisits = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const role = req.user!.role;
  const { page, limit } = req.query as any;
  const { skip, take } = paginationHelper(page, limit);

  const where: any = {};
  if (role === 'OWNER') where.ownerId = userId;
  else where.visitorId = userId;

  const [visits, total] = await Promise.all([
    prisma.visitRequest.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        property: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        visitor: { include: { profile: true } },
        owner: { include: { profile: true } },
      },
    }),
    prisma.visitRequest.count({ where }),
  ]);

  res.json({
    success: true,
    data: visits,
    pagination: buildPaginationMeta(total, page || 1, limit || 12),
  });
});

export const updateVisitStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user!.userId;

  const visit = await prisma.visitRequest.findUnique({ where: { id } });
  if (!visit) throw AppError.notFound('Visit request not found');
  if (visit.ownerId !== userId) throw AppError.forbidden('Only the owner can update this visit');

  const updated = await prisma.visitRequest.update({
    where: { id },
    data: { status },
    include: {
      property: true,
      visitor: { include: { profile: true } },
    },
  });

  res.json({ success: true, message: `Visit ${status.toLowerCase()}`, data: updated });
});

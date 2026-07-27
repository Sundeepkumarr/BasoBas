import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, paginationHelper, buildPaginationMeta } from '../../utils';

export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { page, limit } = req.query as any;
  const { skip, take } = paginationHelper(page, limit);

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  res.json({
    success: true,
    data: notifications,
    meta: { unreadCount },
    pagination: buildPaginationMeta(total, page || 1, limit || 20),
  });
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  res.json({ success: true, message: 'Notification marked as read' });
});

export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  res.json({ success: true, message: 'All notifications marked as read' });
});

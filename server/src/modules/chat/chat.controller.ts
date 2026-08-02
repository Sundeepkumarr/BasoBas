import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, AppError } from '../../utils';

export const getChats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const chats = await prisma.chat.findMany({
    where: {
      participants: { has: userId }
    },
    orderBy: { updatedAt: 'desc' }
  });

  res.json({ success: true, data: chats });
});

export const createChat = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { participantId, propertyId } = req.body;

  // Check if chat already exists between these users
  let chat = await prisma.chat.findFirst({
    where: {
      participants: { hasEvery: [userId, participantId] },
      ...(propertyId ? { propertyId } : {})
    }
  });

  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        participants: [userId, participantId],
        propertyId,
      }
    });
  }

  res.status(201).json({ success: true, data: chat });
});

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) throw AppError.badRequest('Missing id');
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  const chat = await prisma.chat.findUnique({ where: { id } });
  if (!chat) throw AppError.notFound('Chat not found');
  if (!chat.participants.includes(userId)) throw AppError.forbidden('Access denied');

  const messages = await prisma.message.findMany({
    where: { chatId: id },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: {
      chatId: id,
      senderId: { not: userId },
      isRead: false
    },
    data: {
      isRead: true,
      seenAt: new Date()
    }
  });

  res.json({ success: true, data: messages.reverse() });
});

export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) throw AppError.badRequest('Missing id');
  const userId = req.user!.userId;
  const { content, type } = req.body;

  const chat = await prisma.chat.findUnique({ where: { id } });
  if (!chat) throw AppError.notFound('Chat not found');
  if (!chat.participants.includes(userId)) throw AppError.forbidden('Access denied');

  const message = await prisma.message.create({
    data: {
      chatId: id,
      senderId: userId,
      content,
      type: type || 'TEXT',
    }
  });

  // Update chat's last message
  await prisma.chat.update({
    where: { id },
    data: {
      lastMessage: content,
      lastMessageAt: new Date(),
    }
  });

  res.status(201).json({ success: true, data: message });
});

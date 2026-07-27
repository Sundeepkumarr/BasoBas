import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, AppError, generateSlug, paginationHelper, buildPaginationMeta } from '../../utils';

export const getBlogPosts = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const { skip, take } = paginationHelper(page, limit);

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      skip,
      take,
      orderBy: { publishedAt: 'desc' },
      include: { author: { include: { profile: true } } },
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: buildPaginationMeta(total, page || 1, limit || 10),
  });
});

export const getBlogPost = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { include: { profile: true } } },
  });

  if (!post) throw AppError.notFound('Blog post not found');
  res.json({ success: true, data: post });
});

export const createBlogPost = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user!.userId;
  const { title, content, excerpt, coverImage, tags, isPublished } = req.body;
  const slug = generateSlug(title) + '-' + Date.now().toString(36);

  const post = await prisma.blogPost.create({
    data: {
      authorId,
      title,
      slug,
      content,
      excerpt,
      coverImage,
      tags,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  res.status(201).json({ success: true, data: post });
});

export const getFAQs = catchAsync(async (_req: Request, res: Response) => {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  res.json({ success: true, data: faqs });
});

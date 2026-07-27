export { AppError } from './AppError';
export { catchAsync } from './catchAsync';
export { logger } from './logger';

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const paginationHelper = (page: number = 1, limit: number = 12) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const skip = (safePage - 1) * safeLimit;
  return { skip, take: safeLimit, page: safePage, limit: safeLimit };
};

export const buildPaginationMeta = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export const formatPrice = (price: number): string => {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return `Rs. ${price.toLocaleString('en-NP')}`;
};

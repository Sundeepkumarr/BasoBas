import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { config } from './config';
import { errorHandler } from './middleware';
import { logger } from './utils/logger';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import propertyRoutes from './modules/properties/properties.routes';
import visitRoutes from './modules/visits/visits.routes';
import chatRoutes from './modules/chat/chat.routes';
import reviewRoutes from './modules/reviews/reviews.routes';
import financeRoutes from './modules/finance/finance.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import blogRoutes from './modules/blog/blog.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();
const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '');

// ==========================================
// MIDDLEWARE
// ==========================================

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) {
    next();
    return;
  }

  if (req.method === 'OPTIONS' && !config.clientUrls.includes(normalizeOrigin(origin))) {
    res.status(403).json({ success: false, message: 'CORS origin denied' });
    return;
  }

  next();
});
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.clientUrls.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Static files (uploads)
const uploadsDir = path.resolve(config.upload.dir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// ROUTES
// ==========================================

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Basobas API is running 🏠', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================

const start = async () => {
  try {
    app.listen(config.port, () => {
      logger.info(`🚀 Basobas Server running on port ${config.port}`);
      logger.info(`📍 Environment: ${config.env}`);
      logger.info(`🔗 API: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;

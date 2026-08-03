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

// ==========================================
// MIDDLEWARE
// ==========================================

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
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

// Serve frontend build when present
const clientDistPaths = [
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
];

const clientDistPath = clientDistPaths.find((candidate) => fs.existsSync(candidate));
if (clientDistPath) {
  app.use(express.static(clientDistPath));
}

// ==========================================
// ROUTES
// ==========================================

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Hamro Awas API is running 🏠', timestamp: new Date().toISOString() });
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
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ success: false, message: 'Route not found' });
    return;
  }

  const indexPath = clientDistPath ? path.join(clientDistPath, 'index.html') : null;
  if (indexPath && fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    return;
  }

  next();
});

// Global error handler
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================

const start = async () => {
  try {
    app.listen(config.port, () => {
      logger.info(`🚀 Hamro Awas Server running on port ${config.port}`);
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

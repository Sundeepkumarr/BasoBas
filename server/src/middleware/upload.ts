import multer from 'multer';
import path from 'path';
import { config } from '../config';
import { AppError } from '../utils';

// Use absolute path to match the directory created in app.ts via path.resolve()
const uploadsDir = path.resolve(config.upload.dir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  const allowedVideoTypes = ['video/mp4', 'video/webm'];
  const allowedDocTypes = ['application/pdf', 'image/jpeg', 'image/png'];

  const allAllowed = [...allowedImageTypes, ...allowedVideoTypes, ...allowedDocTypes];

  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('File type not allowed', 400) as any, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});

export const uploadImages = upload.array('images', 20);
export const uploadVideo = upload.single('video');
export const uploadDocument = upload.single('document');
export const uploadAvatar = upload.single('avatar');

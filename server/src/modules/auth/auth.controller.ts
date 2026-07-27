import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../../config/database';
import { config } from '../../config';
import { catchAsync, AppError } from '../../utils';
import { JwtPayload, UserRole } from '../../types';
import { RegisterInput, LoginInput } from '../../validators';

const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as any,
  });
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as any,
  });
  return { accessToken, refreshToken };
};

const googleClient = new OAuth2Client(config.google.clientId);

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, fullName, phone, role } = req.body as RegisterInput;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw AppError.conflict('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      phone,
      role: role as UserRole,
      profile: {
        create: { fullName },
      },
    },
    include: { profile: true },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const { accessToken, refreshToken } = generateTokens(payload);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.profile?.fullName,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null },
    include: { profile: true },
  });

  if (!user || !user.password) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const { accessToken, refreshToken } = generateTokens(payload);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.profile?.fullName,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw AppError.unauthorized('Refresh token is required');
  }

  const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId, deletedAt: null },
  });

  if (!user) {
    throw AppError.unauthorized('User not found');
  }

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const tokens = generateTokens(payload);

  res.json({
    success: true,
    message: 'Token refreshed',
    data: tokens,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: { profile: true },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      profile: user.profile,
    },
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if user exists
    res.json({ success: true, message: 'If that email is registered, you will receive a reset link.' });
    return;
  }

  // In production: generate token, save it, send email
  // For now, just respond
  res.json({
    success: true,
    message: 'If that email is registered, you will receive a reset link.',
  });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  // In production: invalidate refresh token in DB/Redis
  res.json({ success: true, message: 'Logged out successfully' });
});

export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { credential, role } = req.body;
  if (!credential) throw AppError.badRequest('Google token is required');

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.google.clientId,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw AppError.unauthorized('Invalid Google token');

  const { email, name, sub: googleId, picture } = payload;

  let user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        googleId,
        role: (role as UserRole) || UserRole.BUYER,
        isVerified: true, // Google accounts are implicitly verified
        avatar: picture,
        profile: {
          create: { fullName: name || 'Google User' },
        },
      },
      include: { profile: true },
    });
  } else if (!user.googleId) {
    // Link Google account to existing user
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId, isVerified: true, avatar: user.avatar || picture },
      include: { profile: true },
    });
  }

  const jwtPayload: JwtPayload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const { accessToken, refreshToken } = generateTokens(jwtPayload);

  res.json({
    success: true,
    message: 'Google login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.profile?.fullName,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    },
  });
});

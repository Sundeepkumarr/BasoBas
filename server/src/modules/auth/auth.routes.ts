import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate, validate } from '../../middleware';
import { registerSchema, loginSchema, forgotPasswordSchema } from '../../validators';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/google', authController.googleLogin);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

export default router;

import { Router } from 'express';
import * as ctrl from './admin.controller';
import { authenticate, authorize } from '../../middleware';
import { UserRole } from '../../types';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/dashboard', ctrl.getDashboardStats);
router.get('/users', ctrl.getAllUsers);
router.get('/properties', ctrl.getAllProperties);
router.put('/properties/:id/approve', ctrl.approveProperty);
router.put('/properties/:id/reject', ctrl.rejectProperty);
router.put('/users/:id/toggle-status', ctrl.toggleUserStatus);
router.put('/users/:id/verify', ctrl.verifyUser);

export default router;

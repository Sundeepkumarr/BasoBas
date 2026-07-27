import { Router } from 'express';
import * as ctrl from './notifications.controller';
import { authenticate } from '../../middleware';

const router = Router();

router.get('/', authenticate, ctrl.getNotifications);
router.put('/read-all', authenticate, ctrl.markAllAsRead);
router.put('/:id/read', authenticate, ctrl.markAsRead);

export default router;

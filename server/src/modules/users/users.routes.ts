import { Router } from 'express';
import * as ctrl from './users.controller';
import { authenticate, validate, uploadAvatar } from '../../middleware';
import { updateProfileSchema } from '../../validators';

const router = Router();

router.get('/wishlist', authenticate, ctrl.getWishlist);
router.post('/wishlist', authenticate, ctrl.toggleWishlist);
router.get('/:id', ctrl.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), ctrl.updateProfile);
router.put('/avatar', authenticate, uploadAvatar, ctrl.updateAvatar);

export default router;

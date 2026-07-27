import { Router } from 'express';
import * as ctrl from './reviews.controller';
import { authenticate, validate } from '../../middleware';
import { createReviewSchema } from '../../validators';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), ctrl.createReview);
router.get('/property/:propertyId', ctrl.getPropertyReviews);
router.get('/user/:userId', ctrl.getUserReviews);
router.delete('/:id', authenticate, ctrl.deleteReview);

export default router;

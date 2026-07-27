import { Router } from 'express';
import * as ctrl from './visits.controller';
import { authenticate, validate } from '../../middleware';
import { createVisitSchema } from '../../validators';

const router = Router();

router.post('/', authenticate, validate(createVisitSchema), ctrl.createVisit);
router.get('/', authenticate, ctrl.getVisits);
router.put('/:id/accept', authenticate, ctrl.updateVisitStatus);
router.put('/:id/reject', authenticate, ctrl.updateVisitStatus);

export default router;

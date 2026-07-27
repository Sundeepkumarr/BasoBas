import { Router } from 'express';
import * as ctrl from './finance.controller';
import { authenticate, authorize, validate } from '../../middleware';
import { createFinanceRequestSchema } from '../../validators';
import { UserRole } from '../../types';

const router = Router();

router.post('/', authenticate, validate(createFinanceRequestSchema), ctrl.createFinanceRequest);
router.get('/', authenticate, ctrl.getFinanceRequests);
router.put('/:id/status', authenticate, authorize(UserRole.ADMIN), ctrl.updateFinanceStatus);
router.post('/calculate-emi', ctrl.calculateEMI);

export default router;

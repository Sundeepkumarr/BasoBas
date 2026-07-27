import { Router } from 'express';
import * as ctrl from './properties.controller';
import { authenticate, authorize, optionalAuth, validate, uploadImages } from '../../middleware';
import { createPropertySchema, updatePropertySchema, propertyQuerySchema } from '../../validators';
import { UserRole } from '../../types';

const router = Router();

router.get('/', optionalAuth, validate(propertyQuerySchema, 'query'), ctrl.getProperties);
router.get('/featured', ctrl.getFeaturedProperties);
router.get('/categories', ctrl.getCategories);
router.get('/owner', authenticate, authorize(UserRole.OWNER, UserRole.ADMIN), ctrl.getOwnerProperties);
router.get('/:id', optionalAuth, ctrl.getPropertyById);
router.post('/', authenticate, authorize(UserRole.OWNER, UserRole.ADMIN), validate(createPropertySchema), ctrl.createProperty);
router.put('/:id', authenticate, authorize(UserRole.OWNER, UserRole.ADMIN), validate(updatePropertySchema), ctrl.updateProperty);
router.delete('/:id', authenticate, authorize(UserRole.OWNER, UserRole.ADMIN), ctrl.deleteProperty);
router.post('/:id/images', authenticate, authorize(UserRole.OWNER, UserRole.ADMIN), uploadImages, ctrl.uploadPropertyImages);

export default router;

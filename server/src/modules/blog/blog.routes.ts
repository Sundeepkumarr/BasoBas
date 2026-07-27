import { Router } from 'express';
import * as ctrl from './blog.controller';
import { authenticate, authorize, validate } from '../../middleware';
import { createBlogPostSchema } from '../../validators';
import { UserRole } from '../../types';

const router = Router();

router.get('/posts', ctrl.getBlogPosts);
router.get('/posts/:slug', ctrl.getBlogPost);
router.post('/posts', authenticate, authorize(UserRole.ADMIN, UserRole.STAFF), validate(createBlogPostSchema), ctrl.createBlogPost);
router.get('/faqs', ctrl.getFAQs);

export default router;

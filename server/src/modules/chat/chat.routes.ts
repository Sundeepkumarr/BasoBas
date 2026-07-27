import { Router } from 'express';
import * as ctrl from './chat.controller';
import { authenticate, validate } from '../../middleware';
import { createChatSchema, sendMessageSchema } from '../../validators';

const router = Router();

router.get('/', authenticate, ctrl.getChats);
router.post('/', authenticate, validate(createChatSchema), ctrl.createChat);
router.get('/:id/messages', authenticate, ctrl.getMessages);
router.post('/:id/messages', authenticate, validate(sendMessageSchema), ctrl.sendMessage);

export default router;

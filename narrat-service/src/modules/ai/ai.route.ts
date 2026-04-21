import { Router } from 'express';
import { AIController } from './ai.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.post('/chat', asyncHandler(AIController.chat));
router.get('/conversations', asyncHandler(AIController.getConversations));
router.get('/conversations/:id/messages', asyncHandler(AIController.getConversationMessages));
router.delete('/conversations/:id', asyncHandler(AIController.deleteConversation));

export default router;

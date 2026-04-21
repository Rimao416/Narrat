import { Router } from 'express';
import { ConfessionController } from './confession.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', asyncHandler(ConfessionController.getAll));
router.get('/:id', asyncHandler(ConfessionController.getById));
router.post('/', authenticate, asyncHandler(ConfessionController.create));
router.post('/:id/replies', authenticate, asyncHandler(ConfessionController.addReply));
router.post('/:id/pray', authenticate, asyncHandler(ConfessionController.pray));
router.delete('/:id', authenticate, asyncHandler(ConfessionController.delete));

export default router;

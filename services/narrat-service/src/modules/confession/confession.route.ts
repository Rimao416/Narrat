import { Router } from 'express';
import { ConfessionController } from './confession.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/', asyncHandler(ConfessionController.getAll));
router.get('/:id', asyncHandler(ConfessionController.getById));
router.post('/', asyncHandler(ConfessionController.create));
router.post('/:id/replies', asyncHandler(ConfessionController.addReply));
router.post('/:id/pray', asyncHandler(ConfessionController.pray));
router.delete('/:id', asyncHandler(ConfessionController.delete));

export default router;

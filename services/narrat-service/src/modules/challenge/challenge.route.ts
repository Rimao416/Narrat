import { Router } from 'express';
import { ChallengeController } from './challenge.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', asyncHandler(ChallengeController.getAll));
router.get('/:id', asyncHandler(ChallengeController.getById));
router.get('/mine', authenticate, asyncHandler(ChallengeController.getMyChallenges));
router.post('/join', authenticate, asyncHandler(ChallengeController.join));
router.post('/check-in', authenticate, asyncHandler(ChallengeController.checkIn));
router.put('/:id/abandon', authenticate, asyncHandler(ChallengeController.abandon));

export default router;

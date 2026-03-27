import { Router } from 'express';
import { ChallengeController } from './challenge.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/', asyncHandler(ChallengeController.getAll));
router.get('/mine', asyncHandler(ChallengeController.getMyChallenges));
router.get('/:id', asyncHandler(ChallengeController.getById));
router.post('/join', asyncHandler(ChallengeController.join));
router.post('/check-in', asyncHandler(ChallengeController.checkIn));
router.put('/:id/abandon', asyncHandler(ChallengeController.abandon));

export default router;

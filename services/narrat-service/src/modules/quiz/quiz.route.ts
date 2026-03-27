import { Router } from 'express';
import { QuizController } from './quiz.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.post('/session/start', asyncHandler(QuizController.startSession));
router.post('/session/answer', asyncHandler(QuizController.submitAnswer));
router.get('/tournaments', asyncHandler(QuizController.getTournaments));
router.post('/tournaments/:id/join', asyncHandler(QuizController.joinTournament));
router.post('/duel', asyncHandler(QuizController.createDuel));
router.get('/leaderboard', asyncHandler(QuizController.getLeaderboard));

export default router;

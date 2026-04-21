import { Router } from 'express';
import { RevivalController } from './revival.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/figures', asyncHandler(RevivalController.getFigures));
router.get('/figures/:id', asyncHandler(RevivalController.getFigureById));
router.get('/testimonies', asyncHandler(RevivalController.getTestimonies));
router.get('/historical', asyncHandler(RevivalController.getHistoricalRevivals));

export default router;

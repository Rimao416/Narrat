import { Router } from 'express';
import { HealthController } from './health.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/bilan', asyncHandler(HealthController.getLatestBilan));
router.get('/bilan/history', asyncHandler(HealthController.getBilanHistory));
router.post('/bilan', asyncHandler(HealthController.submitBilan));
router.get('/growth-plans', asyncHandler(HealthController.getGrowthPlans));

export default router;

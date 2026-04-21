import { Router } from 'express';
import { AuthController } from './auth.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.get('/me', authenticate, asyncHandler(AuthController.me));
router.post('/refresh', asyncHandler(AuthController.refresh));

export default router;

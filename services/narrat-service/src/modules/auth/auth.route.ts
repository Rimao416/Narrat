import { Router } from 'express';
import { AuthController } from './auth.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));

export default router;

import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/daily-verse', asyncHandler(NotificationController.getDailyVerse));
router.get('/', asyncHandler(NotificationController.getNotifications));
router.put('/read-all', asyncHandler(NotificationController.markAllAsRead));
router.put('/:id/read', asyncHandler(NotificationController.markAsRead));
router.get('/settings', asyncHandler(NotificationController.getSettings));
router.put('/settings', asyncHandler(NotificationController.updateSettings));

export default router;

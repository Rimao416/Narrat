import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { requireAdmin, requireModerator, requireSuperAdmin } from '../../shared/middlewares/authorize.middleware';
import {
  AdminUsersController,
  AdminBooksController,
  AdminCoursesController,
  AdminSongsController,
  AdminChallengesController,
  AdminConfessionsController,
  AdminReportsController,
  AdminCrisisController,
  AdminAnalyticsController,
  AdminConfigController,
} from './admin.controller';

const router = Router();

// All admin routes require authentication + at least ADMIN role
router.use(authenticate);

// ─── Users (ADMIN+) ───────────────────────────────────────────────────────────
router.get('/users/stats', requireAdmin, asyncHandler(AdminUsersController.stats));
router.get('/users', requireAdmin, asyncHandler(AdminUsersController.list));
router.get('/users/:id', requireAdmin, asyncHandler(AdminUsersController.get));
router.patch('/users/:id/role', requireAdmin, asyncHandler(AdminUsersController.updateRole));
router.post('/users/:id/ban', requireModerator, asyncHandler(AdminUsersController.ban));
router.post('/users/:id/unban', requireModerator, asyncHandler(AdminUsersController.unban));
router.delete('/users/:id', requireSuperAdmin, asyncHandler(AdminUsersController.delete));

// ─── Books (EDITOR+) ──────────────────────────────────────────────────────────
router.get('/books', requireModerator, asyncHandler(AdminBooksController.list));
router.post('/books/reorder', requireAdmin, asyncHandler(AdminBooksController.reorder));
router.get('/books/:id', requireModerator, asyncHandler(AdminBooksController.get));
router.post('/books', requireAdmin, asyncHandler(AdminBooksController.create));
router.patch('/books/:id', requireAdmin, asyncHandler(AdminBooksController.update));
router.patch('/books/:id/status', requireModerator, asyncHandler(AdminBooksController.updateStatus));
router.delete('/books/:id', requireAdmin, asyncHandler(AdminBooksController.delete));

// ─── Courses (EDITOR+) ────────────────────────────────────────────────────────
router.get('/courses', requireModerator, asyncHandler(AdminCoursesController.list));
router.post('/courses/reorder', requireAdmin, asyncHandler(AdminCoursesController.reorder));
router.get('/courses/:id', requireModerator, asyncHandler(AdminCoursesController.get));
router.post('/courses', requireAdmin, asyncHandler(AdminCoursesController.create));
router.patch('/courses/:id', requireAdmin, asyncHandler(AdminCoursesController.update));
router.patch('/courses/:id/status', requireModerator, asyncHandler(AdminCoursesController.updateStatus));
router.delete('/courses/:id', requireAdmin, asyncHandler(AdminCoursesController.delete));

// ─── Songs (EDITOR+) ──────────────────────────────────────────────────────────
router.get('/songs', requireModerator, asyncHandler(AdminSongsController.list));
router.post('/songs', requireAdmin, asyncHandler(AdminSongsController.create));
router.patch('/songs/:id', requireAdmin, asyncHandler(AdminSongsController.update));
router.patch('/songs/:id/status', requireModerator, asyncHandler(AdminSongsController.updateStatus));
router.delete('/songs/:id', requireAdmin, asyncHandler(AdminSongsController.delete));

// ─── Challenges (EDITOR+) ─────────────────────────────────────────────────────
router.get('/challenges', requireModerator, asyncHandler(AdminChallengesController.list));
router.post('/challenges/reorder', requireAdmin, asyncHandler(AdminChallengesController.reorder));
router.get('/challenges/:id', requireModerator, asyncHandler(AdminChallengesController.get));
router.post('/challenges', requireAdmin, asyncHandler(AdminChallengesController.create));
router.patch('/challenges/:id', requireAdmin, asyncHandler(AdminChallengesController.update));
router.patch('/challenges/:id/status', requireModerator, asyncHandler(AdminChallengesController.updateStatus));
router.delete('/challenges/:id', requireAdmin, asyncHandler(AdminChallengesController.delete));

// ─── Confessions (MODERATOR+) ─────────────────────────────────────────────────
router.get('/confessions', requireModerator, asyncHandler(AdminConfessionsController.list));
router.post('/confessions/:id/approve', requireModerator, asyncHandler(AdminConfessionsController.approve));
router.post('/confessions/:id/flag', requireModerator, asyncHandler(AdminConfessionsController.flag));
router.delete('/confessions/:id', requireModerator, asyncHandler(AdminConfessionsController.delete));

// ─── Reports (MODERATOR+) ─────────────────────────────────────────────────────
router.get('/reports', requireModerator, asyncHandler(AdminReportsController.list));
router.get('/reports/:id', requireModerator, asyncHandler(AdminReportsController.get));
router.post('/reports/:id/resolve', requireModerator, asyncHandler(AdminReportsController.resolve));
router.post('/reports/:id/dismiss', requireModerator, asyncHandler(AdminReportsController.dismiss));

// ─── Crisis AI (MODERATOR+) ───────────────────────────────────────────────────
router.get('/ai/crises', requireModerator, asyncHandler(AdminCrisisController.list));
router.patch('/ai/crises/:id/review', requireModerator, asyncHandler(AdminCrisisController.review));

// ─── Analytics (ADMIN+) ───────────────────────────────────────────────────────
router.get('/analytics/stats', requireAdmin, asyncHandler(AdminAnalyticsController.stats));
router.get('/analytics/user-growth', requireAdmin, asyncHandler(AdminAnalyticsController.userGrowth));
router.get('/analytics/engagement', requireAdmin, asyncHandler(AdminAnalyticsController.engagement));
router.get('/analytics/top-content', requireAdmin, asyncHandler(AdminAnalyticsController.topContent));

// ─── Config / Feature Flags (SUPER_ADMIN) ─────────────────────────────────────
router.get('/config', requireAdmin, asyncHandler(AdminConfigController.listConfigs));
router.patch('/config/:key', requireSuperAdmin, asyncHandler(AdminConfigController.updateConfig));
router.get('/features', requireAdmin, asyncHandler(AdminConfigController.listFlags));
router.patch('/features/:key', requireSuperAdmin, asyncHandler(AdminConfigController.updateFlag));

// ─── Notifications (ADMIN+) ───────────────────────────────────────────────────
router.post('/notifications/broadcast', requireAdmin, asyncHandler(AdminConfigController.broadcast));
router.get('/notifications/verses', requireAdmin, asyncHandler(AdminConfigController.getDailyVerses));
router.post('/notifications/verses', requireAdmin, asyncHandler(AdminConfigController.addDailyVerse));
router.delete('/notifications/verses/:key', requireAdmin, asyncHandler(AdminConfigController.removeDailyVerse));

export default router;

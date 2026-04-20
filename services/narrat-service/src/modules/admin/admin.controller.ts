import { Request, Response } from 'express';
import { AdminUsersService } from './admin.users.service';
import { AdminBooksService, AdminCoursesService, AdminSongsService, AdminChallengesService } from './admin.content.service';
import { AdminConfessionsService, AdminReportsService, AdminCrisisService } from './admin.moderation.service';
import { AdminAnalyticsService } from './admin.analytics.service';
import { AdminConfigService } from './admin.config.service';
import {
  banUserSchema, changeRoleSchema, updateStatusSchema, reorderSchema,
  createBookSchema, updateBookSchema,
  createCourseSchema, updateCourseSchema,
  createChallengeSchema, updateChallengeSchema,
  createSongSchema, updateSongSchema,
  resolveReportSchema, broadcastNotificationSchema,
  updateFeatureFlagSchema, updateConfigSchema,
  upsertVerseSchema,
} from './admin.dto';

const moderatorId = (req: Request) => (req as any).user.id;

// ─── Users ────────────────────────────────────────────────────────────────────

export class AdminUsersController {
  static async list(req: Request, res: Response) {
    const result = await AdminUsersService.list(req.query as any);
    res.json(result);
  }
  static async stats(req: Request, res: Response) {
    res.json(await AdminUsersService.stats());
  }
  static async get(req: Request, res: Response) {
    res.json(await AdminUsersService.get(req.params.id));
  }
  static async updateRole(req: Request, res: Response) {
    const { role } = changeRoleSchema.parse(req.body);
    res.json(await AdminUsersService.updateRole(req.params.id, role, moderatorId(req)));
  }
  static async ban(req: Request, res: Response) {
    const { reason } = banUserSchema.parse(req.body);
    await AdminUsersService.ban(req.params.id, reason, moderatorId(req));
    res.json({ message: 'Utilisateur banni' });
  }
  static async unban(req: Request, res: Response) {
    await AdminUsersService.unban(req.params.id, moderatorId(req));
    res.json({ message: 'Utilisateur débanni' });
  }
  static async delete(req: Request, res: Response) {
    await AdminUsersService.delete(req.params.id, moderatorId(req));
    res.json({ message: 'Utilisateur supprimé' });
  }
}

// ─── Books ────────────────────────────────────────────────────────────────────

export class AdminBooksController {
  static async list(req: Request, res: Response) {
    res.json(await AdminBooksService.list(req.query as any));
  }
  static async get(req: Request, res: Response) {
    res.json(await AdminBooksService.get(req.params.id));
  }
  static async create(req: Request, res: Response) {
    const data = createBookSchema.parse(req.body);
    res.status(201).json(await AdminBooksService.create(data));
  }
  static async update(req: Request, res: Response) {
    const data = updateBookSchema.parse(req.body);
    res.json(await AdminBooksService.update(req.params.id, data));
  }
  static async updateStatus(req: Request, res: Response) {
    const { status } = updateStatusSchema.parse(req.body);
    res.json(await AdminBooksService.updateStatus(req.params.id, status));
  }
  static async reorder(req: Request, res: Response) {
    const { ids } = reorderSchema.parse(req.body);
    await AdminBooksService.reorder(ids);
    res.json({ message: 'Ordre mis à jour' });
  }
  static async delete(req: Request, res: Response) {
    await AdminBooksService.delete(req.params.id);
    res.json({ message: 'Livre supprimé' });
  }
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export class AdminCoursesController {
  static async list(req: Request, res: Response) {
    res.json(await AdminCoursesService.list(req.query as any));
  }
  static async get(req: Request, res: Response) {
    res.json(await AdminCoursesService.get(req.params.id));
  }
  static async create(req: Request, res: Response) {
    const data = createCourseSchema.parse(req.body);
    res.status(201).json(await AdminCoursesService.create(data));
  }
  static async update(req: Request, res: Response) {
    const data = updateCourseSchema.parse(req.body);
    res.json(await AdminCoursesService.update(req.params.id, data));
  }
  static async updateStatus(req: Request, res: Response) {
    const { status } = updateStatusSchema.parse(req.body);
    res.json(await AdminCoursesService.updateStatus(req.params.id, status));
  }
  static async reorder(req: Request, res: Response) {
    const { ids } = reorderSchema.parse(req.body);
    await AdminCoursesService.reorder(ids);
    res.json({ message: 'Ordre mis à jour' });
  }
  static async delete(req: Request, res: Response) {
    await AdminCoursesService.delete(req.params.id);
    res.json({ message: 'Formation supprimée' });
  }
}

// ─── Songs ────────────────────────────────────────────────────────────────────

export class AdminSongsController {
  static async list(req: Request, res: Response) {
    res.json(await AdminSongsService.list(req.query as any));
  }
  static async create(req: Request, res: Response) {
    const data = createSongSchema.parse(req.body);
    res.status(201).json(await AdminSongsService.create(data));
  }
  static async update(req: Request, res: Response) {
    const data = updateSongSchema.parse(req.body);
    res.json(await AdminSongsService.update(req.params.id, data));
  }
  static async updateStatus(req: Request, res: Response) {
    const { status } = updateStatusSchema.parse(req.body);
    res.json(await AdminSongsService.updateStatus(req.params.id, status));
  }
  static async delete(req: Request, res: Response) {
    await AdminSongsService.delete(req.params.id);
    res.json({ message: 'Chanson supprimée' });
  }
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export class AdminChallengesController {
  static async list(req: Request, res: Response) {
    res.json(await AdminChallengesService.list(req.query as any));
  }
  static async get(req: Request, res: Response) {
    res.json(await AdminChallengesService.get(req.params.id));
  }
  static async create(req: Request, res: Response) {
    const data = createChallengeSchema.parse(req.body);
    res.status(201).json(await AdminChallengesService.create(data));
  }
  static async update(req: Request, res: Response) {
    const data = updateChallengeSchema.parse(req.body);
    res.json(await AdminChallengesService.update(req.params.id, data));
  }
  static async updateStatus(req: Request, res: Response) {
    const { status } = updateStatusSchema.parse(req.body);
    res.json(await AdminChallengesService.updateStatus(req.params.id, status));
  }
  static async reorder(req: Request, res: Response) {
    const { ids } = reorderSchema.parse(req.body);
    await AdminChallengesService.reorder(ids);
    res.json({ message: 'Ordre mis à jour' });
  }
  static async delete(req: Request, res: Response) {
    await AdminChallengesService.delete(req.params.id);
    res.json({ message: 'Défi supprimé' });
  }
}

// ─── Moderation ───────────────────────────────────────────────────────────────

export class AdminConfessionsController {
  static async list(req: Request, res: Response) {
    res.json(await AdminConfessionsService.list(req.query as any));
  }
  static async approve(req: Request, res: Response) {
    res.json(await AdminConfessionsService.approve(req.params.id, moderatorId(req)));
  }
  static async flag(req: Request, res: Response) {
    res.json(await AdminConfessionsService.flag(req.params.id, moderatorId(req)));
  }
  static async delete(req: Request, res: Response) {
    await AdminConfessionsService.delete(req.params.id, moderatorId(req));
    res.json({ message: 'Confession supprimée' });
  }
}

export class AdminReportsController {
  static async list(req: Request, res: Response) {
    res.json(await AdminReportsService.list(req.query as any));
  }
  static async get(req: Request, res: Response) {
    res.json(await AdminReportsService.get(req.params.id));
  }
  static async resolve(req: Request, res: Response) {
    const dto = resolveReportSchema.parse(req.body);
    await AdminReportsService.resolve(req.params.id, dto, moderatorId(req));
    res.json({ message: 'Signalement résolu' });
  }
  static async dismiss(req: Request, res: Response) {
    await AdminReportsService.dismiss(req.params.id, moderatorId(req));
    res.json({ message: 'Signalement rejeté' });
  }
}

export class AdminCrisisController {
  static async list(req: Request, res: Response) {
    res.json(await AdminCrisisService.list(req.query as any));
  }
  static async review(req: Request, res: Response) {
    await AdminCrisisService.review(req.params.id, moderatorId(req));
    res.json({ message: 'Crise marquée comme examinée' });
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export class AdminAnalyticsController {
  static async stats(req: Request, res: Response) {
    res.json(await AdminAnalyticsService.dashboardStats());
  }
  static async userGrowth(req: Request, res: Response) {
    const period = (req.query.period as string) ?? '30d';
    res.json(await AdminAnalyticsService.userGrowth(period));
  }
  static async engagement(req: Request, res: Response) {
    res.json(await AdminAnalyticsService.engagementByModule());
  }
  static async topContent(req: Request, res: Response) {
    const type = (req.query.type as string) ?? 'books';
    res.json(await AdminAnalyticsService.topContent(type));
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────

export class AdminConfigController {
  static async listConfigs(req: Request, res: Response) {
    res.json(await AdminConfigService.listConfigs());
  }
  static async updateConfig(req: Request, res: Response) {
    const { value, isPublic } = updateConfigSchema.parse(req.body);
    res.json(await AdminConfigService.upsertConfig(req.params.key, value, isPublic, moderatorId(req)));
  }
  static async listFlags(req: Request, res: Response) {
    res.json(await AdminConfigService.listFlags());
  }
  static async updateFlag(req: Request, res: Response) {
    const dto = updateFeatureFlagSchema.parse(req.body);
    res.json(await AdminConfigService.upsertFlag(req.params.key, dto.isEnabled, dto.rolloutPct));
  }
  static async getDailyVerses(req: Request, res: Response) {
    res.json(await AdminConfigService.getDailyVerses());
  }
  static async addDailyVerse(req: Request, res: Response) {
    const { reference, text, language, scheduledDate } = upsertVerseSchema.parse(req.body);
    res.status(201).json(await AdminConfigService.addDailyVerse(reference, text, language, scheduledDate));
  }
  static async removeDailyVerse(req: Request, res: Response) {
    await AdminConfigService.removeDailyVerse(req.params.key);
    res.json({ message: 'Verset supprimé' });
  }
  static async broadcast(req: Request, res: Response) {
    const dto = broadcastNotificationSchema.parse(req.body);
    // Hook into push notification service here (FCM, etc.)
    // For now, log and return success
    console.log('[Admin] Broadcast notification:', dto);
    res.json({ message: `Notification envoyée à "${dto.target}"`, ...dto });
  }
}

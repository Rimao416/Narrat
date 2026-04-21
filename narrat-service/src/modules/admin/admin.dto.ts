import { z } from 'zod';

export const banUserSchema = z.object({
  reason: z.string().min(5, 'La raison doit faire au moins 5 caractères'),
});

export const changeRoleSchema = z.object({
  role: z.enum(['USER', 'MODERATOR', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
});

export const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', 'REJECTED']),
});

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export const createBookSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  coverUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  category: z.string(),
  authorId: z.string(),
  language: z.enum(['FR', 'EN', 'LN', 'SW']).default('FR'),
  isFeatured: z.boolean().default(false),
  totalPages: z.number().int().positive().optional(),
});

export const updateBookSchema = createBookSchema.partial();

export const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  coverUrl: z.string().url().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  language: z.enum(['FR', 'EN', 'LN', 'SW']).default('FR'),
  isFeatured: z.boolean().default(false),
  passingScore: z.number().int().min(0).max(100).default(70),
  estimatedHours: z.number().positive().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
  intensity: z.enum(['LIGHT', 'MODERATE', 'INTENSE']),
  durationDays: z.number().int().min(1).max(365),
  coverUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
  language: z.enum(['FR', 'EN', 'LN', 'SW']).default('FR'),
});

export const updateChallengeSchema = createChallengeSchema.partial();

export const createSongSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  albumArt: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  style: z.string(),
  language: z.enum(['FR', 'EN', 'LN', 'SW']).default('FR'),
  lyrics: z.string().optional(),
  spiritualContext: z.string().optional(),
});

export const updateSongSchema = createSongSchema.partial();

export const resolveReportSchema = z.object({
  action: z.enum(['WARN_USER', 'BAN_USER', 'DELETE_CONTENT', 'NO_ACTION']),
  notes: z.string().optional(),
});

export const broadcastNotificationSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  target: z.enum(['all', 'active', 'new']).default('all'),
});

export const upsertVerseSchema = z.object({
  reference: z.string().min(1),
  text: z.string().min(1),
  language: z.enum(['FR', 'EN', 'LN', 'SW']).default('FR'),
  scheduledDate: z.string().optional(),
});

export const updateFeatureFlagSchema = z.object({
  isEnabled: z.boolean().optional(),
  rolloutPct: z.number().int().min(0).max(100).optional(),
});

export const updateConfigSchema = z.object({
  value: z.any(),
  isPublic: z.boolean().optional(),
});

export type BanUserDto = z.infer<typeof banUserSchema>;
export type ChangeRoleDto = z.infer<typeof changeRoleSchema>;
export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;
export type ReorderDto = z.infer<typeof reorderSchema>;
export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
export type CreateCourseDto = z.infer<typeof createCourseSchema>;
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>;
export type CreateChallengeDto = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeDto = z.infer<typeof updateChallengeSchema>;
export type CreateSongDto = z.infer<typeof createSongSchema>;
export type UpdateSongDto = z.infer<typeof updateSongSchema>;
export type ResolveReportDto = z.infer<typeof resolveReportSchema>;
export type BroadcastNotificationDto = z.infer<typeof broadcastNotificationSchema>;

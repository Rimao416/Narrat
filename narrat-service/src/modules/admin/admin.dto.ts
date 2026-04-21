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
  subtitle: z.string().optional(),
  description: z.string().min(1),
  objectives: z.array(z.string()).default([]),
  teacherName: z.string().optional(),
  teacherBio: z.string().optional(),
  coverUrl: z.string().url().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  language: z.enum(['FR', 'EN', 'LN', 'SW']).default('FR'),
  hasCertificate: z.boolean().default(true),
  hasAudio: z.boolean().default(false),
  hasVideo: z.boolean().default(false),
  passingScore: z.number().int().min(0).max(100).default(70),
  estimatedHours: z.number().positive().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

// ─── Course Modules ───────────────────────────────────────────────────────────

export const createModuleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  audioUrl: z.string().url().optional().or(z.literal('')),
  audioDuration: z.number().int().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  videoDuration: z.number().int().optional(),
  readTime: z.number().int().optional(),
  verseRefs: z.array(z.string()).default([]),
  quotes: z.array(z.object({ text: z.string(), author: z.string() })).default([]),
  isLocked: z.boolean().default(true),
});

export const updateModuleSchema = createModuleSchema.partial();

export const reorderModulesSchema = z.object({
  moduleIds: z.array(z.string()).min(1),
});

// ─── Course Quiz ──────────────────────────────────────────────────────────────

export const createQuizSchema = z.object({
  passingScore: z.number().int().min(0).max(100).default(70),
  maxAttempts: z.number().int().min(0).default(0),
  shuffleQuestions: z.boolean().default(true),
});

export const updateQuizSchema = createQuizSchema.partial();

export const createQuizQuestionSchema = z.object({
  type: z.enum(['MCQ', 'TRUE_FALSE', 'MATCHING', 'FILL_BLANK']),
  question: z.string().min(1),
  explanation: z.string().optional(),
  verseRef: z.string().optional(),
  sortOrder: z.number().int().default(0),
  answers: z.array(z.object({
    text: z.string().min(1),
    isCorrect: z.boolean().default(false),
  })).min(1),
});

export const updateQuizQuestionSchema = createQuizQuestionSchema.partial();

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
export type CreateModuleDto = z.infer<typeof createModuleSchema>;
export type UpdateModuleDto = z.infer<typeof updateModuleSchema>;
export type ReorderModulesDto = z.infer<typeof reorderModulesSchema>;
export type CreateQuizDto = z.infer<typeof createQuizSchema>;
export type UpdateQuizDto = z.infer<typeof updateQuizSchema>;
export type CreateQuizQuestionDto = z.infer<typeof createQuizQuestionSchema>;
export type UpdateQuizQuestionDto = z.infer<typeof updateQuizQuestionSchema>;
export type CreateChallengeDto = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeDto = z.infer<typeof updateChallengeSchema>;
export type CreateSongDto = z.infer<typeof createSongSchema>;
export type UpdateSongDto = z.infer<typeof updateSongSchema>;
export type ResolveReportDto = z.infer<typeof resolveReportSchema>;
export type BroadcastNotificationDto = z.infer<typeof broadcastNotificationSchema>;

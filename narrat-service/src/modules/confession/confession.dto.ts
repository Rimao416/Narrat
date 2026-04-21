import { z } from 'zod';

export const createConfessionSchema = z.object({
  type: z.enum(['CONFESSION', 'TESTIMONY', 'PRAYER_REQUEST', 'SPIRITUAL_QUESTION', 'ENCOURAGEMENT']),
  visibility: z.enum(['PUBLIC', 'THEMATIC_GROUP', 'PRIVATE_GROUP', 'ANONYMOUS_PUBLIC']).default('PUBLIC'),
  content: z.string().min(10).max(1500),
  isAnonymous: z.boolean().default(false),
  groupId: z.string().optional(),
  verseRef: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const createReplySchema = z.object({
  content: z.string().min(1).max(500),
  isAnonymous: z.boolean().default(false),
  verseRef: z.string().optional(),
});

export type CreateConfessionDto = z.infer<typeof createConfessionSchema>;
export type CreateReplyDto = z.infer<typeof createReplySchema>;

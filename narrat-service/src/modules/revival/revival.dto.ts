import { z } from 'zod';

export const createRevivalStorySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  era: z.enum(['NINETEENTH_CENTURY', 'EARLY_TWENTIETH', 'MID_TWENTIETH', 'CONTEMPORARY']),
  region: z.enum(['AFRICA', 'AMERICAS', 'EUROPE', 'ASIA', 'WORLDWIDE']),
  language: z.enum(['FR', 'EN', 'LN', 'SW']).default('FR'),
  audioUrl: z.string().url().optional(),
});

export type CreateRevivalStoryDto = z.infer<typeof createRevivalStorySchema>;

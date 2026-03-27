import { z } from 'zod';

export const createJournalEntrySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(['PERSONAL', 'FAMILY', 'WORK', 'HEALTH', 'NATION', 'CHURCH', 'OTHER']).default('PERSONAL'),
  verseRef: z.string().optional(),
});

export const createPrayerRequestSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(1000),
  isAnonymous: z.boolean().default(false),
  category: z.enum(['PERSONAL', 'FAMILY', 'WORK', 'HEALTH', 'NATION', 'CHURCH', 'OTHER']).default('PERSONAL'),
});

export type CreateJournalEntryDto = z.infer<typeof createJournalEntrySchema>;
export type CreatePrayerRequestDto = z.infer<typeof createPrayerRequestSchema>;

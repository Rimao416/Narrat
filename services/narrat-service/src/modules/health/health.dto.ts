import { z } from 'zod';

export const submitBilanSchema = z.object({
  wordScore: z.number().min(0).max(10),
  prayerScore: z.number().min(0).max(10),
  communityScore: z.number().min(0).max(10),
  integrityScore: z.number().min(0).max(10),
  generosityScore: z.number().min(0).max(10),
  growthScore: z.number().min(0).max(10),
  notes: z.string().optional(),
});

export type SubmitBilanDto = z.infer<typeof submitBilanSchema>;

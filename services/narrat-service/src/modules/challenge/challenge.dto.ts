import { z } from 'zod';

export const joinChallengeSchema = z.object({
  challengeId: z.string(),
  partnerId: z.string().optional(),
});

export const dailyCheckInSchema = z.object({
  challengeId: z.string(),
  userChallengeId: z.string(),
  notes: z.string().optional(),
  moodScore: z.number().min(1).max(5).optional(),
});

export type JoinChallengeDto = z.infer<typeof joinChallengeSchema>;
export type DailyCheckInDto = z.infer<typeof dailyCheckInSchema>;

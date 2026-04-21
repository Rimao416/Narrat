import { z } from 'zod';

export const updateNotificationSettingsSchema = z.object({
  dailyVerse: z.boolean().optional(),
  morningThought: z.boolean().optional(),
  prayerReminder: z.boolean().optional(),
  prayerReminderTime: z.string().optional(),
  actionCall: z.boolean().optional(),
  communityReply: z.boolean().optional(),
  challengeReminder: z.boolean().optional(),
  quizChallenge: z.boolean().optional(),
});

export type UpdateNotificationSettingsDto = z.infer<typeof updateNotificationSettingsSchema>;

import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  context: z.enum(['THEOLOGY', 'PRAYER', 'BIBLE', 'PERSONAL_CRISIS', 'GENERAL']).default('GENERAL'),
});

export type ChatMessageDto = z.infer<typeof chatMessageSchema>;

import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['NEVER_HEARD', 'REFLECTING', 'BELIEVER', 'GROWING']).default('NEVER_HEARD'),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(['NEVER_HEARD', 'REFLECTING', 'BELIEVER', 'GROWING']),
});

export type CreateContactDto = z.infer<typeof createContactSchema>;
export type UpdateContactStatusDto = z.infer<typeof updateContactStatusSchema>;

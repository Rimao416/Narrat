import { z } from 'zod';

export const createFamilyGroupSchema = z.object({
  name: z.string().min(1).max(100),
});

export const addMemberSchema = z.object({
  userId: z.string(),
});

export type CreateFamilyGroupDto = z.infer<typeof createFamilyGroupSchema>;
export type AddMemberDto = z.infer<typeof addMemberSchema>;

import { z } from 'zod';

export const addFavoriteSchema = z.object({
  songId: z.string(),
});

export const createPlaylistSchema = z.object({
  name: z.string().min(1).max(100),
  songIds: z.array(z.string()).default([]),
});

export type AddFavoriteDto = z.infer<typeof addFavoriteSchema>;
export type CreatePlaylistDto = z.infer<typeof createPlaylistSchema>;

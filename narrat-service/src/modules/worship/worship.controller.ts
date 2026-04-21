import { Request, Response } from 'express';
import { WorshipService } from './worship.service';
import { addFavoriteSchema, createPlaylistSchema } from './worship.dto';

export class WorshipController {
  static async getSongs(req: Request, res: Response) {
    const songs = await WorshipService.getSongs(req.query.style as string, req.query.language as string);
    res.status(200).json(songs);
  }

  static async getSongById(req: Request, res: Response) {
    const song = await WorshipService.getSongById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.status(200).json(song);
  }

  static async getFavorites(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const favorites = await WorshipService.getFavorites(userId);
    res.status(200).json(favorites);
  }

  static async addFavorite(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = addFavoriteSchema.parse(req.body);
    const fav = await WorshipService.addFavorite(userId, data);
    res.status(201).json(fav);
  }

  static async removeFavorite(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await WorshipService.removeFavorite(userId, req.params.songId);
    res.status(204).send();
  }

  static async getPlaylists(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const playlists = await WorshipService.getPlaylists(userId);
    res.status(200).json(playlists);
  }

  static async createPlaylist(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = createPlaylistSchema.parse(req.body);
    const playlist = await WorshipService.createPlaylist(userId, data);
    res.status(201).json(playlist);
  }
}

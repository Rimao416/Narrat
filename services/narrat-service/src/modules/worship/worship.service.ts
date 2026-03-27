import prisma from '../../config/database';
import { AddFavoriteDto, CreatePlaylistDto } from './worship.dto';

export class WorshipService {
  static async getSongs(style?: string, language?: string) {
    return prisma.song.findMany({
      where: {
        ...(style ? { style: style as any } : {}),
        ...(language ? { language: language as any } : {}),
      },
      orderBy: { title: 'asc' },
    });
  }

  static async getSongById(id: string) {
    return prisma.song.findUnique({ where: { id } });
  }

  static async getFavorites(userId: string) {
    return prisma.songFavorite.findMany({
      where: { userId },
      include: { song: true },
    });
  }

  static async addFavorite(userId: string, data: AddFavoriteDto) {
    return prisma.songFavorite.upsert({
      where: { userId_songId: { userId, songId: data.songId } },
      update: {},
      create: { userId, songId: data.songId },
    });
  }

  static async removeFavorite(userId: string, songId: string) {
    return prisma.songFavorite.delete({
      where: { userId_songId: { userId, songId } },
    });
  }

  static async getPlaylists(userId: string) {
    return prisma.playlist.findMany({
      where: { userId },
      include: { items: { include: { song: true } } },
    });
  }

  static async createPlaylist(userId: string, data: CreatePlaylistDto) {
    return prisma.playlist.create({
      data: {
        userId,
        name: data.name,
        items: {
          create: data.songIds.map((songId, index) => ({ songId, sortOrder: index })),
        },
      },
    });
  }
}

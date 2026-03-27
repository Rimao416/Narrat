import prisma from '../../config/database';
import { CreateConfessionDto, CreateReplyDto } from './confession.dto';

export class ConfessionService {
  static async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return prisma.confession.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        replies: { take: 3, orderBy: { createdAt: 'desc' } },
        _count: { select: { replies: true } },
      },
    });
  }

  static async getById(id: string) {
    return prisma.confession.findUnique({
      where: { id },
      include: {
        replies: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  static async create(userId: string, data: CreateConfessionDto) {
    return prisma.confession.create({
      data: {
        userId,
        type: data.type,
        visibility: data.visibility,
        content: data.content,
        isAnonymous: data.isAnonymous,
        groupId: data.groupId,
        verseRef: data.verseRef,
        tags: data.tags,
      },
    });
  }

  static async addReply(confessionId: string, userId: string, data: CreateReplyDto) {
    return prisma.confessionReply.create({
      data: {
        confessionId,
        userId,
        content: data.content,
        isAnonymous: data.isAnonymous,
        verseRef: data.verseRef,
      },
    });
  }

  static async pray(confessionId: string, userId: string) {
    const existing = await prisma.prayerCount.findUnique({
      where: { userId_confessionId: { userId, confessionId } },
    });
    if (existing) return existing;
    const count = await prisma.prayerCount.create({
      data: { userId, confessionId },
    });
    await prisma.confession.update({
      where: { id: confessionId },
      data: { prayerCount: { increment: 1 } },
    });
    return count;
  }

  static async delete(id: string, userId: string) {
    return prisma.confession.update({
      where: { id, userId },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}

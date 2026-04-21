import prisma from '../../config/database';
import { CreateJournalEntryDto, CreatePrayerRequestDto } from './prayer.dto';

export class PrayerService {
  static async getJournal(userId: string) {
    return prisma.prayerJournalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async addJournalEntry(userId: string, data: CreateJournalEntryDto) {
    return prisma.prayerJournalEntry.create({
      data: { userId, ...data } as any,
    });
  }

  static async updateJournalEntry(id: string, userId: string, data: Partial<CreateJournalEntryDto>) {
    return prisma.prayerJournalEntry.update({
      where: { id } as any,
      data: data as any,
    });
  }

  static async getPrayerRequests(page = 1, limit = 20) {
    return prisma.prayerRequest.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { intercessions: true } } },
    });
  }

  static async createPrayerRequest(userId: string, data: CreatePrayerRequestDto) {
    return prisma.prayerRequest.create({
      data: { userId, ...data },
    });
  }

  static async prayForRequest(prayerRequestId: string, userId: string) {
    return prisma.intercessionPrayer.upsert({
      where: { userId_prayerRequestId: { userId, prayerRequestId } },
      update: {},
      create: { userId, prayerRequestId },
    });
  }

  static async markAnswered(id: string, userId: string) {
    return prisma.prayerRequest.update({
      where: { id, userId },
      data: { status: 'ANSWERED', answeredAt: new Date() },
    });
  }
}

import prisma from '../../config/database';
import { SubmitBilanDto } from './health.dto';

export class HealthService {
  static async getBilanHistory(userId: string) {
    return prisma.spiritualHealthLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });
  }

  static async submitBilan(userId: string, data: SubmitBilanDto) {
    const globalScore = (
      data.wordScore + data.prayerScore + data.communityScore +
      data.integrityScore + data.generosityScore + data.growthScore
    ) / 6;

    return prisma.spiritualHealthLog.create({
      data: {
        userId,
        wordScore: data.wordScore,
        prayerScore: data.prayerScore,
        communityScore: data.communityScore,
        integrityScore: data.integrityScore,
        generosityScore: data.generosityScore,
        growthScore: data.growthScore,
        globalScore,
        notes: data.notes,
      },
    });
  }

  static async getGrowthPlans(userId: string) {
    return prisma.growthPlan.findMany({
      where: { userId, isActive: true },
      include: { steps: true },
    });
  }

  static async getLatestBilan(userId: string) {
    return prisma.spiritualHealthLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

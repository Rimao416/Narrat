import prisma from '../../config/database';
import { SubmitBilanDto } from './health.dto';

export class HealthService {
  static async getBilanHistory(userId: string) {
    return prisma.spiritualHealthLog.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
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
        ...data,
      } as any,
    });
  }

  static async getGrowthPlans(userId: string) {
    return prisma.growthPlan.findMany({
      where: { userId, isActive: true } as any,
    });
  }

  static async getLatestBilan(userId: string) {
    return prisma.spiritualHealthLog.findFirst({
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }
}

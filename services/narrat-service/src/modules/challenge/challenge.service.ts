import prisma from '../../config/database';
import { JoinChallengeDto, DailyCheckInDto } from './challenge.dto';

export class ChallengeService {
  static async getAll(category?: string) {
    return prisma.challenge.findMany({
      where: category ? { category: category as any } : {},
    });
  }

  static async getById(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
      include: { days: true },
    });
  }

  static async join(userId: string, data: JoinChallengeDto) {
    return prisma.userChallenge.create({
      data: {
        userId,
        challengeId: data.challengeId,
        status: 'ACTIVE',
        startedAt: new Date(),
      },
    });
  }

  static async getMyChallenges(userId: string) {
    return prisma.userChallenge.findMany({
      where: { userId },
      include: { challenge: true, checkIns: { orderBy: { createdAt: 'desc' }, take: 7 } },
    });
  }

  static async checkIn(userId: string, data: DailyCheckInDto) {
    return prisma.dailyCheckIn.create({
      data: {
        userId,
        userChallengeId: data.userChallengeId,
        notes: data.notes,
        moodScore: data.moodScore,
      },
    });
  }

  static async abandon(userChallengeId: string, userId: string) {
    return prisma.userChallenge.update({
      where: { id: userChallengeId, userId },
      data: { status: 'ABANDONED' },
    });
  }
}

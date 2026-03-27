import prisma from '../../config/database';

export class RevivalService {
  static async getFigures(era?: string, region?: string) {
    return prisma.revivalFigure.findMany({
      where: {
        ...(era ? { era: era as any } : {}),
        ...(region ? { region: region as any } : {}),
      },
      include: { author: true, testimonies: { take: 3 } },
    });
  }

  static async getFigureById(id: string) {
    return prisma.revivalFigure.findUnique({
      where: { id },
      include: { author: true, testimonies: true, revivals: true },
    });
  }

  static async getTestimonies(page = 1, limit = 20) {
    return prisma.modernTestimony.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  static async getHistoricalRevivals(era?: string) {
    return prisma.historicalRevival.findMany({
      where: era ? { era: era as any } : {},
      include: { figures: { include: { figure: true } } },
    });
  }
}

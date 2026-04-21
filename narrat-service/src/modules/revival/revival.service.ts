import prisma from '../../config/database';

export class RevivalService {
  static async getFigures(era?: string, region?: string) {
    return prisma.revivalFigure.findMany({
      where: {
        ...(era ? { era: era as any } : {}),
        ...(region ? { region: region as any } : {}),
      } as any,
      include: { author: true },
    });
  }

  static async getFigureById(id: string) {
    return prisma.revivalFigure.findUnique({
      where: { id },
      include: { author: true, revivals: true },
    });
  }

  static async getTestimonies(page = 1, limit = 20) {
    return prisma.contemporaryTestimony.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  static async getHistoricalRevivals(era?: string) {
    return prisma.revival.findMany({
      where: era ? { era: era as any } : {},
      include: { figures: { include: { figure: true } } },
    });
  }
}

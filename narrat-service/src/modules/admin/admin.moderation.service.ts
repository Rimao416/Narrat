import prisma from '../../config/database';
import { paginate, paginatedResponse } from '../../shared/utils/pagination';
import type { ResolveReportDto } from './admin.dto';

export class AdminConfessionsService {
  static async list(params: {
    page?: number;
    pageSize?: number;
    hasCrisisFlag?: string;
    isActive?: string;
    type?: string;
  }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.hasCrisisFlag !== undefined) where.hasCrisisFlag = params.hasCrisisFlag === 'true';
    if (params.isActive !== undefined) where.isActive = params.isActive === 'true';
    if (params.type) where.type = params.type;

    const [data, total] = await Promise.all([
      prisma.confession.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      }),
      prisma.confession.count({ where }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async approve(id: string, moderatorId: string) {
    const confession = await prisma.confession.update({
      where: { id },
      data: { isActive: true, hasCrisisFlag: false },
    });
    await prisma.moderationLog.create({
      data: { moderatorId, confessionId: id, action: 'APPROVED', reason: 'Confession approuvée' },
    }).catch(() => {});
    return confession;
  }

  static async flag(id: string, moderatorId: string) {
    const confession = await prisma.confession.update({
      where: { id },
      data: { hasCrisisFlag: true },
    });
    await prisma.moderationLog.create({
      data: { moderatorId, confessionId: id, action: 'WARNING_SENT', reason: 'Confession signalée pour crise' },
    }).catch(() => {});
    return confession;
  }

  static async delete(id: string, moderatorId: string) {
    await prisma.moderationLog.create({
      data: { moderatorId, confessionId: id, action: 'REJECTED', reason: 'Confession supprimée par modérateur' },
    }).catch(() => {});
    await prisma.confession.delete({ where: { id } });
  }
}

export class AdminReportsService {
  static async list(params: { page?: number; pageSize?: number; status?: string }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.status === 'PENDING') where.isResolved = false;
    else if (params.status === 'RESOLVED') where.isResolved = true;
    else if (params.status === 'CRISIS') where.isCrisis = true;

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          submitter: { select: { id: true, firstName: true, lastName: true } },
          reportedUser: { select: { id: true, firstName: true, lastName: true } },
          confession: { select: { id: true, content: true, type: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async get(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        submitter: { select: { id: true, firstName: true, lastName: true, email: true } },
        reportedUser: { select: { id: true, firstName: true, lastName: true, email: true } },
        confession: true,
      },
    });
    if (!report) throw new Error('Signalement introuvable');
    return report;
  }

  static async resolve(id: string, dto: ResolveReportDto, moderatorId: string) {
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw new Error('Signalement introuvable');

    await prisma.report.update({ where: { id }, data: { isResolved: true } });

    if (dto.action === 'BAN_USER' && report.reportedUserId) {
      await prisma.user.update({
        where: { id: report.reportedUserId },
        data: { isBanned: true, bannedAt: new Date(), bannedReason: dto.notes ?? 'Banni suite à signalement' },
      });
    }
    if (dto.action === 'DELETE_CONTENT' && report.confessionId) {
      await prisma.confession.delete({ where: { id: report.confessionId } }).catch(() => {});
    }

    await prisma.moderationLog.create({
      data: { moderatorId, reportId: id, action: 'APPROVED', reason: dto.notes ?? dto.action },
    }).catch(() => {});
  }

  static async dismiss(id: string, moderatorId: string) {
    await prisma.report.update({ where: { id }, data: { isResolved: true } });
    await prisma.moderationLog.create({
      data: { moderatorId, reportId: id, action: 'REJECTED', reason: 'Signalement rejeté' },
    }).catch(() => {});
  }
}

export class AdminCrisisService {
  static async list(params: { page?: number; pageSize?: number }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const [data, total] = await Promise.all([
      prisma.aIConversation.findMany({
        where: { hasCrisisFlag: true },
        skip, take,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 3 },
        },
      }),
      prisma.aIConversation.count({ where: { hasCrisisFlag: true } }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async review(id: string, moderatorId: string) {
    await prisma.aIConversation.update({ where: { id }, data: { hasCrisisFlag: false } });
    await prisma.moderationLog.create({
      data: { moderatorId, action: 'APPROVED', reason: 'Conversation de crise examinée et résolue' },
    }).catch(() => {});
  }
}

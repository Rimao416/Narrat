import prisma from '../../config/database';
import { paginate, paginatedResponse } from '../../shared/utils/pagination';
import type { ResolveReportDto } from './admin.dto';

export class AdminConfessionsService {
  static async list(params: {
    page?: number;
    pageSize?: number;
    isFlagged?: string;
    isApproved?: string;
    type?: string;
  }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.isFlagged !== undefined) where.isFlagged = params.isFlagged === 'true';
    if (params.isApproved !== undefined) where.isApproved = params.isApproved === 'true';
    if (params.type) where.type = params.type;

    const [data, total] = await Promise.all([
      prisma.confession.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
        },
      }),
      prisma.confession.count({ where }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async approve(id: string, moderatorId: string) {
    const confession = await prisma.confession.update({
      where: { id },
      data: { isApproved: true, isFlagged: false },
    });
    await prisma.moderationLog.create({
      data: { moderatorId, action: 'APPROVE', targetType: 'CONFESSION', targetId: id } as any,
    }).catch(() => {});
    return confession;
  }

  static async flag(id: string, moderatorId: string) {
    const confession = await prisma.confession.update({
      where: { id },
      data: { isFlagged: true, isApproved: false },
    });
    await prisma.moderationLog.create({
      data: { moderatorId, action: 'FLAG', targetType: 'CONFESSION', targetId: id } as any,
    }).catch(() => {});
    return confession;
  }

  static async delete(id: string, moderatorId: string) {
    await prisma.confession.delete({ where: { id } });
    await prisma.moderationLog.create({
      data: { moderatorId, action: 'DELETE', targetType: 'CONFESSION', targetId: id } as any,
    }).catch(() => {});
  }
}

export class AdminReportsService {
  static async list(params: { page?: number; pageSize?: number; status?: string }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where, skip, take,
        orderBy: { reportedAt: 'desc' },
        include: {
          reporter: { select: { id: true, firstName: true, lastName: true } },
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
        reporter: { select: { id: true, firstName: true, lastName: true, email: true } },
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

    await prisma.report.update({
      where: { id },
      data: { status: 'RESOLVED' } as any,
    });

    if (dto.action === 'BAN_USER' && report.reportedUserId) {
      await prisma.user.update({
        where: { id: report.reportedUserId },
        data: { isBanned: true },
      });
    }
    if (dto.action === 'DELETE_CONTENT' && report.confessionId) {
      await prisma.confession.delete({ where: { id: report.confessionId } }).catch(() => {});
    }

    await prisma.moderationLog.create({
      data: {
        moderatorId,
        action: `REPORT_RESOLVED:${dto.action}`,
        targetType: 'REPORT',
        targetId: id,
        reason: dto.notes ?? dto.action,
      } as any,
    }).catch(() => {});
  }

  static async dismiss(id: string, moderatorId: string) {
    await prisma.report.update({ where: { id }, data: { status: 'DISMISSED' } as any });
    await prisma.moderationLog.create({
      data: { moderatorId, action: 'REPORT_DISMISSED', targetType: 'REPORT', targetId: id } as any,
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
          user: { select: { id: true, firstName: true, lastName: true, email: true, profilePicture: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 3 },
        },
      }),
      prisma.aIConversation.count({ where: { hasCrisisFlag: true } }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async review(id: string, moderatorId: string) {
    await prisma.aIConversation.update({
      where: { id },
      data: { hasCrisisFlag: false } as any,
    });
    await prisma.moderationLog.create({
      data: { moderatorId, action: 'CRISIS_REVIEWED', targetType: 'AI_CONVERSATION', targetId: id } as any,
    }).catch(() => {});
  }
}

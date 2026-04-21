import prisma from '../../config/database';
import { paginate, paginatedResponse } from '../../shared/utils/pagination';

export class AdminUsersService {
  static async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    isBanned?: string;
  }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.role) where.role = params.role;
    if (params.isBanned !== undefined) where.isBanned = params.isBanned === 'true';

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, spiritualLevel: true, xpTotal: true,
          isActive: true, isBanned: true, language: true,
          avatarUrl: true, createdAt: true, updatedAt: true,
          _count: { select: { confessions: true, prayerRequests: true, courseEnrollments: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async get(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            confessions: true,
            prayerRequests: true,
            courseEnrollments: true,
            userBadges: true,
          },
        },
      },
    });
    if (!user) throw new Error('Utilisateur introuvable');
    const { passwordHash, ...safe } = user as any;
    return safe;
  }

  static async updateRole(id: string, role: string, moderatorId: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { role: role as any },
    });
    await prisma.moderationLog.create({
      data: {
        moderatorId,
        action: 'APPROVED',
        reason: `Rôle changé en ${role}`,
      },
    }).catch(() => {});
    const { passwordHash, ...safe } = user as any;
    return safe;
  }

  static async ban(id: string, reason: string, moderatorId: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { isBanned: true, bannedAt: new Date(), bannedReason: reason },
    });
    await prisma.moderationLog.create({
      data: {
        moderatorId,
        action: 'USER_BLOCKED',
        reason,
      },
    }).catch(() => {});
    return user;
  }

  static async unban(id: string, moderatorId: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { isBanned: false, bannedAt: null, bannedReason: null },
    });
    await prisma.moderationLog.create({
      data: {
        moderatorId,
        action: 'APPROVED',
        reason: 'Débannissement admin',
      },
    }).catch(() => {});
    return user;
  }

  static async delete(id: string, requesterId: string) {
    const requester = await prisma.user.findUnique({ where: { id: requesterId } });
    if (requester?.role !== 'SUPER_ADMIN') {
      throw new Error('Seul un SUPER_ADMIN peut supprimer un utilisateur');
    }
    await prisma.user.delete({ where: { id } });
  }

  static async stats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [total, newThisWeek, activeToday, byRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { lastSeenAt: { gte: dayAgo } } }),
      prisma.user.groupBy({ by: ['role'], _count: { role: true } }),
    ]);

    return {
      total,
      newThisWeek,
      activeToday,
      byRole: Object.fromEntries(byRole.map((r) => [r.role, r._count.role])),
    };
  }
}

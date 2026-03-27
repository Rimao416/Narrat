import prisma from '../../config/database';
import { CreateFamilyGroupDto, AddMemberDto } from './family.dto';

export class FamilyService {
  static async getGroups(userId: string) {
    return prisma.communityGroup.findMany({
      where: { memberships: { some: { userId } } },
      include: { memberships: { include: { user: { select: { id: true, firstName: true, avatarUrl: true } } } } },
    });
  }

  static async createGroup(userId: string, data: CreateFamilyGroupDto) {
    return prisma.communityGroup.create({
      data: {
        name: data.name,
        createdById: userId,
        isPrivate: true,
        memberships: {
          create: { userId, role: 'ADMIN' },
        },
      },
    });
  }

  static async addMember(groupId: string, data: AddMemberDto) {
    return prisma.groupMembership.create({
      data: { groupId, userId: data.userId, role: 'MEMBER' },
    });
  }

  static async getDevotions() {
    return prisma.familyDevotion.findMany({
      orderBy: { publicationDate: 'desc' },
      take: 10,
    });
  }

  static async getDevotionById(id: string) {
    return prisma.familyDevotion.findUnique({ where: { id } });
  }

  static async getTopics(theme?: string) {
    return prisma.familyTopic.findMany({
      where: theme ? { theme: theme as any } : {},
    });
  }
}

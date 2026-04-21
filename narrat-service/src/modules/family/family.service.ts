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
        slug: data.name.toLowerCase().replace(/ /g, '-'),
        creatorId: userId,
        isPublic: false,
        memberships: {
          create: { userId, isAdmin: true },
        },
      },
    });
  }

  static async addMember(groupId: string, data: AddMemberDto) {
    return prisma.groupMembership.create({
      data: { groupId, userId: data.userId, isModerator: false },
    });
  }

  static async getDevotions() {
    return [];
  }

  static async getDevotionById(id: string) {
    return null;
  }

  static async getTopics(theme?: string) {
    return [];
  }
}

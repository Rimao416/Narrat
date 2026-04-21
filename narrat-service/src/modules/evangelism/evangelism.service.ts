import prisma from '../../config/database';
import { CreateContactDto, UpdateContactStatusDto } from './evangelism.dto';

export class EvangelismService {
  static async getContacts(userId: string) {
    return prisma.evangelismContact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createContact(userId: string, data: any) {
    return prisma.evangelismContact.create({
      data: { userId, firstName: data.name, relationship: 'Unknown', ...data },
    });
  }

  static async updateContactStatus(id: string, userId: string, data: any) {
    return prisma.evangelismContact.update({
      where: { id } as any,
      data: { status: data.status, ...(data.status === 'BELIEVER' ? { convertedAt: new Date() } : {}) } as any,
    });
  }

  static async deleteContact(id: string, userId: string) {
    return prisma.evangelismContact.delete({ where: { id, userId } });
  }

  static async getResources(language?: string) {
    return [];
  }

  static async getObjectionAnswers(query?: string) {
    return [];
  }
}

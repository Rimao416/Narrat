import prisma from '../../config/database';
import { CreateContactDto, UpdateContactStatusDto } from './evangelism.dto';

export class EvangelismService {
  static async getContacts(userId: string) {
    return prisma.evangelismContact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createContact(userId: string, data: CreateContactDto) {
    return prisma.evangelismContact.create({
      data: { userId, ...data },
    });
  }

  static async updateContactStatus(id: string, userId: string, data: UpdateContactStatusDto) {
    return prisma.evangelismContact.update({
      where: { id, userId },
      data: { status: data.status, ...(data.status === 'BELIEVER' ? { convertedAt: new Date() } : {}) },
    });
  }

  static async deleteContact(id: string, userId: string) {
    return prisma.evangelismContact.delete({ where: { id, userId } });
  }

  static async getResources(language?: string) {
    return prisma.evangelismResource.findMany({
      where: language ? { language: language as any } : {},
    });
  }

  static async getObjectionAnswers(query?: string) {
    return prisma.evangelismObjection.findMany({
      where: query ? { objection: { contains: query, mode: 'insensitive' } } : {},
      take: 10,
    });
  }
}

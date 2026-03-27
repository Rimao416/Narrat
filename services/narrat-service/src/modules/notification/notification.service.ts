import prisma from '../../config/database';
import { UpdateNotificationSettingsDto } from './notification.dto';

export class NotificationService {
  static async getDailyVerse() {
    const verses = await prisma.savedVerse.findMany({ take: 1 });
    return verses[0] ?? { reference: 'Jean 3:16', content: 'Car Dieu a tant aimé le monde...' };
  }

  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  static async getSettings(userId: string) {
    return prisma.notificationSetting.findMany({ where: { userId } });
  }

  static async updateSettings(userId: string, data: UpdateNotificationSettingsDto) {
    const updates = Object.entries(data).map(([type, enabled]) =>
      prisma.notificationSetting.upsert({
        where: { userId_type: { userId, type: type.toUpperCase() as any } },
        update: { isEnabled: enabled as boolean },
        create: { userId, type: type.toUpperCase() as any, isEnabled: enabled as boolean },
      })
    );
    return Promise.all(updates);
  }
}

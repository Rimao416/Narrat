import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { updateNotificationSettingsSchema } from './notification.dto';

export class NotificationController {
  static async getDailyVerse(req: Request, res: Response) {
    const verse = await NotificationService.getDailyVerse();
    res.status(200).json(verse);
  }

  static async getNotifications(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const notifications = await NotificationService.getNotifications(userId);
    res.status(200).json(notifications);
  }

  static async markAsRead(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await NotificationService.markAsRead(req.params.id, userId);
    res.status(200).json({ success: true });
  }

  static async markAllAsRead(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await NotificationService.markAllAsRead(userId);
    res.status(200).json({ success: true });
  }

  static async getSettings(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const settings = await NotificationService.getSettings(userId);
    res.status(200).json(settings);
  }

  static async updateSettings(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = updateNotificationSettingsSchema.parse(req.body);
    const result = await NotificationService.updateSettings(userId, data);
    res.status(200).json(result);
  }
}

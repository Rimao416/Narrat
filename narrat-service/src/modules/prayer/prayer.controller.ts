import { Request, Response } from 'express';
import { PrayerService } from './prayer.service';
import { createJournalEntrySchema, createPrayerRequestSchema } from './prayer.dto';

export class PrayerController {
  static async getJournal(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const entries = await PrayerService.getJournal(userId);
    res.status(200).json(entries);
  }

  static async addJournalEntry(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = createJournalEntrySchema.parse(req.body);
    const entry = await PrayerService.addJournalEntry(userId, data);
    res.status(201).json(entry);
  }

  static async updateJournalEntry(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const entry = await PrayerService.updateJournalEntry(req.params.id, userId, req.body);
    res.status(200).json(entry);
  }

  static async getPrayerRequests(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const requests = await PrayerService.getPrayerRequests(page);
    res.status(200).json(requests);
  }

  static async createPrayerRequest(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = createPrayerRequestSchema.parse(req.body);
    const request = await PrayerService.createPrayerRequest(userId, data);
    res.status(201).json(request);
  }

  static async prayForRequest(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const result = await PrayerService.prayForRequest(req.params.id, userId);
    res.status(200).json(result);
  }

  static async markAnswered(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const result = await PrayerService.markAnswered(req.params.id, userId);
    res.status(200).json(result);
  }
}

import { Request, Response } from 'express';
import { ConfessionService } from './confession.service';
import { createConfessionSchema, createReplySchema } from './confession.dto';

export class ConfessionController {
  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const confessions = await ConfessionService.getAll(page, limit);
    res.status(200).json(confessions);
  }

  static async getById(req: Request, res: Response) {
    const confession = await ConfessionService.getById(req.params.id);
    if (!confession) return res.status(404).json({ message: 'Confession not found' });
    res.status(200).json(confession);
  }

  static async create(req: Request, res: Response) {
    const data = createConfessionSchema.parse(req.body);
    const userId = (req as any).user.id;
    const confession = await ConfessionService.create(userId, data);
    res.status(201).json(confession);
  }

  static async addReply(req: Request, res: Response) {
    const data = createReplySchema.parse(req.body);
    const userId = (req as any).user.id;
    const reply = await ConfessionService.addReply(req.params.id, userId, data);
    res.status(201).json(reply);
  }

  static async pray(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const result = await ConfessionService.pray(req.params.id, userId);
    res.status(200).json(result);
  }

  static async delete(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await ConfessionService.delete(req.params.id, userId);
    res.status(204).send();
  }
}

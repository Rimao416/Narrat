import { Request, Response } from 'express';
import { FamilyService } from './family.service';
import { createFamilyGroupSchema, addMemberSchema } from './family.dto';

export class FamilyController {
  static async getGroups(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const groups = await FamilyService.getGroups(userId);
    res.status(200).json(groups);
  }

  static async createGroup(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = createFamilyGroupSchema.parse(req.body);
    const group = await FamilyService.createGroup(userId, data);
    res.status(201).json(group);
  }

  static async addMember(req: Request, res: Response) {
    const data = addMemberSchema.parse(req.body);
    const member = await FamilyService.addMember(req.params.groupId, data);
    res.status(201).json(member);
  }

  static async getDevotions(req: Request, res: Response) {
    const devotions = await FamilyService.getDevotions();
    res.status(200).json(devotions);
  }

  static async getDevotionById(req: Request, res: Response) {
    const devotion = await FamilyService.getDevotionById(req.params.id);
    if (!devotion) return res.status(404).json({ message: 'Devotion not found' });
    res.status(200).json(devotion);
  }

  static async getTopics(req: Request, res: Response) {
    const topics = await FamilyService.getTopics(req.query.theme as string);
    res.status(200).json(topics);
  }
}

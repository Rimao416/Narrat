import { Request, Response } from 'express';
import { EvangelismService } from './evangelism.service';
import { createContactSchema, updateContactStatusSchema } from './evangelism.dto';

export class EvangelismController {
  static async getContacts(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const contacts = await EvangelismService.getContacts(userId);
    res.status(200).json(contacts);
  }

  static async createContact(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = createContactSchema.parse(req.body);
    const contact = await EvangelismService.createContact(userId, data);
    res.status(201).json(contact);
  }

  static async updateContactStatus(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = updateContactStatusSchema.parse(req.body);
    const contact = await EvangelismService.updateContactStatus(req.params.id, userId, data);
    res.status(200).json(contact);
  }

  static async deleteContact(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await EvangelismService.deleteContact(req.params.id, userId);
    res.status(204).send();
  }

  static async getResources(req: Request, res: Response) {
    const resources = await EvangelismService.getResources(req.query.language as string);
    res.status(200).json(resources);
  }

  static async getObjectionAnswers(req: Request, res: Response) {
    const answers = await EvangelismService.getObjectionAnswers(req.query.q as string);
    res.status(200).json(answers);
  }
}

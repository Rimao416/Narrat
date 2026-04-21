import { Request, Response } from 'express';
import { AIService } from './ai.service';
import { chatMessageSchema } from './ai.dto';

export class AIController {
  static async chat(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = chatMessageSchema.parse(req.body);
    const result = await AIService.chat(userId, data);
    res.status(200).json(result);
  }

  static async getConversations(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const conversations = await AIService.getConversations(userId);
    res.status(200).json(conversations);
  }

  static async getConversationMessages(req: Request, res: Response) {
    const messages = await AIService.getConversationMessages(req.params.id);
    res.status(200).json(messages);
  }

  static async deleteConversation(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await AIService.deleteConversation(req.params.id, userId);
    res.status(204).send();
  }
}

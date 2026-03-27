import { Request, Response } from 'express';
import { ChallengeService } from './challenge.service';
import { joinChallengeSchema, dailyCheckInSchema } from './challenge.dto';

export class ChallengeController {
  static async getAll(req: Request, res: Response) {
    const challenges = await ChallengeService.getAll(req.query.category as string);
    res.status(200).json(challenges);
  }

  static async getById(req: Request, res: Response) {
    const challenge = await ChallengeService.getById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.status(200).json(challenge);
  }

  static async join(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = joinChallengeSchema.parse(req.body);
    const userChallenge = await ChallengeService.join(userId, data);
    res.status(201).json(userChallenge);
  }

  static async getMyChallenges(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const challenges = await ChallengeService.getMyChallenges(userId);
    res.status(200).json(challenges);
  }

  static async checkIn(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = dailyCheckInSchema.parse(req.body);
    const checkIn = await ChallengeService.checkIn(userId, data);
    res.status(201).json(checkIn);
  }

  static async abandon(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const result = await ChallengeService.abandon(req.params.id, userId);
    res.status(200).json(result);
  }
}

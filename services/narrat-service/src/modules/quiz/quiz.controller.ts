import { Request, Response } from 'express';
import { QuizService } from './quiz.service';
import { startSessionSchema, submitAnswerSchema, challengeDuelSchema } from './quiz.dto';

export class QuizController {
  static async startSession(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = startSessionSchema.parse(req.body);
    const result = await QuizService.startSession(userId, data);
    res.status(201).json(result);
  }

  static async submitAnswer(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = submitAnswerSchema.parse(req.body);
    const result = await QuizService.submitAnswer(userId, data);
    res.status(200).json(result);
  }

  static async getTournaments(req: Request, res: Response) {
    const tournaments = await QuizService.getTournaments();
    res.status(200).json(tournaments);
  }

  static async joinTournament(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const entry = await QuizService.joinTournament(userId, req.params.id);
    res.status(201).json(entry);
  }

  static async createDuel(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = challengeDuelSchema.parse(req.body);
    const duel = await QuizService.createDuel(userId, data);
    res.status(201).json(duel);
  }

  static async getLeaderboard(req: Request, res: Response) {
    const leaderboard = await QuizService.getLeaderboard();
    res.status(200).json(leaderboard);
  }
}

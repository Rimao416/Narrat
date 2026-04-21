import { Request, Response } from 'express';
import { HealthService } from './health.service';
import { submitBilanSchema } from './health.dto';

export class HealthController {
  static async getBilanHistory(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const history = await HealthService.getBilanHistory(userId);
    res.status(200).json(history);
  }

  static async getLatestBilan(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const bilan = await HealthService.getLatestBilan(userId);
    res.status(200).json(bilan);
  }

  static async submitBilan(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = submitBilanSchema.parse(req.body);
    const bilan = await HealthService.submitBilan(userId, data);
    res.status(201).json(bilan);
  }

  static async getGrowthPlans(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const plans = await HealthService.getGrowthPlans(userId);
    res.status(200).json(plans);
  }
}

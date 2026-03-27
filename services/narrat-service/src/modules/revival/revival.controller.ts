import { Request, Response } from 'express';
import { RevivalService } from './revival.service';

export class RevivalController {
  static async getFigures(req: Request, res: Response) {
    const figures = await RevivalService.getFigures(req.query.era as string, req.query.region as string);
    res.status(200).json(figures);
  }

  static async getFigureById(req: Request, res: Response) {
    const figure = await RevivalService.getFigureById(req.params.id);
    if (!figure) return res.status(404).json({ message: 'Figure not found' });
    res.status(200).json(figure);
  }

  static async getTestimonies(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const testimonies = await RevivalService.getTestimonies(page);
    res.status(200).json(testimonies);
  }

  static async getHistoricalRevivals(req: Request, res: Response) {
    const revivals = await RevivalService.getHistoricalRevivals(req.query.era as string);
    res.status(200).json(revivals);
  }
}

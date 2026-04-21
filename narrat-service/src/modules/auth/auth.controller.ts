import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, googleSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.dto';

export class AuthController {
  static async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data);
    res.status(201).json(result);
  }

  static async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data);
    res.status(200).json(result);
  }

  static async me(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const user = await AuthService.me(userId);
    res.status(200).json(user);
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken requis' });
    const result = await AuthService.refresh(refreshToken);
    res.status(200).json(result);
  }

  static async googleAuth(req: Request, res: Response) {
    const data = googleSchema.parse(req.body);
    const result = await AuthService.googleAuth(data);
    res.status(200).json(result);
  }

  static async forgotPassword(req: Request, res: Response) {
    const data = forgotPasswordSchema.parse(req.body);
    const result = await AuthService.forgotPassword(data);
    res.status(200).json(result);
  }

  static async resetPassword(req: Request, res: Response) {
    const data = resetPasswordSchema.parse(req.body);
    const result = await AuthService.resetPassword(data);
    res.status(200).json(result);
  }
}

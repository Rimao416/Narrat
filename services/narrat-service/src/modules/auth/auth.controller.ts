import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.dto';

export class AuthController {
  static async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const token = await AuthService.register(data);
    res.status(201).json({ token });
  }

  static async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const token = await AuthService.login(data);
    res.status(200).json({ token });
  }
}

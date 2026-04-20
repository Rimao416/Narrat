import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import { RegisterDto, LoginDto } from './auth.dto';

export class AuthService {
  static async register(data: RegisterDto) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Cet email est déjà utilisé');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    const token = this.generateToken(user.id);
    return { token, user: this.sanitize(user) };
  }

  static async login(data: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new Error('Identifiants invalides');
    }

    const token = this.generateToken(user.id);
    return { token, user: this.sanitize(user) };
  }

  private static generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }

  private static sanitize(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

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
    const refreshToken = this.generateRefreshToken(user.id);
    return { token, refreshToken, user: this.sanitize(user) };
  }

  static async login(data: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new Error('Identifiants invalides');
    }
    if (user.isBanned) throw new Error('Compte suspendu');

    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    return { token, refreshToken, user: this.sanitize(user) };
  }

  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { confessions: true, prayerRequests: true, enrollments: true },
        },
      },
    });
    if (!user) throw new Error('Utilisateur introuvable');
    return this.sanitize(user);
  }

  static async refresh(refreshToken: string) {
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!) as { userId: string };
    } catch {
      throw new Error('Refresh token invalide');
    }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.isBanned) throw new Error('Utilisateur introuvable ou suspendu');

    const token = this.generateToken(user.id);
    const newRefreshToken = this.generateRefreshToken(user.id);
    return { token, refreshToken: newRefreshToken, user: this.sanitize(user) };
  }

  private static generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }

  private static generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!, { expiresIn: '30d' });
  }

  static sanitize(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

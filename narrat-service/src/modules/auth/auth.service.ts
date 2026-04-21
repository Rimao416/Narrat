import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../../config/database';
import { RegisterDto, LoginDto, GoogleDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { EmailService } from '../../shared/services/email.service';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
          select: { confessions: true, prayerRequests: true, courseEnrollments: true },
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

  static async googleAuth(data: GoogleDto) {
    const ticket = await googleClient.verifyIdToken({
      idToken: data.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error("Impossible de vérifier l'identité Google");

    let user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          firstName: payload.given_name || payload.name || 'User',
          lastName: payload.family_name || '',
          googleId: payload.sub,
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });
    } else if (!user.googleId) {
      // Lie le compte Google si un compte avec cet email existe déjà
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub, emailVerified: true },
      });
    }

    if (user.isBanned) throw new Error('Compte suspendu');

    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    return { token, refreshToken, user: this.sanitize(user) };
  }

  static async forgotPassword(data: ForgotPasswordDto) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      // On retourne true silencieusement pour éviter l'énumération d'emails
      return { success: true };
    }

    // Token valable 1h
    const resetToken = jwt.sign({ userId: user.id, type: 'reset' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    
    await EmailService.sendPasswordResetEmail(user.email, resetToken);
    
    return { success: true };
  }

  static async resetPassword(data: ResetPasswordDto) {
    let decoded: { userId: string, type: string };
    try {
      decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as any;
    } catch {
      throw new Error('Lien de réinitialisation invalide ou expiré');
    }

    if (decoded.type !== 'reset') throw new Error('Token invalide');

    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash },
    });

    return { success: true };
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

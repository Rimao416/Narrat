import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import { RegisterDto, LoginDto } from './auth.dto';

export class AuthService {
  static async register(data: RegisterDto) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    return this.generateToken(user.id);
  }

  static async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user.id);
  }

  private static generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
  }
}

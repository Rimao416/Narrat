import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './shared/middlewares/error-handler';
import { authenticate } from './shared/middlewares/auth.middleware';

import authRoutes from './modules/auth/auth.route';
import libraryRoutes from './modules/library/library.route';
import confessionRoutes from './modules/confession/confession.route';
import formationRoutes from './modules/formation/formation.route';
import notificationRoutes from './modules/notification/notification.route';
import challengeRoutes from './modules/challenge/challenge.route';
import prayerRoutes from './modules/prayer/prayer.route';
import quizRoutes from './modules/quiz/quiz.route';
import worshipRoutes from './modules/worship/worship.route';
import revivalRoutes from './modules/revival/revival.route';
import familyRoutes from './modules/family/family.route';
import evangelismRoutes from './modules/evangelism/evangelism.route';
import healthRoutes from './modules/health/health.route';
import aiRoutes from './modules/ai/ai.route';
import adminRoutes from './modules/admin/admin.route';

dotenv.config();

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001,http://localhost:8081')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (mobile apps, Postman) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} non autorisé`));
  },
  credentials: true,
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, réessayez dans 15 minutes' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives de connexion, réessayez dans 15 minutes' },
});

app.use(globalLimiter);

// ─── Parsing & Logging ────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────────────────────────

// Public
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/revival', revivalRoutes);

// Authenticated
app.use('/api/confessions', confessionRoutes);
app.use('/api/formation', formationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/prayer', authenticate, prayerRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/worship', worshipRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/evangelism', authenticate, evangelismRoutes);
app.use('/api/health', authenticate, healthRoutes);
app.use('/api/ai', authenticate, aiRoutes);

// Admin
app.use('/api/admin', adminRoutes);

// Health check (infra)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Narrat Service is running' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;

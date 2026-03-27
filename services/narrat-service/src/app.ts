import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './shared/middlewares/error-handler';
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

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/confessions', confessionRoutes);
app.use('/api/formation', formationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/worship', worshipRoutes);
app.use('/api/revival', revivalRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/evangelism', evangelismRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Narrat Service is running' });
});

// Add module routes here
// app.use('/api/auth', authRoutes);

// Error Handler
app.use(errorHandler);

export default app;

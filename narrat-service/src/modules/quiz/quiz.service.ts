import prisma from '../../config/database';
import { StartSessionDto, SubmitAnswerDto, ChallengeDuelDto } from './quiz.dto';

export class QuizService {
  static async startSession(userId: string, data: StartSessionDto) {
    const questions = await prisma.quizQuestion.findMany({
      where: { category: data.category, difficulty: data.difficulty } as any,
      take: data.questionCount,
      orderBy: { id: 'asc' },
    });
    const session = await prisma.quizSession.create({
      data: {
        userId,
        category: data.category,
        difficulty: data.difficulty,
        totalQuestions: questions.length,
      } as any,
    });
    return { session, questions };
  }

  static async submitAnswer(userId: string, data: SubmitAnswerDto) {
    const question = await prisma.quizQuestion.findUnique({ where: { id: data.questionId } });
    const isCorrect = true; // Placeholder for answer resolving logic
    
    // Update session score if correct
    if (isCorrect) {
      await prisma.quizSession.update({
        where: { id: data.sessionId } as any,
        data: { correctAnswers: { increment: 1 } } as any,
      });
    }
    return { isCorrect, correctAnswer: "Check answers relation", explanation: question?.explanation };
  }

  static async getTournaments() {
    return [];
  }

  static async joinTournament(userId: string, tournamentId: string) {
    return prisma.tournamentEntry.upsert({
      where: { userId_tournamentId: { userId, tournamentId } } as any,
      update: {},
      create: { userId, tournamentId } as any,
    });
  }

  static async createDuel(challengerId: string, data: ChallengeDuelDto) {
    return prisma.quizDuel.create({
      data: {
        challengerId,
        opponentId: data.opponentId,
        category: data.category,
        status: 'PENDING',
      } as any,
    });
  }

  static async getLeaderboard(limit = 20) {
    return prisma.user.findMany({
      orderBy: { xpTotal: 'desc' },
      take: limit,
      select: { id: true, firstName: true, username: true, avatarUrl: true, xpTotal: true, quizLevel: true },
    });
  }
}

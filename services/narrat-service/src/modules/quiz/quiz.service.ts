import prisma from '../../config/database';
import { StartSessionDto, SubmitAnswerDto, ChallengeDuelDto } from './quiz.dto';

export class QuizService {
  static async startSession(userId: string, data: StartSessionDto) {
    const questions = await prisma.quizQuestion.findMany({
      where: { category: data.category, difficulty: data.difficulty },
      take: data.questionCount,
      orderBy: { id: 'asc' },
    });
    const session = await prisma.quizSession.create({
      data: {
        userId,
        category: data.category,
        difficulty: data.difficulty,
        totalQuestions: questions.length,
      },
    });
    return { session, questions };
  }

  static async submitAnswer(userId: string, data: SubmitAnswerDto) {
    const question = await prisma.quizQuestion.findUnique({ where: { id: data.questionId } });
    const isCorrect = question?.correctAnswer === data.selectedAnswer;
    // Update session score if correct
    if (isCorrect) {
      await prisma.quizSession.update({
        where: { id: data.sessionId },
        data: { correctAnswers: { increment: 1 } },
      });
    }
    return { isCorrect, correctAnswer: question?.correctAnswer, explanation: question?.explanation };
  }

  static async getTournaments() {
    return prisma.quizTournament.findMany({
      where: { status: { in: ['UPCOMING', 'ACTIVE'] } },
      orderBy: { startsAt: 'asc' },
    });
  }

  static async joinTournament(userId: string, tournamentId: string) {
    return prisma.tournamentEntry.upsert({
      where: { userId_tournamentId: { userId, tournamentId } },
      update: {},
      create: { userId, tournamentId },
    });
  }

  static async createDuel(challengerId: string, data: ChallengeDuelDto) {
    return prisma.quizDuel.create({
      data: {
        challengerId,
        opponentId: data.opponentId,
        category: data.category,
        status: 'PENDING',
      },
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

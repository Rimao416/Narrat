import prisma from '../../config/database';
import { paginate, paginatedResponse } from '../../shared/utils/pagination';
import type {
  CreateBookDto, UpdateBookDto,
  CreateCourseDto, UpdateCourseDto,
  CreateModuleDto, UpdateModuleDto,
  CreateQuizDto, UpdateQuizDto,
  CreateQuizQuestionDto, UpdateQuizQuestionDto,
  CreateChallengeDto, UpdateChallengeDto,
  CreateSongDto, UpdateSongDto,
} from './admin.dto';

// ─── Books ────────────────────────────────────────────────────────────────────

export class AdminBooksService {
  static async list(params: { page?: number; pageSize?: number; search?: string; status?: string; category?: string }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { author: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { author: { lastName: { contains: params.search, mode: 'insensitive' } } },
      ];
    }
    if (params.status) where.status = params.status;
    if (params.category) where.category = params.category;

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: { author: true, _count: { select: { chapters: true } } },
      }),
      prisma.book.count({ where }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async get(id: string) {
    const book = await prisma.book.findUnique({ where: { id }, include: { author: true, chapters: true } });
    if (!book) throw new Error('Livre introuvable');
    return book;
  }

  static async create(data: CreateBookDto) {
    const { isFeatured, sortOrder, ...rest } = data as any;
    return prisma.book.create({
      data: { ...rest, status: 'DRAFT' as any },
      include: { author: true },
    });
  }

  static async update(id: string, data: UpdateBookDto) {
    const { isFeatured, sortOrder, ...rest } = data as any;
    return prisma.book.update({ where: { id }, data: rest as any, include: { author: true } });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.book.update({ where: { id }, data: { status: status as any } });
  }

  static async reorder(_ids: string[]) {
    // Book has no sortOrder field — ordering is handled via createdAt
  }

  static async delete(id: string) {
    await prisma.book.delete({ where: { id } });
  }
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export class AdminCoursesService {
  static async list(params: { page?: number; pageSize?: number; search?: string; status?: string; level?: string }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.search) where.title = { contains: params.search, mode: 'insensitive' };
    if (params.status) where.status = params.status;
    if (params.level) where.level = params.level;

    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { modules: true, enrollments: true } } },
      }),
      prisma.course.count({ where }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async get(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { moduleIndex: 'asc' },
          include: {
            quiz: {
              include: {
                questions: {
                  orderBy: { sortOrder: 'asc' },
                  include: { answers: { orderBy: { sortOrder: 'asc' } } },
                },
              },
            },
            _count: { select: { completions: true } },
          },
        },
        tags: { include: { tag: true } },
        _count: { select: { enrollments: true, modules: true } },
      },
    });
    if (!course) throw new Error('Formation introuvable');
    return course;
  }

  static async create(data: CreateCourseDto) {
    const { estimatedHours, ...rest } = data as any;
    const slug = `course-${Date.now()}-${rest.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) ?? 'new'}`;
    return prisma.course.create({
      data: {
        ...rest,
        slug,
        totalDuration: estimatedHours ? estimatedHours * 60 : undefined,
        status: 'DRAFT',
      } as any,
      include: { _count: { select: { modules: true, enrollments: true } } },
    });
  }

  static async update(id: string, data: UpdateCourseDto) {
    const { estimatedHours, ...rest } = data as any;
    const update: any = { ...rest };
    if (estimatedHours !== undefined) update.totalDuration = estimatedHours * 60;
    return prisma.course.update({
      where: { id },
      data: update,
      include: {
        modules: {
          orderBy: { moduleIndex: 'asc' },
          include: {
            quiz: {
              include: {
                questions: {
                  orderBy: { sortOrder: 'asc' },
                  include: { answers: { orderBy: { sortOrder: 'asc' } } },
                },
              },
            },
          },
        },
        _count: { select: { enrollments: true, modules: true } },
      },
    });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.course.update({ where: { id }, data: { status: status as any } });
  }

  static async reorder(_ids: string[]) {
    // Course has no sortOrder field
  }

  static async delete(id: string) {
    await prisma.course.delete({ where: { id } });
  }

  // ─── Modules ──────────────────────────────────────────────────────────────

  static async createModule(courseId: string, data: any) {
    // Auto-calculate moduleIndex
    const lastModule = await prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { moduleIndex: 'desc' },
    });
    const moduleIndex = (lastModule?.moduleIndex ?? -1) + 1;

    const mod = await prisma.courseModule.create({
      data: {
        ...data,
        courseId,
        moduleIndex,
        audioUrl: data.audioUrl || null,
        videoUrl: data.videoUrl || null,
      },
      include: {
        quiz: { include: { questions: { include: { answers: true } } } },
        _count: { select: { completions: true } },
      },
    });

    // Update course moduleCount
    const count = await prisma.courseModule.count({ where: { courseId } });
    await prisma.course.update({ where: { id: courseId }, data: { moduleCount: count } });

    return mod;
  }

  static async updateModule(courseId: string, moduleId: string, data: any) {
    const updateData = { ...data };
    if (data.audioUrl === '') updateData.audioUrl = null;
    if (data.videoUrl === '') updateData.videoUrl = null;

    return prisma.courseModule.update({
      where: { id: moduleId },
      data: updateData,
      include: {
        quiz: { include: { questions: { include: { answers: true } } } },
        _count: { select: { completions: true } },
      },
    });
  }

  static async deleteModule(courseId: string, moduleId: string) {
    await prisma.courseModule.delete({ where: { id: moduleId } });

    // Re-index remaining modules
    const remaining = await prisma.courseModule.findMany({
      where: { courseId },
      orderBy: { moduleIndex: 'asc' },
    });
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].moduleIndex !== i) {
        await prisma.courseModule.update({ where: { id: remaining[i].id }, data: { moduleIndex: i } });
      }
    }

    // Update course moduleCount
    await prisma.course.update({ where: { id: courseId }, data: { moduleCount: remaining.length } });
  }

  static async reorderModules(courseId: string, moduleIds: string[]) {
    for (let i = 0; i < moduleIds.length; i++) {
      await prisma.courseModule.update({
        where: { id: moduleIds[i] },
        data: { moduleIndex: i },
      });
    }
  }

  // ─── Quiz ─────────────────────────────────────────────────────────────────

  static async createQuiz(moduleId: string, data: any) {
    return prisma.courseQuiz.create({
      data: { ...data, moduleId },
      include: { questions: { include: { answers: true } } },
    });
  }

  static async updateQuiz(quizId: string, data: any) {
    return prisma.courseQuiz.update({
      where: { id: quizId },
      data,
      include: { questions: { include: { answers: true } } },
    });
  }

  static async deleteQuiz(quizId: string) {
    await prisma.courseQuiz.delete({ where: { id: quizId } });
  }

  // ─── Quiz Questions ───────────────────────────────────────────────────────

  static async addQuizQuestion(quizId: string, data: any) {
    const { answers, ...questionData } = data;
    return prisma.quizQuestion.create({
      data: {
        ...questionData,
        quizId,
        answers: {
          create: answers.map((a: any, i: number) => ({
            text: a.text,
            isCorrect: a.isCorrect ?? false,
            sortOrder: i,
          })),
        },
      },
      include: { answers: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  static async updateQuizQuestion(questionId: string, data: any) {
    const { answers, ...questionData } = data;

    // Update question fields
    if (Object.keys(questionData).length > 0) {
      await prisma.quizQuestion.update({ where: { id: questionId }, data: questionData });
    }

    // If answers provided, replace them
    if (answers) {
      await prisma.quizAnswer.deleteMany({ where: { questionId } });
      await prisma.quizAnswer.createMany({
        data: answers.map((a: any, i: number) => ({
          questionId,
          text: a.text,
          isCorrect: a.isCorrect ?? false,
          sortOrder: i,
        })),
      });
    }

    return prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: { answers: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  static async deleteQuizQuestion(questionId: string) {
    await prisma.quizQuestion.delete({ where: { id: questionId } });
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  static async getStats(courseId: string) {
    const [course, enrollments, completions] = await Promise.all([
      prisma.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: { _count: { select: { completions: true } } },
            orderBy: { moduleIndex: 'asc' },
          },
          _count: { select: { enrollments: true, modules: true } },
        },
      }),
      prisma.courseEnrollment.findMany({
        where: { courseId },
        select: { progressPercent: true, isCompleted: true },
      }),
      prisma.quizAttempt.findMany({
        where: { quiz: { module: { courseId } } },
        select: { score: true, isPassed: true },
      }),
    ]);

    if (!course) throw new Error('Formation introuvable');

    const totalEnrolled = enrollments.length;
    const completedCount = enrollments.filter(e => e.isCompleted).length;
    const avgProgress = totalEnrolled > 0
      ? enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / totalEnrolled
      : 0;
    const avgQuizScore = completions.length > 0
      ? completions.reduce((sum, c) => sum + c.score, 0) / completions.length
      : 0;
    const quizPassRate = completions.length > 0
      ? (completions.filter(c => c.isPassed).length / completions.length) * 100
      : 0;

    const moduleStats = course.modules.map(m => ({
      id: m.id,
      title: m.title,
      moduleIndex: m.moduleIndex,
      completions: m._count.completions,
    }));

    return {
      totalEnrolled,
      completedCount,
      completionRate: totalEnrolled > 0 ? (completedCount / totalEnrolled) * 100 : 0,
      avgProgress: Math.round(avgProgress * 100) / 100,
      avgQuizScore: Math.round(avgQuizScore * 100) / 100,
      quizPassRate: Math.round(quizPassRate * 100) / 100,
      moduleStats,
    };
  }
}

// ─── Songs ────────────────────────────────────────────────────────────────────

export class AdminSongsService {
  static async list(params: { page?: number; pageSize?: number; search?: string; status?: string }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { artist: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      prisma.song.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.song.count({ where }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async create(data: CreateSongDto) {
    const { albumArt, ...rest } = data as any;
    const slug = `${rest.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) ?? 'song'}-${Date.now()}`;
    return prisma.song.create({
      data: { ...rest, slug, imageUrl: albumArt, theme: rest.title ?? 'Adoration', status: 'DRAFT' } as any,
    });
  }

  static async update(id: string, data: UpdateSongDto) {
    const { albumArt, ...rest } = data as any;
    const update: any = { ...rest };
    if (albumArt !== undefined) update.imageUrl = albumArt;
    return prisma.song.update({ where: { id }, data: update });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.song.update({ where: { id }, data: { status: status as any } });
  }

  static async delete(id: string) {
    await prisma.song.delete({ where: { id } });
  }
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export class AdminChallengesService {
  static async list(params: { page?: number; pageSize?: number; search?: string; status?: string }) {
    const { skip, take } = paginate(params.page, params.pageSize);
    const where: any = {};
    if (params.search) where.title = { contains: params.search, mode: 'insensitive' };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      prisma.challenge.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.challenge.count({ where }),
    ]);
    return paginatedResponse(data, total, params.page, params.pageSize);
  }

  static async get(id: string) {
    const ch = await prisma.challenge.findUnique({
      where: { id },
      include: { _count: { select: { userChallenges: true } } },
    });
    if (!ch) throw new Error('Défi introuvable');
    return ch;
  }

  static async create(data: CreateChallengeDto) {
    const { isFeatured, sortOrder, ...rest } = data as any;
    return prisma.challenge.create({ data: { ...rest, status: 'DRAFT' as any } });
  }

  static async update(id: string, data: UpdateChallengeDto) {
    const { isFeatured, sortOrder, ...rest } = data as any;
    return prisma.challenge.update({ where: { id }, data: rest as any });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.challenge.update({ where: { id }, data: { status: status as any } });
  }

  static async reorder(_ids: string[]) {
    // Challenge has no sortOrder field
  }

  static async delete(id: string) {
    await prisma.challenge.delete({ where: { id } });
  }
}

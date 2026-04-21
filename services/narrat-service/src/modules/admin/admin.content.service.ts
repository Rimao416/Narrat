import prisma from '../../config/database';
import { paginate, paginatedResponse } from '../../shared/utils/pagination';
import type {
  CreateBookDto, UpdateBookDto,
  CreateCourseDto, UpdateCourseDto,
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
      include: { modules: { orderBy: { moduleIndex: 'asc' } }, _count: { select: { enrollments: true } } },
    });
    if (!course) throw new Error('Formation introuvable');
    return course;
  }

  static async create(data: CreateCourseDto) {
    const { isFeatured, estimatedHours, ...rest } = data as any;
    const slug = `course-${Date.now()}-${rest.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) ?? 'new'}`;
    return prisma.course.create({
      data: { ...rest, slug, totalDuration: estimatedHours ? estimatedHours * 60 : undefined, status: 'DRAFT' } as any,
    });
  }

  static async update(id: string, data: UpdateCourseDto) {
    const { isFeatured, estimatedHours, ...rest } = data as any;
    const update: any = { ...rest };
    if (estimatedHours !== undefined) update.totalDuration = estimatedHours * 60;
    return prisma.course.update({ where: { id }, data: update });
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

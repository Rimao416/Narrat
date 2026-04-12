import prisma from '../../config/database';
import { EnrollCourseDto } from './formation.dto';

export class FormationService {
  static async getCourses(language?: string) {
    return prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        ...(language ? { language: language as any } : {}),
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  static async getCourseById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        modules: true,
        tags: { include: { tag: true } },
      },
    });
  }

  static async enroll(userId: string, data: EnrollCourseDto) {
    return prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId, courseId: data.courseId } },
      update: {},
      create: { userId, courseId: data.courseId },
    });
  }

  static async getEnrollments(userId: string) {
    return prisma.courseEnrollment.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  static async getLesson(lessonId: string) {
    return prisma.courseModule.findUnique({ where: { id: lessonId } });
  }

  static async completeLesson(userId: string, lessonId: string) {
    return prisma.moduleCompletion.upsert({
      where: { enrollmentId_moduleId: { enrollmentId: userId, moduleId: lessonId } } as any,
      update: {},
      create: { enrollmentId: userId, moduleId: lessonId } as any,
    });
  }
}

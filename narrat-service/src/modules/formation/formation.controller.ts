import { Request, Response } from 'express';
import { FormationService } from './formation.service';
import { enrollCourseSchema } from './formation.dto';

export class FormationController {
  static async getCourses(req: Request, res: Response) {
    const { language } = req.query;
    const courses = await FormationService.getCourses(language as string);
    res.status(200).json(courses);
  }

  static async getCourseById(req: Request, res: Response) {
    const course = await FormationService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  }

  static async enroll(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const data = enrollCourseSchema.parse(req.body);
    const enrollment = await FormationService.enroll(userId, data);
    res.status(201).json(enrollment);
  }

  static async getEnrollments(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const enrollments = await FormationService.getEnrollments(userId);
    res.status(200).json(enrollments);
  }

  static async getLesson(req: Request, res: Response) {
    const lesson = await FormationService.getLesson(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json(lesson);
  }

  static async getLessonQuiz(req: Request, res: Response) {
    const quiz = await FormationService.getLessonQuiz(req.params.lessonId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(quiz);
  }

  static async completeLesson(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const result = await FormationService.completeLesson(userId, req.params.lessonId);
    res.status(200).json(result);
  }
}

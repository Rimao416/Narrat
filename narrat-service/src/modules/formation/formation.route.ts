import { Router } from 'express';
import { FormationController } from './formation.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/courses', asyncHandler(FormationController.getCourses));
router.get('/courses/:id', asyncHandler(FormationController.getCourseById));
router.get('/my-enrollments', asyncHandler(FormationController.getEnrollments));
router.post('/enroll', asyncHandler(FormationController.enroll));
router.get('/lessons/:lessonId', asyncHandler(FormationController.getLesson));
router.get('/lessons/:lessonId/quiz', asyncHandler(FormationController.getLessonQuiz));
router.post('/lessons/:lessonId/complete', asyncHandler(FormationController.completeLesson));

export default router;

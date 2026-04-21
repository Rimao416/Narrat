import { z } from 'zod';

export const enrollCourseSchema = z.object({
  courseId: z.string(),
});

export const submitQuizSchema = z.object({
  moduleId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string(),
  })),
});

export type EnrollCourseDto = z.infer<typeof enrollCourseSchema>;
export type SubmitQuizDto = z.infer<typeof submitQuizSchema>;

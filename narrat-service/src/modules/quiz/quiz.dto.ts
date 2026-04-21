import { z } from 'zod';

export const startSessionSchema = z.object({
  category: z.enum(['OLD_TESTAMENT','NEW_TESTAMENT','PSALMS','PROVERBS','GOSPELS','EPISTLES','PROPHETS','BIBLICAL_GEOGRAPHY','BIBLICAL_CHARACTERS','PARABLES','MIRACLES','FAMOUS_VERSES','CHURCH_HISTORY']),
  difficulty: z.enum(['BEGINNER','INTERMEDIATE','ADVANCED','EXPERT']).default('BEGINNER'),
  questionCount: z.number().min(5).max(20).default(10),
});

export const submitAnswerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  selectedAnswer: z.string(),
});

export const challengeDuelSchema = z.object({
  opponentId: z.string(),
  category: z.enum(['OLD_TESTAMENT','NEW_TESTAMENT','PSALMS','PROVERBS','GOSPELS','EPISTLES','PROPHETS','BIBLICAL_GEOGRAPHY','BIBLICAL_CHARACTERS','PARABLES','MIRACLES','FAMOUS_VERSES','CHURCH_HISTORY']),
});

export type StartSessionDto = z.infer<typeof startSessionSchema>;
export type SubmitAnswerDto = z.infer<typeof submitAnswerSchema>;
export type ChallengeDuelDto = z.infer<typeof challengeDuelSchema>;

import { PrismaClient, CourseLevel, ContentStatus, QuizQuestionType } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedEducation(prisma: PrismaClient, users: any[]) {
  console.log('⏳ Création du Module 3 (Enseignement & Formation)...');

  // Cours (Ex: 10 formations)
  const levels = Object.values(CourseLevel);

  for (let i = 0; i < 10; i++) {
    const courseTitle = faker.lorem.words(3);
    const course = await prisma.course.create({
      data: {
        title: `Formation: ${courseTitle}`,
        slug: faker.helpers.slugify(courseTitle).toLowerCase() + '-' + i,
        description: faker.lorem.paragraphs(2),
        objectives: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
        level: faker.helpers.arrayElement(levels),
        status: ContentStatus.PUBLISHED,
        teacherName: 'Pasteur ' + faker.person.lastName(),
        enrollCount: faker.number.int({ min: 10, max: 2000 }),
      }
    });

    // Modules (3 à 5 par cours)
    const moduleCount = faker.number.int({ min: 3, max: 5 });
    for (let m = 1; m <= moduleCount; m++) {
      const moduleTitle = faker.lorem.words(4);
      const courseModule = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          moduleIndex: m,
          title: `Module ${m}: ${moduleTitle}`,
          content: faker.lorem.paragraphs(4),
          summary: faker.lorem.paragraph(),
          verseRefs: ['Jean 3:16', 'Romains 8:28'],
          isLocked: m > 1, // Déverrouillé si c'est le module 1
        }
      });

      // Quiz pour le dernier module
      if (m === moduleCount) {
        const quiz = await prisma.courseQuiz.create({
          data: {
            moduleId: courseModule.id,
            passingScore: 70,
            maxAttempts: 3,
          }
        });

        // Questions du Quiz
        for (let q = 0; q < 5; q++) {
          const question = await prisma.quizQuestion.create({
            data: {
              quizId: quiz.id,
              type: QuizQuestionType.MCQ,
              question: faker.lorem.sentence() + ' ?',
              explanation: faker.lorem.paragraph(),
            }
          });

          // Réponses
          await prisma.quizAnswer.createMany({
            data: [
              { questionId: question.id, text: faker.lorem.word(), isCorrect: true },
              { questionId: question.id, text: faker.lorem.word(), isCorrect: false },
              { questionId: question.id, text: faker.lorem.word(), isCorrect: false },
            ]
          });
        }
      }
    }
  }

  console.log('✅ Module Enseignement seedé.');
}

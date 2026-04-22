import { PrismaClient, ChallengeStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export async function seedRichUsers(prisma: PrismaClient) {
  console.log('💎 Enrichissement des utilisateurs standards avec des données et relations...');

  const passwordHash = await bcrypt.hash('User@Narrat2024!', 10);
  const testUserEmails = ['user1@narrat.app', 'user2@narrat.app', 'user3@narrat.app', 'user4@narrat.app', 'user5@narrat.app'];

  // Récupérer les données globales pour les lier
  const courses = await prisma.course.findMany({ include: { modules: true } });
  const groups = await prisma.communityGroup.findMany();
  const challenges = await prisma.challenge.findMany();
  const books = await prisma.book.findMany({ include: { chapters: true } });

  for (const email of testUserEmails) {
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) continue;

    // 1. Mettre à jour le mot de passe et infos de base
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        bio: faker.lorem.sentence().substring(0, 150),
        city: faker.location.city(),
        country: 'FR',
        xpTotal: faker.number.int({ min: 100, max: 5000 }),
      }
    });

    console.log(`  🔗 Création des relations pour ${email}...`);

    // 2. Inscriptions aux cours et progression
    const selectedCourses = faker.helpers.arrayElements(courses, { min: 2, max: 4 });
    for (const course of selectedCourses) {
      const enrollment = await prisma.courseEnrollment.upsert({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
        update: {},
        create: {
          userId: user.id,
          courseId: course.id,
          progressPercent: faker.number.int({ min: 10, max: 100 }),
        }
      });

      // Compléter quelques modules
      const modulesToComplete = faker.helpers.arrayElements(course.modules, { min: 1, max: course.modules.length });
      for (const mod of modulesToComplete) {
        await prisma.moduleCompletion.upsert({
          where: { enrollmentId_moduleId: { enrollmentId: enrollment.id, moduleId: mod.id } },
          update: {},
          create: {
            enrollmentId: enrollment.id,
            moduleId: mod.id,
            completedAt: faker.date.recent(),
          }
        });
      }
    }

    // 3. Adhésion aux groupes
    const selectedGroups = faker.helpers.arrayElements(groups, { min: 2, max: 3 });
    for (const group of selectedGroups) {
      await prisma.groupMembership.upsert({
        where: { groupId_userId: { groupId: group.id, userId: user.id } },
        update: {},
        create: {
          groupId: group.id,
          userId: user.id,
        }
      });
    }

    // 4. Confessions et Réponses
    for (let i = 0; i < 3; i++) {
      const confession = await prisma.confession.create({
        data: {
          userId: user.id,
          type: 'TESTIMONY',
          visibility: 'PUBLIC',
          content: `Témoignage de ${user.firstName}: ` + faker.lorem.paragraph(),
          prayerCount: faker.number.int({ min: 5, max: 50 }),
        }
      });

      // Ajouter des réponses d'autres utilisateurs à cette confession
      const otherUsers = await prisma.user.findMany({ where: { NOT: { id: user.id } }, take: 3 });
      for (const other of otherUsers) {
        await prisma.confessionReply.create({
          data: {
            confessionId: confession.id,
            userId: other.id,
            content: "Amen ! Quel beau témoignage.",
          }
        });
      }

      // Ajouter quelques prayer counts (votes) pour cette confession
      for (const other of otherUsers) {
        await prisma.prayerCount.upsert({
          where: { userId_confessionId: { userId: other.id, confessionId: confession.id } },
          update: {},
          create: {
            userId: other.id,
            confessionId: confession.id,
          }
        });
      }
    }

    // 5. Défis (Challenges)
    const selectedChallenges = faker.helpers.arrayElements(challenges, { min: 1, max: 2 });
    for (const challenge of selectedChallenges) {
      await prisma.userChallenge.upsert({
        where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } },
        update: {},
        create: {
          userId: user.id,
          challengeId: challenge.id,
          status: ChallengeStatus.ACTIVE,
          currentDay: faker.number.int({ min: 1, max: challenge.durationDays }),
          startedAt: faker.date.recent({ days: 10 }),
        }
      });
    }

    // 6. Lecture de livres
    const selectedBooks = faker.helpers.arrayElements(books, { min: 2, max: 5 });
    for (const book of selectedBooks) {
      await prisma.readingProgress.upsert({
        where: { userId_bookId: { userId: user.id, bookId: book.id } },
        update: {},
        create: {
          userId: user.id,
          bookId: book.id,
          currentChapter: faker.number.int({ min: 1, max: book.chapters.length }),
          progressPercent: faker.number.int({ min: 5, max: 95 }),
          lastReadAt: faker.date.recent(),
        }
      });
    }
  }

  console.log('✅ Utilisateurs "riches" créés avec succès.');
}

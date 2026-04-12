import { PrismaClient, ChallengeCategory, ChallengeIntensity, ContentStatus, Language } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedChallenges(prisma: PrismaClient, users: any[]) {
  console.log('⏳ Création du Module 5 (Défis Chrétiens)...');

  const categories = Object.values(ChallengeCategory);
  const intensities = Object.values(ChallengeIntensity);

  // 15 Défis
  for (let i = 0; i < 15; i++) {
    const title = faker.lorem.words(3);
    const durationDays = faker.helpers.arrayElement([7, 14, 21, 30]);

    const challenge = await prisma.challenge.create({
      data: {
        title: `Défi: ${title}`,
        slug: faker.helpers.slugify(title).toLowerCase() + '-' + i,
        description: faker.lorem.paragraphs(2),
        category: faker.helpers.arrayElement(categories),
        intensity: faker.helpers.arrayElement(intensities),
        durationDays: durationDays,
        language: Language.FR,
        status: ContentStatus.PUBLISHED,
        participantCount: faker.number.int({ min: 10, max: 5000 }),
      }
    });

    // Jours de défi
    for (let d = 1; d <= durationDays; d++) {
      await prisma.challengeDayContent.create({
        data: {
          challengeId: challenge.id,
          dayNumber: d,
          title: `Jour ${d}: ` + faker.lorem.words(2),
          teaching: faker.lorem.paragraphs(2),
          verseRefs: ['Psaumes 51:10'],
          practicalTask: faker.lorem.sentence(),
          guidedPrayer: faker.lorem.paragraph(),
        }
      });
    }
  }

  console.log('✅ Module Défis Chrétiens seedé.');
}

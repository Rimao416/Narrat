import { PrismaClient } from '@prisma/client';
import { seedUsers } from './00_users';
import { seedLibrary } from './01_library';
import { seedCommunity } from './02_community';
import { seedEducation } from './03_education';
import { seedChallenges } from './05_challenges';
import { seedAdmin } from './99_admin';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Début du nettoyage de la base de données...');

  // Nettoyage agressif pour repasser proprement (optionnel, on gère les relations pour clean)
  try {
    // Si nous voulons repartir de zéro :
    await prisma.userChallenge.deleteMany();
    await prisma.challengeDayContent.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.moduleCompletion.deleteMany();
    await prisma.courseEnrollment.deleteMany();
    await prisma.quizAttemptItem.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.quizAnswer.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.courseQuiz.deleteMany();
    await prisma.courseModule.deleteMany();
    await prisma.course.deleteMany();
    await prisma.confessionReply.deleteMany();
    await prisma.prayerCount.deleteMany();
    await prisma.confession.deleteMany();
    await prisma.communityGroup.deleteMany();
    await prisma.bookChapter.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Base de données nettoyée avec succès.');
  } catch (error) {
    console.log('⚠️ Erreur lors du nettoyage (normal si la base était vide):', error);
  }

  console.log('\n=======================================');
  console.log('🌱 DÉBUT DU SEEDING NARRAT...');
  console.log('=======================================\n');

  // STEP 0: Users
  const users = await seedUsers(prisma);

  // STEP 1: Library (Module 1)
  await seedLibrary(prisma, users);

  // STEP 2: Community (Module 2)
  await seedCommunity(prisma, users);

  // STEP 3: Education (Module 3)
  await seedEducation(prisma, users);

  // STEP 5: Challenges (Module 5)
  await seedChallenges(prisma, users);

  // STEP 99: Admin users + feature flags + app config
  await seedAdmin(prisma);

  console.log('\n=======================================');
  console.log('✅✅ SEEDING TERMINÉ AVEC SUCCÈS ! ✅✅');
  console.log('=======================================\n');
}

main()
  .catch((e) => {
    console.error('❌ ERREUR LORS DU SEEDING :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

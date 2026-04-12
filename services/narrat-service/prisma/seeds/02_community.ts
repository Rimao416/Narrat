import { PrismaClient, ConfessionType, ConfessionVisibility } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedCommunity(prisma: PrismaClient, users: any[]) {
  console.log('⏳ Création du Module 2 (Communauté)...');

  // Groupes
  const groupThemes = ['Addictions', 'Célibat', 'Jeunesse', 'Prière', 'Deuil'];
  const groups = [];
  
  for (const theme of groupThemes) {
    const group = await prisma.communityGroup.create({
      data: {
        name: `Vaincre : ${theme}`,
        slug: faker.helpers.slugify(theme).toLowerCase(),
        description: `Groupe de soutien basé sur la parole pour dominer ${theme}`,
        creatorId: faker.helpers.arrayElement(users).id,
        isThematic: true,
        theme: theme,
      }
    });
    groups.push(group);

    // Ajouter des membres au groupe
    const members = faker.helpers.arrayElements(users, { min: 5, max: 20 });
    for (const member of members) {
      await prisma.groupMembership.create({
        data: {
          groupId: group.id,
          userId: member.id,
        }
      });
    }
  }

  // Confessions (Ex: 50)
  const confessionTypes = Object.values(ConfessionType);
  const visibilities = Object.values(ConfessionVisibility);

  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(users);
    const confession = await prisma.confession.create({
      data: {
        userId: user.id,
        type: faker.helpers.arrayElement(confessionTypes),
        visibility: faker.helpers.arrayElement(visibilities),
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        isAnonymous: faker.datatype.boolean(),
        prayerCount: faker.number.int({ min: 0, max: 150 }),
        replyCount: 0, 
        groupId: Math.random() > 0.5 ? faker.helpers.arrayElement(groups).id : null,
      }
    });

    // Réponses à la confession
    const replyCount = faker.number.int({ min: 0, max: 5 });
    for (let r = 0; r < replyCount; r++) {
      await prisma.confessionReply.create({
        data: {
          confessionId: confession.id,
          userId: faker.helpers.arrayElement(users).id,
          content: faker.lorem.paragraph(),
          verseRef: Math.random() > 0.5 ? 'Psaumes 23:1' : null,
        }
      });
    }
    
    // Mettre à jour le compteur
    await prisma.confession.update({
      where: { id: confession.id },
      data: { replyCount }
    });
  }

  console.log('✅ Module Communauté seedé.');
}

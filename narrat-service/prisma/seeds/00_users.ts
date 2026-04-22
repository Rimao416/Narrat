import { PrismaClient, UserRole, SpiritualLevel, Language } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedUsers(prisma: PrismaClient) {
  console.log('⏳ Création des utilisateurs...');
  const usersToCreate = [];

  // Super Admin
  usersToCreate.push({
    email: 'admin@narrat.com',
    firstName: 'Admin',
    lastName: 'Narrat',
    username: 'narrat_admin',
    role: UserRole.SUPER_ADMIN,
    spiritualLevel: SpiritualLevel.LEADER,
    language: Language.FR,
    passwordHash: 'dummy_hash', // Dans une vraie app on utiliserait bcrypt
  });

  // 5 Utilisateurs standards (fixes pour tests)
  for (let i = 1; i <= 5; i++) {
    usersToCreate.push({
      email: `user${i}@narrat.app`,
      firstName: `User${i}`,
      lastName: `Narrat`,
      username: `user_${i}`,
      role: UserRole.USER,
      spiritualLevel: faker.helpers.arrayElement(Object.values(SpiritualLevel)),
      language: Language.FR,
      passwordHash: 'dummy_hash', // On mettra un vrai hash dans 99_admin ou ailleurs si besoin
    });
  }

  // Moderateurs
  for (let i = 0; i < 5; i++) {
    usersToCreate.push({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      role: UserRole.MODERATOR,
      spiritualLevel: SpiritualLevel.ESTABLISHED,
      language: Math.random() > 0.8 ? Language.EN : Language.FR,
      city: faker.location.city(),
      country: faker.location.countryCode(),
      avatarUrl: faker.image.avatar(),
    });
  }

  // Users Simples (Nouveaux et Anciens)
  const levels = Object.values(SpiritualLevel);
  for (let i = 0; i < 50; i++) {
    usersToCreate.push({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username() + Math.floor(Math.random() * 1000),
      role: UserRole.USER,
      spiritualLevel: faker.helpers.arrayElement(levels),
      language: Math.random() > 0.2 ? Language.FR : Language.EN,
      bio: faker.lorem.sentence(),
      city: faker.location.city(),
      country: faker.location.countryCode(),
      avatarUrl: faker.image.avatar(),
    });
  }

  await prisma.user.createMany({
    data: usersToCreate,
    skipDuplicates: true,
  });

  const allUsers = await prisma.user.findMany();
  console.log(`✅ ${allUsers.length} utilisateurs créés.`);
  return allUsers;
}

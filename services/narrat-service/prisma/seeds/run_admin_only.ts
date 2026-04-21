import { PrismaClient } from '@prisma/client';
import { seedAdmin } from './99_admin';

const prisma = new PrismaClient();

seedAdmin(prisma)
  .then(() => {
    console.log('Done.');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

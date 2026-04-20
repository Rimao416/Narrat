import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedAdmin(prisma: PrismaClient) {
  console.log('👑 Seeding admin users...');

  const admins = [
    {
      email: 'superadmin@narrat.app',
      password: 'Admin@Narrat2024!',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN' as const,
    },
    {
      email: 'admin@narrat.app',
      password: 'Admin@Narrat2024!',
      firstName: 'Admin',
      lastName: 'Narrat',
      role: 'ADMIN' as const,
    },
    {
      email: 'moderateur@narrat.app',
      password: 'Modo@Narrat2024!',
      firstName: 'Mode',
      lastName: 'Rateur',
      role: 'MODERATOR' as const,
    },
  ];

  for (const a of admins) {
    const existing = await prisma.user.findUnique({ where: { email: a.email } });
    if (existing) {
      await prisma.user.update({
        where: { email: a.email },
        data: { role: a.role },
      });
      console.log(`  ✅ Updated role for ${a.email}`);
    } else {
      const passwordHash = await bcrypt.hash(a.password, 10);
      await prisma.user.create({
        data: {
          email: a.email,
          passwordHash,
          firstName: a.firstName,
          lastName: a.lastName,
          role: a.role,
          isActive: true,
        },
      });
      console.log(`  ✅ Created ${a.role}: ${a.email} (pwd: ${a.password})`);
    }
  }

  // Seed default feature flags
  const flags = [
    { key: 'ai_assistant', isEnabled: true, description: 'Conseiller spirituel IA' },
    { key: 'family_groups', isEnabled: true, description: 'Groupes familiaux' },
    { key: 'quiz_duels', isEnabled: true, description: 'Duels quiz 1v1' },
    { key: 'tournaments', isEnabled: false, description: 'Tournois quiz multijoueurs' },
    { key: 'evangelism_tools', isEnabled: true, description: 'Outils évangélisation' },
    { key: 'revival_history', isEnabled: true, description: 'Histoire du réveil' },
    { key: 'spiritual_health', isEnabled: true, description: 'Bilan spirituel' },
    { key: 'push_notifications', isEnabled: false, description: 'Push notifications' },
  ];

  for (const f of flags) {
    await prisma.featureFlag.upsert({
      where: { key: f.key },
      update: {},
      create: { key: f.key, isEnabled: f.isEnabled, description: f.description },
    });
  }
  console.log('  ✅ Feature flags seeded');

  // Seed default app config
  const configs = [
    { key: 'app.name', value: 'Narrat', isPublic: true },
    { key: 'app.version', value: '1.0.0', isPublic: true },
    { key: 'app.daily_verse_time', value: '07:00', isPublic: false },
    { key: 'app.max_confession_length', value: 1500, isPublic: false },
    { key: 'app.xp_per_lesson', value: 50, isPublic: false },
    { key: 'app.xp_per_checkin', value: 10, isPublic: false },
  ];

  for (const c of configs) {
    await prisma.appConfig.upsert({
      where: { key: c.key },
      update: {},
      create: { key: c.key, value: c.value, isPublic: c.isPublic },
    });
  }
  console.log('  ✅ App config seeded');

  console.log('👑 Admin seeding complete!\n');
}

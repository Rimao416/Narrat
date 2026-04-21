import prisma from '../../config/database';

export class AdminConfigService {
  // ─── AppConfig ─────────────────────────────────────────────────────────────

  static async listConfigs() {
    return prisma.appConfig.findMany({ orderBy: { key: 'asc' } });
  }

  static async upsertConfig(key: string, value: any, isPublic?: boolean, updatedBy?: string) {
    return prisma.appConfig.upsert({
      where: { key },
      update: { value, ...(isPublic !== undefined && { isPublic }), updatedBy },
      create: { key, value, isPublic: isPublic ?? false, updatedBy },
    });
  }

  // ─── Feature Flags ─────────────────────────────────────────────────────────

  static async listFlags() {
    return prisma.featureFlag.findMany({ orderBy: { key: 'asc' } });
  }

  static async upsertFlag(key: string, isEnabled?: boolean, rolloutPct?: number, description?: string) {
    return prisma.featureFlag.upsert({
      where: { key },
      update: {
        ...(isEnabled !== undefined && { isEnabled }),
        ...(rolloutPct !== undefined && { rolloutPct }),
        ...(description !== undefined && { description }),
      },
      create: {
        key,
        isEnabled: isEnabled ?? false,
        rolloutPct: rolloutPct ?? 0,
        description,
      },
    });
  }

  // ─── Notifications / Daily Verse ────────────────────────────────────────────

  static async getDailyVerses() {
    return prisma.appConfig.findMany({
      where: { key: { startsWith: 'daily_verse:' } },
      orderBy: { key: 'asc' },
    });
  }

  static async addDailyVerse(reference: string, text: string, language: string, scheduledDate?: string) {
    const key = `daily_verse:${language}:${scheduledDate ?? reference}`;
    return prisma.appConfig.upsert({
      where: { key },
      update: { value: { reference, text, language, scheduledDate } },
      create: { key, value: { reference, text, language, scheduledDate }, isPublic: true },
    });
  }

  static async removeDailyVerse(key: string) {
    return prisma.appConfig.delete({ where: { key } });
  }
}

import prisma from '../../config/database';

export class AdminAnalyticsService {
  static async dashboardStats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsersToday,
      newUsersThisWeek,
      totalBooks,
      totalCourses,
      totalConfessions,
      pendingReports,
      pendingBooks,
      pendingCourses,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { lastSeenAt: { gte: dayAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.book.count(),
      prisma.course.count(),
      prisma.confession.count(),
      prisma.report.count({ where: { isResolved: false } }),
      prisma.book.count({ where: { status: 'REVIEW' } }),
      prisma.course.count({ where: { status: 'REVIEW' } }),
    ]);

    return {
      totalUsers,
      activeUsersToday,
      newUsersThisWeek,
      totalBooks,
      totalCourses,
      totalConfessions,
      pendingReports,
      pendingContent: pendingBooks + pendingCourses,
    };
  }

  static async userGrowth(period: string) {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: from } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const byDate: Record<string, number> = {};
    users.forEach((u) => {
      const key = u.createdAt.toISOString().slice(0, 10);
      byDate[key] = (byDate[key] ?? 0) + 1;
    });

    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().slice(0, 10);
      result.push({ date: key, value: byDate[key] ?? 0 });
    }
    return result;
  }

  static async engagementByModule() {
    const events = await prisma.appEvent.groupBy({
      by: ['eventName'],
      _count: { eventName: true },
      orderBy: { _count: { eventName: 'desc' } },
      take: 10,
    }).catch(() => []);

    if (events.length > 0) {
      return events.map((e: any) => ({ module: e.eventName, count: e._count.eventName }));
    }

    // Fallback: count content interactions across modules
    const [books, courses, confessions, prayers, songs, challenges, quiz] = await Promise.all([
      prisma.readingProgress.count(),
      prisma.courseEnrollment.count(),
      prisma.confession.count(),
      prisma.prayerJournalEntry.count(),
      prisma.playlist.count(),
      prisma.userChallenge.count(),
      prisma.quizSession.count(),
    ]);

    return [
      { module: 'library', count: books },
      { module: 'formation', count: courses },
      { module: 'confessions', count: confessions },
      { module: 'prayer', count: prayers },
      { module: 'worship', count: songs },
      { module: 'challenges', count: challenges },
      { module: 'quiz', count: quiz },
    ];
  }

  static async topContent(type: string) {
    if (type === 'books') {
      const books = await prisma.book.findMany({
        orderBy: { viewCount: 'desc' },
        take: 10,
        select: { id: true, title: true, viewCount: true },
      });
      return books.map((b) => ({ id: b.id, title: b.title, count: b.viewCount }));
    }
    if (type === 'courses') {
      const courses = await prisma.course.findMany({
        orderBy: { enrollCount: 'desc' },
        take: 10,
        select: { id: true, title: true, enrollCount: true },
      });
      return courses.map((c) => ({ id: c.id, title: c.title, count: c.enrollCount }));
    }
    if (type === 'songs') {
      const songs = await prisma.song.findMany({
        orderBy: { playCount: 'desc' },
        take: 10,
        select: { id: true, title: true, playCount: true },
      });
      return songs.map((s) => ({ id: s.id, title: s.title, count: s.playCount }));
    }
    return [];
  }
}

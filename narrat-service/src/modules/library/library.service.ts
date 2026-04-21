import prisma from '../../config/database';

export class LibraryService {
  static async getBooks(category?: string) {
    return prisma.book.findMany({
      where: category ? { category: category as any } : {},
      include: { author: true },
    });
  }

  static async getBookBySlug(slug: string) {
    return prisma.book.findUnique({
      where: { slug },
      include: { author: true, chapters: true },
    });
  }

  static async getCategories() {
    // This is just a helper to return the enum values if needed, 
    // but Prisma doesn't expose enums directly like this easily without generation.
    // For now returning an empty list or hardcoded based on schema.
    return [
      "THEOLOGY", "BIOGRAPHY", "SPIRITUAL_GROWTH", "PRAYER", 
      "MARRIAGE_FAMILY", "FINANCES", "SPIRITUAL_WARFARE", 
      "APOLOGETICS", "CHURCH_HISTORY", "ESCHATOLOGY", 
      "SENSITIVE_TOPICS", "YOUTH_IDENTITY"
    ];
  }
}

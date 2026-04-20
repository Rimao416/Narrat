import { api } from '../lib/api';

const CATEGORY_COLORS: Record<string, string[]> = {
  THEOLOGY: ['#3A2A0A', '#1A1205'],
  BIOGRAPHY: ['#3A1A3A', '#1A0A1A'],
  SPIRITUAL_GROWTH: ['#922B21', '#3A0A0A'],
  PRAYER: ['#1A4A20', '#0A2010'],
  MARRIAGE_FAMILY: ['#1A2A4A', '#0A1228'],
  FINANCES: ['#2A3A1A', '#141E0A'],
  SPIRITUAL_WARFARE: ['#2A0A2A', '#150515'],
  APOLOGETICS: ['#0A2A3A', '#051420'],
  CHURCH_HISTORY: ['#3A1A0A', '#200A00'],
  ESCHATOLOGY: ['#0A0A3A', '#050520'],
  SENSITIVE_TOPICS: ['#3A0A1A', '#1A050D'],
  YOUTH_IDENTITY: ['#1A3A0A', '#0D2005'],
};

const CATEGORY_LABELS: Record<string, string> = {
  THEOLOGY: 'Théologie',
  BIOGRAPHY: 'Biographie',
  SPIRITUAL_GROWTH: 'Croissance spirituelle',
  PRAYER: 'Prière',
  MARRIAGE_FAMILY: 'Mariage & Famille',
  FINANCES: 'Finances',
  SPIRITUAL_WARFARE: 'Guerre spirituelle',
  APOLOGETICS: 'Apologétique',
  CHURCH_HISTORY: 'Histoire de l\'Église',
  ESCHATOLOGY: 'Eschatologie',
  SENSITIVE_TOPICS: 'Sujets sensibles',
  YOUTH_IDENTITY: 'Jeunesse & Identité',
};

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  categoryLabel: string;
  description: string;
  coverGradient: string[];
  hasAudio: boolean;
  isDownloadable: boolean;
  tags: string[];
  chapters: number;
  progress: number;
  currentChapter: number;
  rating: number;
  year?: string;
  totalDuration?: string;
}

function transformBook(raw: any): Book {
  const category = raw.category ?? 'SPIRITUAL_GROWTH';
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    title: raw.title,
    author: raw.author?.name ?? raw.authorName ?? 'Auteur inconnu',
    category,
    categoryLabel: CATEGORY_LABELS[category] ?? category,
    description: raw.description ?? '',
    coverGradient: CATEGORY_COLORS[category] ?? ['#1A1A1A', '#0A0A0A'],
    hasAudio: raw.hasAudio ?? false,
    isDownloadable: raw.isDownloadable ?? false,
    tags: raw.tags ?? [CATEGORY_LABELS[category] ?? category],
    chapters: raw._count?.chapters ?? raw.chapters?.length ?? 0,
    progress: raw.readingProgress?.[0]?.progressPercent ?? 0,
    currentChapter: raw.readingProgress?.[0]?.currentChapterId ? 1 : 0,
    rating: raw.averageRating ?? 4.5,
    year: raw.publishedYear?.toString(),
    totalDuration: raw.totalDuration,
  };
}

export const libraryService = {
  getBooks: async (category?: string): Promise<Book[]> => {
    const params = category && category !== 'Tous' ? { category } : {};
    const { data } = await api.get('/library/books', { params });
    return (data as any[]).map(transformBook);
  },

  getBookBySlug: async (slug: string): Promise<Book> => {
    const { data } = await api.get(`/library/books/${slug}`);
    return transformBook(data);
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get('/library/categories');
    return data;
  },
};

import { api } from '../lib/api';

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Modéré',
  ADVANCED: 'Intense',
};

export interface DiscoverCourse {
  id: string;
  title: string;
  teacher: string;
  teacherLocation?: string;
  level: string;
  modules: number;
  duration?: string;
  enrolled: number;
  rating: number;
  progress: number;
  currentModule?: number;
  heroGradient: [string, string];
  coverUrl?: string;
  tags: string[];
  objectives?: string[];
  hasAudio: boolean;
  description: string;
}

function gradientForLevel(level: string): [string, string] {
  switch (level) {
    case 'ADVANCED':
      return ['#2A0A0A', '#1A0505'];
    case 'BEGINNER':
      return ['#0A1428', '#101830'];
    default:
      return ['#0A1A0A', '#0A2810'];
  }
}

function minutesToHuman(min?: number | null): string | undefined {
  if (!min || min <= 0) return undefined;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;

  const baseUrl = api.defaults.baseURL;
  if (!baseUrl) return undefined;
  const origin = baseUrl.replace(/\/api\/?$/, '');
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${origin}${normalizedPath}`;
}

function transformCourse(raw: any): DiscoverCourse {
  const level = raw.level ?? 'INTERMEDIATE';
  const tags = (raw.tags ?? []).map((t: any) => t?.tag?.name).filter(Boolean);

  return {
    id: raw.id,
    title: raw.title ?? '',
    teacher: raw.teacherName ?? raw.teacher?.name ?? 'Narrat',
    teacherLocation: raw.teacherLocation ?? '',
    level: LEVEL_LABELS[level] ?? level,
    modules: raw.moduleCount ?? raw.modules?.length ?? 0,
    duration: raw.totalDuration ? minutesToHuman(raw.totalDuration) : undefined,
    enrolled: raw.enrollCount ?? 0,
    rating: raw.averageRating ?? 4.7,
    progress: 0,
    currentModule: 0,
    heroGradient: gradientForLevel(level),
    coverUrl: resolveMediaUrl(raw.coverUrl),
    tags,
    objectives: raw.objectives ?? [],
    hasAudio: raw.hasAudio ?? false,
    description: raw.description ?? '',
  };
}

export interface CourseModule {
  id: string;
  moduleIndex: number;
  title: string;
  isLocked: boolean;
  audioUrl?: string | null;
  audioDuration?: number | null;
  videoUrl?: string | null;
  videoDuration?: number | null;
  readTime?: number | null;
}

export interface CourseDetail extends DiscoverCourse {
  modulesList: CourseModule[];
}

export interface LessonContent {
  id: string;
  courseId: string;
  moduleIndex: number;
  title: string;
  content: string;
  audioUrl?: string | null;
  audioDuration?: number | null;
}

export interface LessonQuiz {
  id: string;
  module: { id: string; title: string; moduleIndex: number; courseId: string };
  questions: Array<{
    id: string;
    question: string;
    verseRef?: string | null;
    explanation?: string | null;
    answers: Array<{ id: string; text: string; isCorrect: boolean }>;
  }>;
}

export const formationService = {
  getCourses: async (language?: string): Promise<DiscoverCourse[]> => {
    const params = language ? { language } : {};
    const { data } = await api.get('/formation/courses', { params });
    return (data as any[]).map(transformCourse);
  },

  getCourseById: async (id: string): Promise<CourseDetail> => {
    const { data } = await api.get(`/formation/courses/${id}`);
    const course = transformCourse(data);
    const modulesList: CourseModule[] = (data?.modules ?? [])
      .map((m: any) => ({
        id: m.id,
        moduleIndex: m.moduleIndex ?? 0,
        title: m.title ?? '',
        isLocked: !!m.isLocked,
        audioUrl: m.audioUrl ?? null,
        audioDuration: m.audioDuration ?? null,
        videoUrl: m.videoUrl ?? null,
        videoDuration: m.videoDuration ?? null,
        readTime: m.readTime ?? null,
      }))
      .sort((a: CourseModule, b: CourseModule) => a.moduleIndex - b.moduleIndex);

    return { ...course, modulesList };
  },

  getLesson: async (lessonId: string): Promise<LessonContent> => {
    const { data } = await api.get(`/formation/lessons/${lessonId}`);
    return {
      id: data.id,
      courseId: data.courseId,
      moduleIndex: data.moduleIndex ?? 0,
      title: data.title ?? '',
      content: data.content ?? '',
      audioUrl: data.audioUrl ?? null,
      audioDuration: data.audioDuration ?? null,
    };
  },

  getLessonQuiz: async (lessonId: string): Promise<LessonQuiz> => {
    const { data } = await api.get(`/formation/lessons/${lessonId}/quiz`);
    return data as LessonQuiz;
  },
};


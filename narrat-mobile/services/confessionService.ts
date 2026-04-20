import { api } from '../lib/api';

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  PRAYER_REQUEST: { label: 'Prière', color: 'blue' },
  TESTIMONY: { label: 'Témoignage', color: 'green' },
  QUESTION: { label: 'Question', color: 'purple' },
  CONFESSION: { label: 'Confession', color: 'orange' },
  STRUGGLE: { label: 'Combat', color: 'purple' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

export interface Post {
  id: string;
  authorName: string;
  isAnonymous: boolean;
  timeAgo: string;
  type: string;
  typeColor: string;
  body: string;
  verse: string | null;
  verseRef: string | null;
  prayerCount: number;
  replyCount: number;
}

function transformPost(raw: any): Post {
  const typeInfo = TYPE_MAP[raw.type] ?? { label: raw.type, color: 'blue' };
  const isAnon = raw.isAnonymous ?? false;
  return {
    id: raw.id,
    authorName: isAnon ? 'Frère anonyme' : (raw.user?.firstName ?? 'Utilisateur'),
    isAnonymous: isAnon,
    timeAgo: timeAgo(raw.createdAt),
    type: typeInfo.label,
    typeColor: typeInfo.color,
    body: raw.content ?? '',
    verse: raw.verseText ?? null,
    verseRef: raw.verseRef ?? null,
    prayerCount: raw.prayerCount ?? 0,
    replyCount: raw._count?.replies ?? raw.replies?.length ?? 0,
  };
}

export const confessionService = {
  getAll: async (page = 1): Promise<Post[]> => {
    const { data } = await api.get('/confessions', { params: { page } });
    return (data as any[]).map(transformPost);
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/confessions/${id}`);
    return transformPost(data);
  },

  create: async (payload: {
    type: string;
    content: string;
    isAnonymous: boolean;
    visibility: string;
    verseRef?: string;
  }) => {
    const { data } = await api.post('/confessions', payload);
    return transformPost(data);
  },

  pray: async (id: string) => {
    const { data } = await api.post(`/confessions/${id}/pray`);
    return data;
  },

  addReply: async (id: string, payload: { content: string; isAnonymous: boolean }) => {
    const { data } = await api.post(`/confessions/${id}/replies`, payload);
    return data;
  },
};

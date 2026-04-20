import { api } from '../lib/api';

const INTENSITY_MAP: Record<string, string> = {
  LIGHT: 'Débutant',
  MODERATE: 'Modéré',
  INTENSE: 'Intense',
};

const CATEGORY_MAP: Record<string, string> = {
  PURITY: 'Pureté',
  MENTAL_HEALTH: 'Santé mentale',
  PRAYER: 'Prière',
  RESTORATION: 'Restauration',
  FASTING: 'Jeûne',
  EVANGELISM: 'Évangélisation',
  BIBLE_READING: 'Lecture biblique',
  FINANCES: 'Finances',
};

export interface Challenge {
  id: string;
  title: string;
  category: string;
  days: number;
  currentDay: number;
  active: boolean;
  participants: number;
  successRate: number;
  intensity: string;
  description: string;
  userChallengeId?: string;
}

function transformChallenge(raw: any, userChallenge?: any): Challenge {
  return {
    id: raw.id,
    title: raw.title,
    category: CATEGORY_MAP[raw.category] ?? raw.category,
    days: raw.durationDays ?? 30,
    currentDay: userChallenge?.currentDay ?? 0,
    active: userChallenge?.status === 'ACTIVE',
    participants: raw._count?.userChallenges ?? raw.participantCount ?? 0,
    successRate: raw.successRate ?? 70,
    intensity: INTENSITY_MAP[raw.intensity] ?? raw.intensity ?? 'Modéré',
    description: raw.description ?? '',
    userChallengeId: userChallenge?.id,
  };
}

export const challengeService = {
  getAll: async (category?: string): Promise<Challenge[]> => {
    const params = category ? { category } : {};
    const { data } = await api.get('/challenges', { params });
    return (data as any[]).map((c) => transformChallenge(c));
  },

  getMyChallenges: async (): Promise<Challenge[]> => {
    const { data } = await api.get('/challenges/mine');
    return (data as any[]).map((uc: any) => transformChallenge(uc.challenge, uc));
  },

  getById: async (id: string): Promise<Challenge> => {
    const { data } = await api.get(`/challenges/${id}`);
    return transformChallenge(data);
  },

  join: async (challengeId: string) => {
    const { data } = await api.post('/challenges/join', { challengeId });
    return data;
  },

  checkIn: async (payload: { userChallengeId: string; dayNumber: number; notes?: string }) => {
    const { data } = await api.post('/challenges/check-in', payload);
    return data;
  },
};

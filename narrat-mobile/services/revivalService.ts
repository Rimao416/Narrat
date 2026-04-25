import { api } from '../lib/api';

export interface DiscoverRevivalFigure {
  id: string;
  name: string;
  era: string;
  origin: string;
  quote: string;
  tags: string[];
  lifeVerse?: string;
  lifeVerseText?: string;
  featured?: boolean;
}

function transformFigure(raw: any): DiscoverRevivalFigure {
  const authorName =
    raw.author?.firstName || raw.author?.lastName
      ? `${raw.author?.firstName ?? ''} ${raw.author?.lastName ?? ''}`.trim()
      : raw.slug ?? 'Figure';

  return {
    id: raw.id,
    name: authorName,
    era: raw.era ?? raw.ministry ?? '',
    origin: raw.nationality ? raw.nationality : '',
    quote: raw.quotes?.[0]?.text ?? raw.lifeSummary ?? '',
    tags: [],
    lifeVerse: raw.lifeVerse ?? undefined,
    lifeVerseText: raw.lifeSummary ? (raw.lifeSummary as string).slice(0, 120) + '…' : undefined,
    featured: false,
  };
}

export const revivalService = {
  getFigures: async (): Promise<DiscoverRevivalFigure[]> => {
    const { data } = await api.get('/revival/figures');
    return (data as any[]).map(transformFigure);
  },
};


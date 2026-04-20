import { api } from '../lib/api';

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  joined: boolean;
  icon: string;
}

function transformGroup(raw: any): Group {
  return {
    id: raw.id,
    name: raw.name,
    memberCount: raw._count?.members ?? raw.memberCount ?? 0,
    joined: raw.isMember ?? false,
    icon: 'users',
  };
}

export const communityService = {
  getGroups: async (): Promise<Group[]> => {
    const { data } = await api.get('/community/groups');
    return (data as any[]).map(transformGroup);
  },

  joinGroup: async (groupId: string) => {
    const { data } = await api.post(`/community/groups/${groupId}/join`);
    return data;
  },
};

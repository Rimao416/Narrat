import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';
import { setToken, removeToken } from '../lib/tokenStorage';

// Safe storage: AsyncStorage errors are caught so they never bubble up to callers
const safeStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try { return await AsyncStorage.getItem(name); } catch { return null; }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try { await AsyncStorage.setItem(name, value); } catch { /* silent */ }
  },
  removeItem: async (name: string): Promise<void> => {
    try { await AsyncStorage.removeItem(name); } catch { /* silent */ }
  },
};

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  xp: number;
  streakDays: number;
  church?: string | null;
  spiritualLevel?: string | null;
  activeChallengesCount?: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          await setToken(data.token);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (e: any) {
          set({ isLoading: false, error: e.message });
          throw e;
        }
      },

      register: async (firstName, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', { firstName, email, password });
          await setToken(data.token);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (e: any) {
          set({ isLoading: false, error: e.message });
          throw e;
        }
      },

      logout: async () => {
        await removeToken();
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'narrat-auth-storage',
      storage: safeStorage,
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

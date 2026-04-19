import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OnboardingState {
  isCompleted: boolean;
  selectedLanguage: string;
  selectedLevel: string;
  selectedInterests: string[];
  completeOnboarding: () => void;
  setLanguage: (lang: string) => void;
  setLevel: (level: string) => void;
  toggleInterest: (interest: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isCompleted: false,
      selectedLanguage: 'Francais',
      selectedLevel: '',
      selectedInterests: [],

      completeOnboarding: () => set({ isCompleted: true }),

      setLanguage: (lang) => set({ selectedLanguage: lang }),

      setLevel: (level) => set({ selectedLevel: level }),

      toggleInterest: (interest) =>
        set((state) => ({
          selectedInterests: state.selectedInterests.includes(interest)
            ? state.selectedInterests.filter((i) => i !== interest)
            : [...state.selectedInterests, interest],
        })),

      reset: () =>
        set({
          isCompleted: false,
          selectedLanguage: 'Francais',
          selectedLevel: '',
          selectedInterests: [],
        }),
    }),
    {
      name: 'narrat-onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

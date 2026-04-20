import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OnboardingState {
  isCompleted: boolean;
  selectedLanguage: string;
  selectedLevel: string;
  selectedInterests: string[];
  // Credentials temporaires — effacés après inscription
  signupFirstName: string;
  signupEmail: string;
  signupPassword: string;
  completeOnboarding: () => void;
  setLanguage: (lang: string) => void;
  setLevel: (level: string) => void;
  toggleInterest: (interest: string) => void;
  setSignupCredentials: (firstName: string, email: string, password: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isCompleted: false,
      selectedLanguage: 'Francais',
      selectedLevel: '',
      selectedInterests: [],
      signupFirstName: '',
      signupEmail: '',
      signupPassword: '',

      completeOnboarding: () => set({ isCompleted: true }),

      setLanguage: (lang) => set({ selectedLanguage: lang }),

      setLevel: (level) => set({ selectedLevel: level }),

      toggleInterest: (interest) =>
        set((state) => ({
          selectedInterests: state.selectedInterests.includes(interest)
            ? state.selectedInterests.filter((i) => i !== interest)
            : [...state.selectedInterests, interest],
        })),

      setSignupCredentials: (firstName, email, password) =>
        set({ signupFirstName: firstName, signupEmail: email, signupPassword: password }),

      reset: () =>
        set({
          isCompleted: false,
          selectedLanguage: 'Francais',
          selectedLevel: '',
          selectedInterests: [],
          signupFirstName: '',
          signupEmail: '',
          signupPassword: '',
        }),
    }),
    {
      name: 'narrat-onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

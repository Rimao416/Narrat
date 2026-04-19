import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useThemeStore } from '../store/themeStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { getThemeColors } from '../constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isDarkMode } = useThemeStore();
  const { isCompleted } = useOnboardingStore();
  const themeColors = getThemeColors(isDarkMode);

  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
  const customTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: themeColors.background,
      card: themeColors.surface,
      text: themeColors.textMain,
      border: themeColors.border,
    },
  };

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={customTheme}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="book/reader" options={{ headerShown: false }} />
        <Stack.Screen name="audio/player" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="audio/chapters" options={{ headerShown: false }} />
        <Stack.Screen name="challenge/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="challenge/day" options={{ headerShown: false }} />
        <Stack.Screen name="challenge/done" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="course/lesson" options={{ headerShown: false }} />
        <Stack.Screen name="course/quiz" options={{ headerShown: false }} />
        <Stack.Screen name="revival/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="community/new-post" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="community/post/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

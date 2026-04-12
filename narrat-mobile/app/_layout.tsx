import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isDarkMode } = useThemeStore();
  const themeColors = getThemeColors(isDarkMode);

  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
  
  const customTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: themeColors.borderPrimary,
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
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

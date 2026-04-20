import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { COLORS } from '../constants/Colors';
import { useThemeStore } from '../store/themeStore';

export function useThemeColors() {
  const { isDarkMode } = useThemeStore();
  return isDarkMode ? COLORS.dark : COLORS.light;
}

export function useSystemThemeSync() {
  const { setTheme } = useThemeStore();
  useEffect(() => {
    // Ensure app theme always starts from the current device preference.
    setTheme(Appearance.getColorScheme() === 'dark');
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark');
    });
    return () => sub.remove();
  }, [setTheme]);
}

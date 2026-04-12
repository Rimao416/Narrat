export const COLORS = {
  // Brand - Rouges (Signature)
  primary: '#C0392B',
  primaryDeep: '#922B21',
  primaryLight: '#E74C3C',
  primaryGlow: '#FF6B6B',
  primarySoft: '#2D1515',

  // Or (Accents Réveil)
  accentMain: '#D4AF37',
  accentSoft: '#F0D060',

  // Dark Mode
  dark: {
    background: '#0D0D0D',
    backgroundSecondary: '#141414',
    surface: '#1A1A1A',
    surfaceElevated: '#222222',
    surfaceActive: '#2A2A2A',
    textMain: '#F5F5F5',
    textMuted: '#A0A0A0',
    textHint: '#666666',
    border: 'rgba(255, 255, 255, 0.08)',
    borderPrimary: 'rgba(192, 57, 43, 0.3)',
  },

  // Light Mode
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    surface: '#F1F3F5',
    surfaceElevated: '#E9ECEF',
    surfaceActive: '#DEE2E6',
    textMain: '#1A1A1A',
    textMuted: '#666666',
    textHint: '#A0A0A0',
    border: 'rgba(0, 0, 0, 0.08)',
    borderPrimary: 'rgba(192, 57, 43, 0.3)',
  }
};

export const getThemeColors = (isDark: boolean) => {
  return isDark ? COLORS.dark : COLORS.light;
};

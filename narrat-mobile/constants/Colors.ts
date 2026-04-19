export const COLORS = {
  // Brand - Rouge (Signature Narrat)
  primary: '#C0392B',
  primaryDeep: '#922B21',
  primaryLight: '#E74C3C',
  primaryMuted: 'rgba(192, 57, 43, 0.14)',
  primaryBorder: 'rgba(192, 57, 43, 0.28)',

  // Accentuation or
  gold: '#D4AF37',
  goldSoft: '#F0D060',

  // Semantiques
  success: '#5ACD8A',
  successBg: 'rgba(39, 120, 75, 0.13)',
  info: '#6B9FEA',
  infoBg: 'rgba(52, 100, 180, 0.13)',
  warning: '#EFA827',
  warningBg: 'rgba(186, 117, 23, 0.13)',
  purple: '#B07EEA',
  purpleBg: 'rgba(120, 60, 180, 0.13)',

  // Dark Mode (mode par defaut)
  dark: {
    bg: '#0D0D0D',
    bg2: '#141414',
    surface: '#1A1A1A',
    surfaceElevated: '#222222',
    surfaceActive: '#2A2A2A',
    text: '#F0F0F0',
    textMuted: '#909090',
    textHint: '#555555',
    border: 'rgba(255, 255, 255, 0.07)',
    border2: 'rgba(255, 255, 255, 0.12)',
    // Aliases semantiques
    background: '#0D0D0D',
    backgroundSecondary: '#141414',
    textMain: '#F0F0F0',
    textSecondary: '#909090',
    borderPrimary: 'rgba(192, 57, 43, 0.28)',
  },

  // Light Mode
  light: {
    bg: '#FFFFFF',
    bg2: '#F8F9FA',
    surface: '#F1F3F5',
    surfaceElevated: '#E9ECEF',
    surfaceActive: '#DEE2E6',
    text: '#1A1A1A',
    textMuted: '#666666',
    textHint: '#A0A0A0',
    border: 'rgba(0, 0, 0, 0.08)',
    border2: 'rgba(0, 0, 0, 0.14)',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    textMain: '#1A1A1A',
    textSecondary: '#666666',
    borderPrimary: 'rgba(192, 57, 43, 0.3)',
  },
};

export const getThemeColors = (isDark: boolean) => {
  return isDark ? COLORS.dark : COLORS.light;
};

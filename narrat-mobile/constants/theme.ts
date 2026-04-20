// Design System Narrat — Tokens

export const FONTS = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  card: 18,
  full: 999,
};

export const TYPOGRAPHY = {
  // ── Display ──────────────────────────────────────────────────────
  display: {
    fontFamily: FONTS.extraBold,
    fontSize: 48,
    letterSpacing: -1.5,
    lineHeight: 58,
  },

  // ── Headings ─────────────────────────────────────────────────────
  h1: {
    fontFamily: FONTS.bold,
    fontSize: 30,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h3: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  h4: {
    fontFamily: FONTS.semiBold,
    fontSize: 17,
    letterSpacing: 0,
    lineHeight: 24,
  },
  h5: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 22,
  },

  // ── Subtitles ─────────────────────────────────────────────────────
  subtitle1: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    letterSpacing: 0.1,
    lineHeight: 24,
  },
  subtitle2: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    letterSpacing: 0.1,
    lineHeight: 20,
  },

  // ── Body ──────────────────────────────────────────────────────────
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    letterSpacing: 0.15,
    lineHeight: 26,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 18,
  },

  // ── UI ────────────────────────────────────────────────────────────
  button: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  labelMd: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // ── Small ─────────────────────────────────────────────────────────
  caption: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  overline: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  micro: {
    fontFamily: FONTS.semiBold,
    fontSize: 9,
    letterSpacing: 0.4,
  },
};

export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
};

export const SHADOW = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  hero: {
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
};

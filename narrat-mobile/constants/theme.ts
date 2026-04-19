// Design System Narrat — Tokens

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
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700' as const },
  h4: { fontSize: 15, fontWeight: '600' as const },
  bodyLarge: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 13, fontWeight: '400' as const, lineHeight: 21 },
  caption: { fontSize: 11, fontWeight: '400' as const },
  label: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
  micro: { fontSize: 9, fontWeight: '600' as const, letterSpacing: 0.4 },
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

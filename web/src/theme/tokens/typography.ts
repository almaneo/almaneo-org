/**
 * NEOS Typography System
 * Sans-serif + Serif 혼용으로 기술과 인문의 조화를 표현
 */

export const typography = {
  // Font Families
  fontFamily: {
    // Primary - Technical, modern (sans-serif)
    montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
    // Secondary - Humanistic, Korean support
    pretendard: ['Pretendard', 'system-ui', 'sans-serif'],
    // Serif for philosophical/emotional content
    serif: ['Georgia', 'Cambria', 'serif'],
    // System fallback
    system: ['system-ui', '-apple-system', 'sans-serif'],
  },

  // Font Sizes (rem-based for accessibility)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],       // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1.1' }],        // 48px
    '6xl': ['3.75rem', { lineHeight: '1.1' }],     // 60px
    '7xl': ['4.5rem', { lineHeight: '1.1' }],      // 72px
    '8xl': ['6rem', { lineHeight: '1' }],          // 96px - Hero headlines
  },

  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export type TypographyToken = typeof typography;

/**
 * NEOS Gradient System
 * Cold -> Warm transition gradients embodying "Cold Code, Warm Soul"
 */

export const gradients = {
  // Primary brand gradient (Cold -> Warm transition)
  brand: {
    primary: 'linear-gradient(135deg, #0052FF 0%, #FF6B00 100%)',
    reversed: 'linear-gradient(135deg, #FF6B00 0%, #0052FF 100%)',
    vertical: 'linear-gradient(180deg, #0052FF 0%, #FF6B00 100%)',
  },

  // Background gradients
  background: {
    main: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    dark: 'linear-gradient(135deg, #0A0F1A 0%, #0f172a 100%)',
    warmOverlay: 'linear-gradient(180deg, transparent, rgba(251,146,60,0.05), transparent)',
    coldOverlay: 'linear-gradient(180deg, transparent, rgba(96,165,250,0.05), transparent)',
    warmBottom: 'linear-gradient(180deg, transparent, rgba(251,146,60,0.1))',
  },

  // Text gradients (for gradient-text effect)
  text: {
    warmSoul: 'linear-gradient(135deg, #3b82f6 0%, #f97316 100%)', // gradient-text
    coldCode: 'linear-gradient(135deg, #0052FF 0%, #60a5fa 100%)',
    jeong: 'linear-gradient(135deg, #FF6B00 0%, #FB923C 100%)',
    rainbow: 'linear-gradient(135deg, #0052FF 0%, #a855f7 50%, #FF6B00 100%)',
  },

  // Button gradients
  button: {
    primary: 'linear-gradient(135deg, #f97316, #ea580c)',
    primaryHover: 'linear-gradient(135deg, #ea580c, #c2410c)',
    secondary: 'linear-gradient(135deg, #0052FF, #1d4ed8)',
    secondaryHover: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
  },

  // Radial gradients for ambient effects
  radial: {
    blue: 'radial-gradient(circle, #0052FF 0%, transparent 70%)',
    orange: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)',
    warmGlow: 'radial-gradient(circle, rgba(255,107,0,0.5) 0%, transparent 70%)',
    coldGlow: 'radial-gradient(circle, rgba(0,82,255,0.5) 0%, transparent 70%)',
  },

  // Card gradients
  card: {
    warm: 'linear-gradient(180deg, rgba(251,146,60,0.1), transparent)',
    cold: 'linear-gradient(180deg, rgba(96,165,250,0.1), transparent)',
    success: 'linear-gradient(180deg, rgba(74,222,128,0.1), transparent)',
    purple: 'linear-gradient(180deg, rgba(167,139,250,0.1), transparent)',
  },

  // Heartbeat line gradient (SVG)
  heartbeat: {
    id: 'heartGradient',
    stops: [
      { offset: '0%', color: '#0052FF' },
      { offset: '50%', color: '#FF6B00' },
      { offset: '100%', color: '#0052FF' },
    ],
  },
} as const;

export type GradientToken = typeof gradients;

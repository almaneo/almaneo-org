/**
 * NEOS Animation System
 * Signature animations for "Cold Code, Warm Soul" experience
 */

export const keyframes = {
  // Signature Animation - Heartbeat (정 symbol)
  heartbeat: {
    '0%, 100%': { transform: 'scale(1)' },
    '14%': { transform: 'scale(1.15)' },
    '28%': { transform: 'scale(1)' },
    '42%': { transform: 'scale(1.15)' },
    '70%': { transform: 'scale(1)' },
  },

  // Orange Glow - Warmth indicator
  glow: {
    '0%, 100%': {
      boxShadow: '0 0 20px rgba(255, 107, 0, 0.4), 0 0 40px rgba(255, 107, 0, 0.2)',
    },
    '50%': {
      boxShadow: '0 0 30px rgba(255, 107, 0, 0.6), 0 0 60px rgba(255, 107, 0, 0.3)',
    },
  },

  // Blue Glow - Tech indicator
  'glow-blue': {
    '0%, 100%': {
      boxShadow: '0 0 20px rgba(0, 82, 255, 0.4), 0 0 40px rgba(0, 82, 255, 0.2)',
    },
    '50%': {
      boxShadow: '0 0 30px rgba(0, 82, 255, 0.6), 0 0 60px rgba(0, 82, 255, 0.3)',
    },
  },

  // Kindness Ripple - Click feedback
  ripple: {
    '0%': { transform: 'scale(0)', opacity: '1' },
    '100%': { transform: 'scale(3)', opacity: '0' },
  },

  // Floating - Subtle movement
  float: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },

  // Dash - For SVG path animation (Heartbeat line)
  dash: {
    '0%': { strokeDashoffset: '600' },
    '50%': { strokeDashoffset: '0' },
    '100%': { strokeDashoffset: '-600' },
  },

  // Pulse - Subtle breathing effect
  'pulse-slow': {
    '0%, 100%': { opacity: '0.6' },
    '50%': { opacity: '1' },
  },

  // Fade In Up - Entrance animation
  'fade-in-up': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },

  // Fade In - Simple opacity
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },

  // Slide In from right - For modals/sheets
  'slide-in-right': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' },
  },

  // Slide In from bottom
  'slide-in-up': {
    '0%': { transform: 'translateY(100%)' },
    '100%': { transform: 'translateY(0)' },
  },

  // Scale In - For modals/popups
  'scale-in': {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },

  // Shimmer - Loading effect
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
} as const;

export const animations = {
  heartbeat: 'heartbeat 1.5s ease-in-out infinite',
  glow: 'glow 2s ease-in-out infinite',
  'glow-blue': 'glow-blue 2s ease-in-out infinite',
  ripple: 'ripple 1s ease-out forwards',
  float: 'float 4s ease-in-out infinite',
  dash: 'dash 3s ease-in-out infinite',
  'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
  'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
  'fade-in': 'fade-in 0.3s ease-out forwards',
  'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
  'slide-in-up': 'slide-in-up 0.3s ease-out forwards',
  'scale-in': 'scale-in 0.2s ease-out forwards',
  shimmer: 'shimmer 2s linear infinite',
} as const;

export type KeyframeToken = typeof keyframes;
export type AnimationToken = typeof animations;

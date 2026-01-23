/**
 * NEOS Color Token System
 * Based on "Cold Code, Warm Soul" design philosophy
 *
 * Cold (기술): 딥 네이비, 일렉트릭 블루 - 데이터와 AI의 정교함
 * Warm (인간): 테라코타 오렌지, 샌드 골드, 소프트 베이지 - 따뜻한 체온과 정(情)의 느낌
 */

export const colors = {
  // === COLD SPECTRUM (Technology/AI) ===
  cold: {
    // Deep Navy - Base dark backgrounds
    navy: {
      900: '#0A0F1A',  // Darkest - main background
      800: '#0f172a',  // Current background
      700: '#1e293b',  // Cards, elevated surfaces
      600: '#334155',  // Borders, dividers
      500: '#475569',  // Muted text
    },
    // Electric Blue - Primary accent (NEOS Blue)
    blue: {
      600: '#0044CC',  // Darker for hover
      500: '#0052FF',  // neos-blue - Primary brand
      400: '#3b82f6',  // Lighter accent
      300: '#60a5fa',  // Text accents
      200: '#93c5fd',  // Subtle highlights
      100: '#dbeafe',  // Very light backgrounds
    },
    // Cyber accents
    cyan: {
      500: '#06b6d4',  // Tech highlights
      400: '#22d3ee',
    },
  },

  // === WARM SPECTRUM (Human/Jeong) ===
  warm: {
    // Terracotta Orange - Jeong Orange
    orange: {
      700: '#c2410c',  // Darkest
      600: '#ea580c',  // Darker for hover states
      500: '#FF6B00',  // jeong-orange - Primary warm
      400: '#f97316',  // Standard orange
      300: '#FB923C',  // Lighter accent
      200: '#fed7aa',  // Subtle warm tints
      100: '#fff7ed',  // Very light warm
    },
    // Sand Gold - Warmth and premium
    gold: {
      500: '#d4a574',  // Gold accent
      400: '#e4b896',
      300: '#f5d5b8',
    },
    // Soft Beige - Human warmth
    beige: {
      500: '#d4c4b0',
      400: '#e8ddd0',
      300: '#f5f0eb',
    },
  },

  // === SEMANTIC COLORS ===
  semantic: {
    success: '#4ade80',  // Green for positive states
    warning: '#facc15',  // Yellow for warnings
    error: '#f87171',    // Red for errors
    info: '#60a5fa',     // Blue for information
  },

  // === NEUTRALS ===
  neutral: {
    white: '#FFFFFF',
    humanityWhite: '#F8F9FA',
    sapiensGray: '#212529',
    black: '#000000',
  },

  // === TEXT COLORS ===
  text: {
    primary: '#e2e8f0',    // Main text
    secondary: '#cbd5e1',  // Secondary text
    muted: '#94a3b8',      // Muted text
    subtle: '#64748b',     // Subtle text (labels, captions)
  },
} as const;

// Type exports for TypeScript support
export type ColorToken = typeof colors;
export type ColdColors = typeof colors.cold;
export type WarmColors = typeof colors.warm;
export type SemanticColors = typeof colors.semantic;

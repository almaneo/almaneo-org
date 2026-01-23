/**
 * NEOS Theme System
 * "Cold Code, Warm Soul" - AI democratization platform
 *
 * Design Philosophy:
 * - Cold (기술): 딥 네이비, 일렉트릭 블루 - 데이터와 AI의 정교함
 * - Warm (인간): 테라코타 오렌지, 샌드 골드 - 따뜻한 체온과 정(情)의 느낌
 */

// Token exports
export { colors, typography, spacing, borderRadius } from './tokens';
export type {
  ColorToken,
  ColdColors,
  WarmColors,
  SemanticColors,
  TypographyToken,
  SpacingToken,
  BorderRadiusToken,
} from './tokens';

// Animation exports
export { keyframes, animations } from './animations';
export type { KeyframeToken, AnimationToken } from './animations';

// Gradient exports
export { gradients } from './gradients';
export type { GradientToken } from './gradients';

// Type definitions for components
export type Temperature = 'cold' | 'warm' | 'neutral';

export type SectionId =
  | 'abstract'
  | 'problem'
  | 'philosophy'
  | 'solution'
  | 'technical'
  | 'tokenomics'
  | 'expansion'
  | 'kindness-expo';

export type FeatureArea =
  | 'gaii'
  | 'ai-hub'
  | 'kindness-protocol'
  | 'governance'
  | 'staking'
  | 'nft';

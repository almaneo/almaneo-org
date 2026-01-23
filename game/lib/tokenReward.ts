/**
 * Token Reward System
 * ALMAN Carbon Farm - Game Points to ALMAN Token Conversion
 *
 * Integrated with Mining System for Dynamic Conversion Rate
 */

import {
  getCurrentConversionRate,
  calculateMinableTokens,
  canMineTokens,
  BASE_CONVERSION_RATE,
} from './tokenMining';

// ============================================================================
// Constants
// ============================================================================

/**
 * 게임 포인트 → ALMAN 토큰 변환 비율 (기본값)
 * 실제 변환은 마이닝 난이도에 따라 동적으로 결정
 */
export const TOKEN_CONVERSION_RATE = BASE_CONVERSION_RATE; // 10,000 (초기)

/**
 * 최소 청구 가능 토큰 (0.1 ALMAN)
 */
export const MIN_CLAIMABLE_TOKENS = 0.1;

/**
 * 최소 청구 가능 포인트 (동적)
 */
export function getMinClaimablePoints(totalMined: number): number {
  const currentRate = getCurrentConversionRate(totalMined);
  return currentRate * MIN_CLAIMABLE_TOKENS;
}

// ============================================================================
// Core Functions (Legacy - Fixed Rate)
// ============================================================================

/**
 * 게임 포인트를 ALMAN 토큰으로 변환 (고정 비율)
 * @deprecated Use calculateTokenRewardWithMining for dynamic rate
 * @param gamePoints - 게임 포인트
 * @returns ALMAN 토큰 수량
 */
export function calculateTokenReward(gamePoints: number): number {
  if (gamePoints <= 0) return 0;
  return gamePoints / TOKEN_CONVERSION_RATE;
}

// ============================================================================
// Core Functions (Mining-based - Dynamic Rate)
// ============================================================================

/**
 * 게임 포인트를 ALMAN 토큰으로 변환 (동적 비율)
 * @param gamePoints - 게임 포인트
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns ALMAN 토큰 수량
 */
export function calculateTokenRewardWithMining(
  gamePoints: number,
  totalMined: number
): number {
  return calculateMinableTokens(gamePoints, totalMined);
}

/**
 * 청구 가능한 토큰 계산 (동적 비율)
 * @param currentPoints - 현재 총 게임 포인트
 * @param lastClaimedPoints - 마지막 청구 시 포인트
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 청구 가능한 ALMAN 토큰 수량
 */
export function getClaimableTokensWithMining(
  currentPoints: number,
  lastClaimedPoints: number,
  totalMined: number
): number {
  const pointsDiff = currentPoints - lastClaimedPoints;
  if (pointsDiff <= 0) return 0;
  
  return calculateTokenRewardWithMining(pointsDiff, totalMined);
}

/**
 * 청구 가능 여부 확인 (동적 비율)
 * @param currentPoints - 현재 총 게임 포인트
 * @param lastClaimedPoints - 마지막 청구 시 포인트
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 청구 가능 여부
 */
export function canClaimTokensWithMining(
  currentPoints: number,
  lastClaimedPoints: number,
  totalMined: number
): boolean {
  const claimable = getClaimableTokensWithMining(
    currentPoints,
    lastClaimedPoints,
    totalMined
  );
  
  // 채굴 한도 체크
  if (!canMineTokens(totalMined, claimable)) {
    return false;
  }
  
  return claimable >= MIN_CLAIMABLE_TOKENS;
}

/**
 * 다음 청구까지 필요한 포인트 (동적 비율)
 * @param currentPoints - 현재 총 게임 포인트
 * @param lastClaimedPoints - 마지막 청구 시 포인트
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 필요한 포인트 수
 */
export function getPointsUntilNextClaimWithMining(
  currentPoints: number,
  lastClaimedPoints: number,
  totalMined: number
): number {
  const pointsDiff = currentPoints - lastClaimedPoints;
  const minPoints = getMinClaimablePoints(totalMined);
  const pointsNeeded = minPoints - pointsDiff;
  
  return pointsNeeded > 0 ? pointsNeeded : 0;
}

// ============================================================================
// Legacy Functions (Backward Compatibility)
// ============================================================================

/**
 * 청구 가능한 토큰 계산 (고정 비율)
 * @deprecated Use getClaimableTokensWithMining for dynamic rate
 */
export function getClaimableTokens(
  currentPoints: number,
  lastClaimedPoints: number
): number {
  const pointsDiff = currentPoints - lastClaimedPoints;
  if (pointsDiff <= 0) return 0;
  
  return calculateTokenReward(pointsDiff);
}

/**
 * 청구 가능 여부 확인 (고정 비율)
 * @deprecated Use canClaimTokensWithMining for dynamic rate
 */
export function canClaimTokens(
  currentPoints: number,
  lastClaimedPoints: number
): boolean {
  const claimable = getClaimableTokens(currentPoints, lastClaimedPoints);
  return claimable >= MIN_CLAIMABLE_TOKENS;
}

/**
 * 다음 청구까지 필요한 포인트 (고정 비율)
 * @deprecated Use getPointsUntilNextClaimWithMining for dynamic rate
 */
export function getPointsUntilNextClaim(
  currentPoints: number,
  lastClaimedPoints: number
): number {
  const pointsDiff = currentPoints - lastClaimedPoints;
  const pointsNeeded = (TOKEN_CONVERSION_RATE * MIN_CLAIMABLE_TOKENS) - pointsDiff;
  
  return pointsNeeded > 0 ? pointsNeeded : 0;
}

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * 토큰 수량을 포맷팅
 * @param amount - 토큰 수량
 * @param decimals - 소수점 자리수 (기본: 2)
 * @returns 포맷팅된 문자열
 * @example
 * formatTokenAmount(1.5) // "1.50 ALMAN"
 * formatTokenAmount(0.05, 3) // "0.050 ALMAN"
 */
export function formatTokenAmount(amount: number, decimals: number = 2): string {
  return `${amount.toFixed(decimals)} ALMAN`;
}

/**
 * 게임 포인트를 포맷팅 (천 단위 콤마)
 * @param points - 게임 포인트
 * @returns 포맷팅된 문자열
 * @example
 * formatGamePoints(10000) // "10,000"
 * formatGamePoints(1234567) // "1,234,567"
 */
export function formatGamePoints(points: number): string {
  return points.toLocaleString('en-US');
}

/**
 * 변환 비율 정보 문자열
 * @returns 변환 비율 설명
 */
export function getConversionRateInfo(): string {
  return `${formatGamePoints(TOKEN_CONVERSION_RATE)} Game Points = 1 ALMAN Token`;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 토큰 청구 기록 생성
 * @param userId - 사용자 ID
 * @param amount - 청구한 토큰 수량
 * @param pointsUsed - 사용된 포인트
 * @returns 청구 기록 객체
 */
export interface TokenClaimRecord {
  userId: string;
  amount: number;
  pointsUsed: number;
  timestamp: number;
  transactionHash?: string;
}

export function createClaimRecord(
  userId: string,
  amount: number,
  pointsUsed: number,
  transactionHash?: string
): TokenClaimRecord {
  return {
    userId,
    amount,
    pointsUsed,
    timestamp: Date.now(),
    transactionHash,
  };
}

/**
 * 예상 토큰 수량 계산 (미래 포인트 기준)
 * @param futurePoints - 미래 예상 포인트
 * @param currentPoints - 현재 포인트
 * @param lastClaimedPoints - 마지막 청구 포인트
 * @returns 예상 추가 토큰 수량
 */
export function estimateFutureTokens(
  futurePoints: number,
  currentPoints: number,
  lastClaimedPoints: number
): number {
  const currentClaimable = getClaimableTokens(currentPoints, lastClaimedPoints);
  const futureClaimable = getClaimableTokens(futurePoints, lastClaimedPoints);
  
  return futureClaimable - currentClaimable;
}

// ============================================================================
// Export All
// ============================================================================

export default {
  // Constants
  TOKEN_CONVERSION_RATE,
  MIN_CLAIMABLE_TOKENS,
  getMinClaimablePoints,
  
  // Mining-based (Dynamic) - Recommended
  calculateTokenRewardWithMining,
  getClaimableTokensWithMining,
  canClaimTokensWithMining,
  getPointsUntilNextClaimWithMining,
  
  // Legacy (Fixed Rate) - Deprecated
  calculateTokenReward,
  getClaimableTokens,
  canClaimTokens,
  getPointsUntilNextClaim,
  
  // Formatting
  formatTokenAmount,
  formatGamePoints,
  getConversionRateInfo,
  
  // Utility
  createClaimRecord,
  estimateFutureTokens,
};

/**
 * Token Mining System
 * ALMAN Kindness Game - Halving-based Mining Rewards
 *
 * Total Mining Pool: 800,000,000 ALMAN (10% of 8B total supply)
 * Halving Strategy: 4 epochs with increasing difficulty
 */

// ============================================================================
// Constants
// ============================================================================

/**
 * 채굴 풀 총량 (800M ALMAN - 전체 8B의 10%)
 */
export const MINING_POOL_TOTAL = 800_000_000;

/**
 * 반감기 단계 (Halving Epochs)
 */
export const HALVING_EPOCHS = [
  {
    epoch: 1,
    start: 0,
    end: 200_000_000,      // 0 - 200M
    rate: 10_000,          // 10,000 포인트 = 1 ALMAN
    label: 'Genesis Era (정의 시작)',
  },
  {
    epoch: 2,
    start: 200_000_000,
    end: 400_000_000,      // 200M - 400M
    rate: 20_000,          // 20,000 포인트 = 1 ALMAN
    label: 'First Halving (따뜻함의 확산)',
  },
  {
    epoch: 3,
    start: 400_000_000,
    end: 600_000_000,      // 400M - 600M
    rate: 40_000,          // 40,000 포인트 = 1 ALMAN
    label: 'Second Halving (연결의 시대)',
  },
  {
    epoch: 4,
    start: 600_000_000,
    end: 800_000_000,      // 600M - 800M
    rate: 80_000,          // 80,000 포인트 = 1 ALMAN
    label: 'Final Halving (정(情)의 완성)',
  },
] as const;

/**
 * 초기 변환 비율
 */
export const BASE_CONVERSION_RATE = 10_000;

// ============================================================================
// Core Mining Functions
// ============================================================================

/**
 * 현재 반감기 단계 조회
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 현재 반감기 정보
 */
export function getCurrentEpoch(totalMined: number) {
  for (const epoch of HALVING_EPOCHS) {
    if (totalMined >= epoch.start && totalMined < epoch.end) {
      return epoch;
    }
  }

  // 채굴 완료
  return null;
}

/**
 * 현재 변환 비율 조회
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 포인트 → 토큰 변환 비율
 */
export function getCurrentConversionRate(totalMined: number): number {
  const epoch = getCurrentEpoch(totalMined);

  if (!epoch) {
    // 채굴 완료 - 최대 비율 반환
    return HALVING_EPOCHS[HALVING_EPOCHS.length - 1].rate;
  }

  return epoch.rate;
}

/**
 * 게임 포인트로 채굴 가능한 토큰 계산
 * @param gamePoints - 게임 포인트
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 채굴 가능한 ALMAN 토큰
 */
export function calculateMinableTokens(
  gamePoints: number,
  totalMined: number
): number {
  if (gamePoints <= 0) return 0;

  const rate = getCurrentConversionRate(totalMined);
  return gamePoints / rate;
}

/**
 * 채굴 가능 여부 확인
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @param amountToMine - 채굴하려는 토큰 양
 * @returns 채굴 가능 여부
 */
export function canMineTokens(
  totalMined: number,
  amountToMine: number
): boolean {
  return totalMined + amountToMine <= MINING_POOL_TOTAL;
}

/**
 * 남은 채굴 가능 토큰
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 남은 토큰 양
 */
export function getRemainingMiningPool(totalMined: number): number {
  return Math.max(0, MINING_POOL_TOTAL - totalMined);
}

/**
 * 채굴 진행률 (%)
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 진행률 (0-100)
 */
export function getMiningProgress(totalMined: number): number {
  return Math.min(100, (totalMined / MINING_POOL_TOTAL) * 100);
}

/**
 * 다음 반감기까지 남은 토큰
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 남은 토큰, null이면 마지막 단계
 */
export function getTokensUntilNextHalving(totalMined: number): number | null {
  const currentEpoch = getCurrentEpoch(totalMined);

  if (!currentEpoch) return null; // 채굴 완료
  if (currentEpoch.epoch === 4) return null; // 마지막 단계

  return currentEpoch.end - totalMined;
}

// ============================================================================
// Statistics & Info
// ============================================================================

/**
 * 채굴 통계 정보
 */
export interface MiningStats {
  totalMined: number;
  remainingPool: number;
  progress: number;
  currentEpoch: typeof HALVING_EPOCHS[number] | null;
  currentRate: number;
  tokensUntilHalving: number | null;
  isMiningComplete: boolean;
}

/**
 * 채굴 통계 조회
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 채굴 통계 객체
 */
export function getMiningStats(totalMined: number): MiningStats {
  return {
    totalMined,
    remainingPool: getRemainingMiningPool(totalMined),
    progress: getMiningProgress(totalMined),
    currentEpoch: getCurrentEpoch(totalMined),
    currentRate: getCurrentConversionRate(totalMined),
    tokensUntilHalving: getTokensUntilNextHalving(totalMined),
    isMiningComplete: totalMined >= MINING_POOL_TOTAL,
  };
}

/**
 * 사용자 채굴 예상치 계산
 * @param gamePoints - 사용자 게임 포인트
 * @param totalMined - 현재까지 채굴된 총 토큰
 * @returns 예상 보상
 */
export interface MiningEstimate {
  tokensToReceive: number;
  pointsRequired: number;
  currentRate: number;
  canMine: boolean;
  epochInfo: string;
}

export function estimateMiningReward(
  gamePoints: number,
  totalMined: number
): MiningEstimate {
  const currentEpoch = getCurrentEpoch(totalMined);
  const currentRate = getCurrentConversionRate(totalMined);
  const tokensToReceive = calculateMinableTokens(gamePoints, totalMined);
  const canMine = canMineTokens(totalMined, tokensToReceive);

  return {
    tokensToReceive,
    pointsRequired: currentRate,
    currentRate,
    canMine,
    epochInfo: currentEpoch
      ? `${currentEpoch.label} (Epoch ${currentEpoch.epoch})`
      : 'Mining Complete',
  };
}

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * 채굴 진행률 포맷팅
 */
export function formatMiningProgress(totalMined: number): string {
  const progress = getMiningProgress(totalMined);
  return `${progress.toFixed(2)}%`;
}

/**
 * 남은 풀 포맷팅
 */
export function formatRemainingPool(totalMined: number): string {
  const remaining = getRemainingMiningPool(totalMined);
  return `${remaining.toLocaleString('en-US')} ALMAN`;
}

/**
 * 변환 비율 포맷팅
 */
export function formatConversionRate(rate: number): string {
  return `${rate.toLocaleString('en-US')} Points = 1 ALMAN`;
}

// ============================================================================
// Export All
// ============================================================================

export default {
  MINING_POOL_TOTAL,
  HALVING_EPOCHS,
  BASE_CONVERSION_RATE,
  getCurrentEpoch,
  getCurrentConversionRate,
  calculateMinableTokens,
  canMineTokens,
  getRemainingMiningPool,
  getMiningProgress,
  getTokensUntilNextHalving,
  getMiningStats,
  estimateMiningReward,
  formatMiningProgress,
  formatRemainingPool,
  formatConversionRate,
};

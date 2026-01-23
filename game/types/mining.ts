/**
 * Mining System Types
 * MiMiG Carbon Farm Game
 */

/**
 * 글로벌 채굴 통계 (Firestore)
 * Collection: miningStats (singleton document)
 */
export interface GlobalMiningStats {
  totalMined: number;           // 전체 채굴된 토큰
  lastUpdated: number;          // 마지막 업데이트 (Unix timestamp)
  totalMiners: number;          // 총 채굴자 수
  totalClaims: number;          // 총 청구 횟수
}

/**
 * 사용자별 채굴 기록 (Firestore)
 * Subcollection: miningStats/global/users/{userId}
 */
export interface UserMiningRecord {
  userId: string;
  totalMined: number;           // 개인 채굴 토큰
  totalClaims: number;          // 개인 청구 횟수
  firstMineTime: number;        // 첫 채굴 시간
  lastMineTime: number;         // 마지막 채굴 시간
  claimHistory: MiningClaim[];  // 청구 이력
}

/**
 * 개별 채굴 청구 기록
 */
export interface MiningClaim {
  claimId: string;
  amount: number;               // 채굴된 토큰
  pointsUsed: number;           // 사용된 포인트
  conversionRate: number;       // 당시 변환 비율
  epoch: number;                // 반감기 단계
  timestamp: number;            // 청구 시간
  transactionHash?: string;     // 트랜잭션 해시
}

/**
 * 채굴 가능 여부 체크 결과
 */
export interface MiningEligibility {
  canMine: boolean;
  reason?: string;              // 불가 사유
  minPoints?: number;           // 최소 필요 포인트
  maxTokens?: number;           // 최대 채굴 가능
}

/**
 * 채굴 시뮬레이션 결과
 */
export interface MiningSimulation {
  currentPoints: number;
  currentRate: number;
  tokensToReceive: number;
  afterTotalMined: number;
  willTriggerHalving: boolean;
  nextEpochRate?: number;
}

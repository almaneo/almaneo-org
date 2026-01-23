/**
 * Mining Statistics Types for Firestore Integration
 * 
 * Session 93: globalTotalMined 실제 구현
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 글로벌 채굴 통계
 * Collection: miningStats/global
 */
export interface GlobalMiningStats {
  /** 전체 채굴량 (MiMiG) */
  totalMined: number;

  /** 총 참여 사용자 수 */
  totalUsers: number;

  /** 마지막 업데이트 시각 */
  lastUpdated: Timestamp;

  /** 총 청구 횟수 */
  totalClaims: number;

  /** 평균 청구 금액 (MiMiG) */
  averageClaimSize: number;
}

/**
 * 일일 채굴 통계
 * Collection: miningStats/daily/{date}
 */
export interface DailyMiningStats {
  /** 날짜 (YYYY-MM-DD) */
  date: string;

  /** 일일 채굴량 (MiMiG) */
  dailyMined: number;

  /** 일일 활성 사용자 수 */
  dailyUsers: number;

  /** 일일 청구 횟수 */
  dailyClaims: number;

  /** 타임스탬프 */
  timestamp: Timestamp;
}

/**
 * 사용자 마이닝 이력
 * Collection: miningStats/users/{userId}
 */
export interface UserMiningHistory {
  /** 사용자 ID */
  userId: string;

  /** 총 채굴량 (MiMiG) */
  totalMined: number;

  /** 총 청구 횟수 */
  totalClaims: number;

  /** 첫 청구 시각 */
  firstClaimAt: Timestamp;

  /** 마지막 청구 시각 */
  lastClaimAt: Timestamp;

  /** 청구 기록 (최근 10개) */
  recentClaims: ClaimRecord[];
}

/**
 * 개별 청구 기록
 */
export interface ClaimRecord {
  /** 청구 금액 (MiMiG) */
  amount: number;

  /** 소모된 포인트 */
  points: number;

  /** 청구 시각 */
  timestamp: Timestamp;

  /** 트랜잭션 해시 (선택) */
  txHash?: string;

  /** 변환율 (pts per MiMiG) */
  conversionRate: number;

  /** Epoch 번호 */
  epoch: number;
}

/**
 * Firestore용 Global Stats 초기값
 */
export const INITIAL_GLOBAL_STATS: Omit<GlobalMiningStats, 'lastUpdated'> = {
  totalMined: 0,
  totalUsers: 0,
  totalClaims: 0,
  averageClaimSize: 0,
};

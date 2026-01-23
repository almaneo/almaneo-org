/**
 * NEOS User Types
 * 사용자 관련 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 사용자 프로필
 */
export interface UserProfile {
  nickname: string;
  avatar: string | null;
  bio?: string;
}

/**
 * 사용자 설정
 */
export interface UserSettings {
  language: 'ko' | 'en' | 'zh' | 'ja' | 'th' | 'id' | 'km' | 'vi' | 'hi' | 'sw' | 'pt';
  notifications: boolean;
  theme?: 'light' | 'dark' | 'system';
}

/**
 * 사용자 정보
 */
export interface User {
  walletAddress: string;
  profile: UserProfile;
  kindnessScore: number;
  totalPoints: number;
  level: number;
  settings: UserSettings;

  // Jeong-SBT 관련
  jeongSbtTokenId?: string;
  jeongTier?: 'bronze' | 'silver' | 'gold' | 'diamond';

  // 스테이킹 관련
  stakedAmount?: number;
  stakingTier?: 'bronze' | 'silver' | 'gold' | 'diamond';

  // 타임스탬프
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

/**
 * 리더보드 항목
 */
export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  nickname: string;
  totalPoints: number;
  level: number;
  kindnessScore?: number;
  updatedAt: Timestamp;
}

/**
 * 친절 활동 타입
 */
export type KindnessActivityType =
  | 'mentoring'        // 멘토링 제공
  | 'knowledge_share'  // 지식 공유 (튜토리얼, 가이드)
  | 'translation'      // 번역 기여
  | 'community_help'   // 커뮤니티 지원
  | 'social_impact'    // 사회 공헌 (AI 활용 문제 해결)
  | 'referral'         // 친구 초대
  | 'daily_checkin'    // 일일 체크인
  | 'quest_complete';  // 퀘스트 완료

/**
 * 친절 활동 기록
 */
export interface KindnessActivity {
  id: string;
  userId: string;  // walletAddress
  type: KindnessActivityType;
  description: string;
  points: number;
  verified: boolean;
  verifiedBy?: string;  // 검증자 주소
  proofUrl?: string;    // 증거 URL
  txHash?: string;      // 온체인 기록 트랜잭션
  createdAt: Timestamp;
}

/**
 * Kindness Score 계산 포인트
 */
export const KINDNESS_POINTS = {
  mentoring: { min: 10, max: 50 },
  knowledge_share: { min: 20, max: 100 },
  translation: { min: 15, max: 80 },
  community_help: { min: 5, max: 30 },
  social_impact: { min: 50, max: 200 },
  referral: { min: 10, max: 30 },
  daily_checkin: { min: 1, max: 5 },
  quest_complete: { min: 10, max: 50 },
} as const;

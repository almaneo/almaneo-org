/**
 * Firestore Data Types for MiMiG Carbon Farm
 *
 * Collection Structure:
 * - users/{walletAddress}
 * - leaderboard/{userId}
 */

import { Timestamp } from 'firebase/firestore';

// ===========================
// User Document Types
// ===========================

/**
 * 업그레이드 상태
 */
export interface UserUpgrades {
  tapPower: number;        // 1-10
  autoFarm: number;        // 0-10
  energyCapacity: number;  // 1-10
  energyRegen: number;     // 1-10
}

/**
 * 데일리 퀘스트 통계
 */
export interface DailyQuestStats {
  tapsToday: number;
  pointsToday: number;
  upgradesToday: number;
}

/**
 * 데일리 퀘스트
 */
export interface FirestoreDailyQuest {
  id: string;
  type: 'tap' | 'points' | 'upgrade';
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  createdAt: Timestamp;
}

/**
 * 업적 통계
 */
export interface AchievementStats {
  totalTaps: number;
  totalPoints: number;
  totalQuests: number;
  playTime: number;        // seconds
  loginStreak: number;
  lastLoginDate: string;   // ISO date string
  firstLoginDate: string;  // ISO date string
}

/**
 * 업적
 */
export interface FirestoreAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  category: 'basic' | 'upgrade' | 'level' | 'special';
  target: number;
  completed: boolean;
  completedAt?: Timestamp;
}

/**
 * 사용자 문서 (Firestore)
 * Collection: users/{walletAddress}
 */
export interface UserDocument {
  // 기본 정보
  userId: string;           // 지갑 주소 (문서 ID와 동일)
  username?: string;        // 선택적 닉네임
  
  // 게임 상태
  points: number;           // 현재 포인트
  totalPoints: number;      // 누적 포인트
  energy: number;           // 현재 에너지
  maxEnergy: number;        // 최대 에너지
  level: number;            // 레벨
  
  // 업그레이드
  upgrades: UserUpgrades;
  
  // 퀘스트
  dailyQuests: FirestoreDailyQuest[];
  dailyQuestStats: DailyQuestStats;
  
  // 업적
  achievements: FirestoreAchievement[];
  achievementStats: AchievementStats;
  
  // 토큰 보상
  lastClaimedPoints?: number;     // 마지막 토큰 청구 시 포인트
  totalClaimedTokens?: number;    // 총 청구한 토큰
  lastClaimTime?: number;         // 마지막 청구 시간 (Unix timestamp)
  
  // 타임스탬프
  lastActiveTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===========================
// Leaderboard Types
// ===========================

/**
 * 리더보드 엔트리
 * Collection: leaderboard/{userId}
 */
export interface LeaderboardEntry {
  userId: string;           // 지갑 주소
  username: string;         // 표시명
  totalPoints: number;      // 누적 포인트
  level: number;            // 레벨
  rank?: number;            // 순위 (조회 시 계산)
  updatedAt: Timestamp;     // 마지막 업데이트
}

// ===========================
// Input/Output Types
// ===========================

/**
 * 게임 상태 저장 입력
 */
export interface SaveGameInput {
  userId: string;
  points: number;
  totalPoints: number;
  energy: number;
  maxEnergy: number;
  level: number;
  upgrades: UserUpgrades;
  dailyQuests: FirestoreDailyQuest[];
  dailyQuestStats: DailyQuestStats;
  achievements: FirestoreAchievement[];
  achievementStats: AchievementStats;
  lastActiveTime: number;  // Unix timestamp
  lastClaimedPoints?: number;
  totalClaimedTokens?: number;
  lastClaimTime?: number;
}

/**
 * 게임 상태 로드 출력
 */
export interface LoadGameOutput {
  userId: string;
  points: number;
  totalPoints: number;
  energy: number;
  maxEnergy: number;
  level: number;
  upgrades: UserUpgrades;
  dailyQuests: FirestoreDailyQuest[];
  dailyQuestStats: DailyQuestStats;
  achievements: FirestoreAchievement[];
  achievementStats: AchievementStats;
  lastActiveTime: number;  // Unix timestamp
  createdAt: number;       // Unix timestamp
  updatedAt: number;       // Unix timestamp
  lastClaimedPoints?: number;
  totalClaimedTokens?: number;
  lastClaimTime?: number;
}

/**
 * 리더보드 조회 옵션
 */
export interface LeaderboardQuery {
  limit?: number;          // 조회 개수 (기본: 10)
  startAfter?: number;     // 페이지네이션 (totalPoints)
}

/**
 * 사용자 통계 (요약)
 */
export interface UserStats {
  userId: string;
  totalPoints: number;
  level: number;
  totalTaps: number;
  totalQuests: number;
  playTime: number;
  loginStreak: number;
}

// ===========================
// Type Guards
// ===========================

/**
 * UserDocument 타입 가드
 */
export function isUserDocument(data: unknown): data is UserDocument {
  if (!data || typeof data !== 'object') return false;
  
  const doc = data as Partial<UserDocument>;
  
  return (
    typeof doc.userId === 'string' &&
    typeof doc.points === 'number' &&
    typeof doc.totalPoints === 'number' &&
    typeof doc.energy === 'number' &&
    typeof doc.level === 'number' &&
    typeof doc.upgrades === 'object' &&
    Array.isArray(doc.dailyQuests) &&
    Array.isArray(doc.achievements)
  );
}

/**
 * LeaderboardEntry 타입 가드
 */
export function isLeaderboardEntry(data: unknown): data is LeaderboardEntry {
  if (!data || typeof data !== 'object') return false;
  
  const entry = data as Partial<LeaderboardEntry>;
  
  return (
    typeof entry.userId === 'string' &&
    typeof entry.username === 'string' &&
    typeof entry.totalPoints === 'number' &&
    typeof entry.level === 'number'
  );
}

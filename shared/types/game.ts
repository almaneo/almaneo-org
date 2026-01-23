/**
 * NEOS Game Types
 * Kindness 게임 관련 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 게임 업그레이드 상태
 */
export interface GameUpgrades {
  tapPower: number;        // 클릭당 포인트
  autoFarm: number;        // 자동 획득
  energyCapacity: number;  // 최대 에너지
  energyRegen: number;     // 에너지 재생 속도
}

/**
 * 일일 퀘스트 타입
 */
export type QuestType = 'tap' | 'points' | 'upgrade' | 'kindness';

/**
 * 일일 퀘스트
 */
export interface DailyQuest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  rewardPoints: number;
  completed: boolean;
  claimedAt?: Timestamp;
}

/**
 * 성취 카테고리
 */
export type AchievementCategory = 'tap' | 'points' | 'upgrade' | 'level' | 'kindness' | 'special';

/**
 * 성취
 */
export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  currentValue: number;
  unlocked: boolean;
  unlockedAt?: Timestamp;
  rewardPoints: number;
}

/**
 * 게임 상태
 */
export interface GameState {
  // 기본 상태
  points: number;
  totalPoints: number;
  energy: number;
  maxEnergy: number;
  level: number;
  experience: number;

  // 업그레이드
  upgrades: GameUpgrades;

  // 통계
  totalTaps: number;
  totalUpgrades: number;
  playTime: number;  // 초 단위

  // 일일 통계 (퀘스트용)
  dailyStats: {
    tapsToday: number;
    pointsToday: number;
    upgradesToday: number;
    kindnessToday: number;
    lastResetDate: string;  // YYYY-MM-DD
  };

  // 퀘스트 & 성취
  dailyQuests: DailyQuest[];
  achievements: Achievement[];

  // 토큰 채굴
  lastClaimedPoints: number;
  totalClaimedTokens: number;
  lastClaimTime?: Timestamp;

  // 오프라인 수입
  offlineEarnings: number;
  lastOnlineAt?: Timestamp;

  // 저장 시간
  lastSaved: Timestamp;
}

/**
 * 토큰 채굴 Epoch (반감기)
 */
export interface MiningEpoch {
  epoch: number;
  name: string;
  minedRange: [number, number];  // [시작, 끝]
  pointsPerToken: number;
}

/**
 * 토큰 채굴 설정 (8B NEOS)
 */
export const MINING_CONFIG = {
  totalSupply: 8_000_000_000,  // 80억 NEOS
  miningPool: 960_000_000,     // 9.6억 (12% Kindness Mining)

  epochs: [
    { epoch: 1, name: 'Genesis Era', minedRange: [0, 240_000_000], pointsPerToken: 10_000 },
    { epoch: 2, name: 'First Halving', minedRange: [240_000_000, 480_000_000], pointsPerToken: 20_000 },
    { epoch: 3, name: 'Second Halving', minedRange: [480_000_000, 720_000_000], pointsPerToken: 40_000 },
    { epoch: 4, name: 'Final Halving', minedRange: [720_000_000, 960_000_000], pointsPerToken: 80_000 },
  ] as MiningEpoch[],
};

/**
 * 게임 업그레이드 비용 계산
 */
export const UPGRADE_COSTS = {
  tapPower: (level: number) => Math.floor(100 * Math.pow(level, 2)),
  autoFarm: (level: number) => Math.floor(500 * Math.pow(1.5, level)),
  energyCapacity: (level: number) => Math.floor(150 * Math.pow(level, 1.8)),
  energyRegen: (level: number) => Math.floor(200 * Math.pow(level, 2.2)),
};

/**
 * 레벨업 필요 경험치
 */
export const LEVEL_UP_XP = (level: number) => Math.floor(1000 * Math.pow(level, 1.5));

/**
 * 에너지 설정
 */
export const ENERGY_CONFIG = {
  baseMax: 100,
  baseRegen: 1,       // 1 에너지 / 60초
  regenInterval: 60,  // 초
  offlineRate: 0.5,   // 오프라인 시 50% 재생
  maxOfflineHours: 4, // 최대 4시간 오프라인 적립
};

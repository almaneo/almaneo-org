/**
 * NEOS User Types
 * 사용자 관련 타입 정의
 * Note: Firebase에서 Supabase로 마이그레이션됨 - Timestamp를 string (ISO 8601)으로 변경
 */

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

  // 타임스탬프 (ISO 8601 string)
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
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
  updatedAt: string;
}

/**
 * Ambassador 티어
 */
export type AmbassadorTier = 'friend' | 'host' | 'ambassador' | 'guardian';

/**
 * 밋업 상태
 */
export type MeetupStatus = 'upcoming' | 'completed' | 'cancelled';

/**
 * 밋업 정보
 */
export interface Meetup {
  id: string;
  title: string;
  description: string;
  hostAddress: string;
  hostName: string;
  date: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
  status: MeetupStatus;
  photoUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 밋업 참가자
 */
export interface MeetupParticipant {
  address: string;
  nickname: string;
  joinedAt: string;
  pointsAwarded: boolean;
  isFirstMeetup: boolean;
}

/**
 * 친절 활동 타입 (확장)
 */
export type KindnessActivityType =
  | 'meetup_attend'     // 밋업 참가
  | 'meetup_host'       // 밋업 주최
  | 'meetup_host_large' // 대규모 밋업 주최 (10명+)
  | 'first_meetup'      // 첫 밋업 보너스
  | 'monthly_top_host'  // 월간 최다 주최
  | 'mentoring'         // 멘토링 제공
  | 'onboarding'        // 신규 사용자 온보딩
  | 'education_content' // 교육 콘텐츠 제작
  | 'workshop'          // 워크샵/세미나 진행
  | 'translation'       // 번역 기여
  | 'community_leader'  // 지역 커뮤니티 리더
  | 'new_language'      // 새 언어 커뮤니티 개설
  | 'volunteer'         // 봉사 활동
  | 'donation'          // ALMAN 기부
  | 'charity_event'     // 자선 이벤트 주최
  | 'twitter_share'     // Twitter 공유
  | 'discord_help'      // Discord 도움
  | 'referral'          // 친구 초대
  | 'governance_vote'   // 거버넌스 투표
  | 'staking_weekly'    // 스테이킹 유지 (주간)
  | 'nft_trade'         // NFT 거래
  | 'daily_quest'       // 일일 퀘스트
  | 'weekly_mission'    // 주간 미션
  | 'monthly_challenge';// 월간 챌린지

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
  createdAt: string;
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

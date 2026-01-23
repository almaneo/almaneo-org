/**
 * Leaderboard System
 * 
 * 전역 리더보드, 주간/월간 랭킹 관리
 * Firebase Firestore 연동
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * 리더보드 엔트리 (개별 유저 랭킹 정보)
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  level: number;
  rank: number;
  avatar?: string;
  lastUpdated: Date;
  rankChange?: number; // 순위 변동 (▲3, ▼2, 0)
}

/**
 * 리더보드 통계
 */
export interface LeaderboardStats {
  totalPlayers: number;
  averagePoints: number;
  topPlayer: string;
  lastUpdated: Date;
}

/**
 * 리더보드 타입
 */
export type LeaderboardType = 
  | 'global'   // 전체 랭킹 (totalPoints 기준)
  | 'weekly'   // 주간 랭킹 (이번 주 획득 포인트)
  | 'monthly'; // 월간 랭킹 (이번 달 획득 포인트)

/**
 * 주간 랭킹 엔트리
 */
export interface WeeklyLeaderboardEntry extends Omit<LeaderboardEntry, 'totalPoints'> {
  weeklyPoints: number;
  weekStart: Date;
  weekEnd: Date;
}

/**
 * 월간 랭킹 엔트리
 */
export interface MonthlyLeaderboardEntry extends Omit<LeaderboardEntry, 'totalPoints'> {
  monthlyPoints: number;
  monthStart: Date;
  monthEnd: Date;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 순위 변동 계산
 * @param oldRank 이전 순위
 * @param newRank 현재 순위
 * @returns 순위 변동 (양수: 상승, 음수: 하락, 0: 유지)
 */
export function calculateRankChange(
  oldRank: number | null,
  newRank: number
): number {
  if (oldRank === null) return 0;
  return oldRank - newRank; // 순위가 낮아지면 양수 (상승)
}

/**
 * 순위 변동 텍스트
 * @param change 순위 변동 값
 * @returns 표시 텍스트 (▲3, ▼2, ─)
 */
export function getRankChangeText(change: number): string {
  if (change > 0) return `▲${change}`;
  if (change < 0) return `▼${Math.abs(change)}`;
  return '─';
}

/**
 * 순위 변동 색상
 * @param change 순위 변동 값
 * @returns MUI 색상 (success, error, text.secondary)
 */
export function getRankChangeColor(change: number): string {
  if (change > 0) return 'success.main';
  if (change < 0) return 'error.main';
  return 'text.secondary';
}

/**
 * 순위별 메달 이모지
 * @param rank 순위
 * @returns 메달 이모지 (1-3위만)
 */
export function getRankMedal(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '';
  }
}

/**
 * 순위별 배경 색상 (그라데이션)
 * @param rank 순위
 * @returns CSS gradient 문자열
 */
export function getRankBackgroundColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'linear-gradient(135deg, #FFD700, #FFA500)'; // 금색
    case 2:
      return 'linear-gradient(135deg, #C0C0C0, #A8A8A8)'; // 은색
    case 3:
      return 'linear-gradient(135deg, #CD7F32, #B8764F)'; // 동색
    default:
      return '';
  }
}

/**
 * 주 시작/종료 날짜 계산
 * @param date 기준 날짜
 * @returns { weekStart, weekEnd }
 */
export function getWeekBounds(date: Date = new Date()): {
  weekStart: Date;
  weekEnd: Date;
} {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // 월요일 시작
  
  const weekStart = new Date(current.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
}

/**
 * 월 시작/종료 날짜 계산
 * @param date 기준 날짜
 * @returns { monthStart, monthEnd }
 */
export function getMonthBounds(date: Date = new Date()): {
  monthStart: Date;
  monthEnd: Date;
} {
  const current = new Date(date);
  
  const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  
  const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);
  
  return { monthStart, monthEnd };
}

/**
 * 주 ID 생성 (YYYY-WW 형식)
 * @param date 기준 날짜
 * @returns 주 ID (예: "2024-47")
 */
export function getWeekId(date: Date = new Date()): string {
  const { weekStart } = getWeekBounds(date);
  const year = weekStart.getFullYear();
  const weekNum = getWeekNumber(weekStart);
  return `${year}-${weekNum.toString().padStart(2, '0')}`;
}

/**
 * 월 ID 생성 (YYYY-MM 형식)
 * @param date 기준 날짜
 * @returns 월 ID (예: "2024-11")
 */
export function getMonthId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * ISO 주 번호 계산
 * @param date 날짜
 * @returns 주 번호 (1-53)
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

/**
 * 리더보드 통계 계산
 * @param entries 리더보드 엔트리 배열
 * @returns 통계 객체
 */
export function calculateLeaderboardStats(
  entries: LeaderboardEntry[]
): LeaderboardStats {
  if (entries.length === 0) {
    return {
      totalPlayers: 0,
      averagePoints: 0,
      topPlayer: '',
      lastUpdated: new Date(),
    };
  }

  const totalPoints = entries.reduce((sum, entry) => sum + entry.totalPoints, 0);
  const averagePoints = Math.round(totalPoints / entries.length);
  const topPlayer = entries[0]?.username || '';

  return {
    totalPlayers: entries.length,
    averagePoints,
    topPlayer,
    lastUpdated: new Date(),
  };
}

/**
 * 포인트 포맷팅 (천 단위 쉼표)
 * @param points 포인트
 * @returns 포맷된 문자열 (예: "1,234,567")
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('en-US');
}

/**
 * 순위 텍스트 포맷팅
 * @param rank 순위
 * @returns 포맷된 문자열 (예: "#1", "#42")
 */
export function formatRank(rank: number): string {
  return `#${rank}`;
}

/**
 * 마지막 업데이트 시간 텍스트
 * @param date 날짜
 * @returns 상대 시간 텍스트 (예: "5분 전")
 */
export function getLastUpdatedText(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US');
}

// ============================================================================
// Mock Data (개발/테스트용)
// ============================================================================

/**
 * 목 데이터 생성 (테스트용)
 * @param count 생성할 엔트리 수
 * @returns 목 리더보드 엔트리 배열
 */
export function generateMockLeaderboard(count: number = 100): LeaderboardEntry[] {
  const mockUsers = [
    'FarmMaster', 'RiceKing', 'CarbonHero', 'EcoWarrior', 'GreenThumb',
    'HarvestPro', 'AgriNinja', 'EarthSaver', 'ClimateChamp', 'SustainGuru',
    'CropLord', 'PaddyBoss', 'OrganicFan', 'NatureFirst', 'PlantPower',
    'FieldExpert', 'BioDiesel', 'SeedMaster', 'SoilGenius', 'WaterWise',
  ];

  const entries: LeaderboardEntry[] = [];

  for (let i = 0; i < count; i++) {
    const points = Math.floor(Math.random() * 100000) + (100000 - i * 1000);
    const level = Math.floor(points / 5000) + 1;
    
    entries.push({
      userId: `user_${i + 1}`,
      username: mockUsers[i % mockUsers.length] + (i > 19 ? i : ''),
      totalPoints: points,
      level,
      rank: i + 1,
      lastUpdated: new Date(),
      rankChange: Math.floor(Math.random() * 11) - 5, // -5 ~ +5
    });
  }

  // 포인트 기준 정렬
  entries.sort((a, b) => b.totalPoints - a.totalPoints);
  
  // 순위 재설정
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

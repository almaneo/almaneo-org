/**
 * Daily Quest System
 * 
 * 매일 3개의 퀘스트를 제공하여 플레이어에게 목표를 제공하고 DAU를 증가시킵니다.
 */

export type QuestType = 'tap' | 'points' | 'upgrade';

export interface DailyQuest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * 퀘스트 템플릿 정의
 */
const QUEST_TEMPLATES = {
  tap: [
    {
      target: 50,
      title: '🌾 Beginner Farmer',
      description: 'Tap the farm 50 times',
      reward: 100,
      icon: '👆',
    },
    {
      target: 100,
      title: '🌾 Skilled Farmer',
      description: 'Tap the farm 100 times',
      reward: 200,
      icon: '👆',
    },
    {
      target: 200,
      title: '🌾 Expert Farmer',
      description: 'Tap the farm 200 times',
      reward: 400,
      icon: '👆',
    },
    {
      target: 500,
      title: '🌾 Tap Master',
      description: 'Tap the farm 500 times',
      reward: 1000,
      icon: '👆',
    },
  ],
  points: [
    {
      target: 500,
      title: '💰 Small Earnings',
      description: 'Earn 500 points',
      reward: 150,
      icon: '💎',
    },
    {
      target: 1000,
      title: '💰 Medium Earnings',
      description: 'Earn 1,000 points',
      reward: 300,
      icon: '💎',
    },
    {
      target: 2000,
      title: '💰 Big Earnings',
      description: 'Earn 2,000 points',
      reward: 600,
      icon: '💎',
    },
    {
      target: 5000,
      title: '💰 Huge Earnings',
      description: 'Earn 5,000 points',
      reward: 1500,
      icon: '💎',
    },
  ],
  upgrade: [
    {
      target: 1,
      title: '📈 First Upgrade',
      description: 'Upgrade 1 time',
      reward: 200,
      icon: '⬆️',
    },
    {
      target: 3,
      title: '📈 Upgrade Enthusiast',
      description: 'Upgrade 3 times',
      reward: 500,
      icon: '⬆️',
    },
    {
      target: 5,
      title: '📈 Upgrade Master',
      description: 'Upgrade 5 times',
      reward: 1000,
      icon: '⬆️',
    },
  ],
};

/**
 * 일일 퀘스트 난이도 (요일별)
 */
const DIFFICULTY_BY_DAY = {
  0: 'easy', // 일요일
  1: 'medium', // 월요일
  2: 'medium',
  3: 'hard',
  4: 'medium',
  5: 'hard',
  6: 'easy', // 토요일
} as const;

/**
 * 난이도별 퀘스트 인덱스
 */
const DIFFICULTY_INDEX = {
  easy: 0,
  medium: 1,
  hard: 2,
};

/**
 * 하루의 시작 시간을 반환 (UTC 00:00)
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

/**
 * 하루의 끝 시간을 반환 (UTC 23:59:59)
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

/**
 * 날짜의 시드 값 생성 (YYYYMMDD)
 */
export function getDateSeed(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 시드 기반 랜덤 숫자 생성 (0-1)
 */
function seededRandom(seed: string, index: number): number {
  const combined = seed + index.toString();
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(Math.sin(hash));
}

/**
 * 일일 퀘스트 3개 생성
 * - 매일 같은 날짜에는 같은 퀘스트 생성 (시드 기반)
 * - 요일별 난이도 적용
 */
export function generateDailyQuests(date: Date = new Date()): DailyQuest[] {
  const seed = getDateSeed(date);
  const dayOfWeek = date.getUTCDay();
  const difficulty = DIFFICULTY_BY_DAY[dayOfWeek as keyof typeof DIFFICULTY_BY_DAY];
  const difficultyIndex = DIFFICULTY_INDEX[difficulty];

  const quests: DailyQuest[] = [];
  const types: QuestType[] = ['tap', 'points', 'upgrade'];

  types.forEach((type, index) => {
    const templates = QUEST_TEMPLATES[type];
    // 난이도에 따라 템플릿 선택 (easy: 0, medium: 1, hard: 2)
    const templateIndex = Math.min(difficultyIndex, templates.length - 1);
    const template = templates[templateIndex];

    const quest: DailyQuest = {
      id: `${seed}-${type}`,
      type,
      title: template.title,
      description: template.description,
      icon: template.icon,
      target: template.target,
      current: 0,
      reward: template.reward,
      completed: false,
      createdAt: getStartOfDay(date),
      expiresAt: getEndOfDay(date),
    };

    quests.push(quest);
  });

  return quests;
}

/**
 * 퀘스트가 만료되었는지 확인
 */
export function isQuestExpired(quest: DailyQuest): boolean {
  return new Date() > quest.expiresAt;
}

/**
 * 퀘스트 진행도 계산 (0-100%)
 */
export function getQuestProgress(quest: DailyQuest): number {
  if (quest.completed) return 100;
  return Math.min((quest.current / quest.target) * 100, 100);
}

/**
 * 오늘의 퀘스트인지 확인
 */
export function isTodayQuest(quest: DailyQuest): boolean {
  const today = getStartOfDay();
  const questDate = getStartOfDay(quest.createdAt);
  return today.getTime() === questDate.getTime();
}

/**
 * 퀘스트 리셋이 필요한지 확인
 */
export function needsQuestReset(quests: DailyQuest[]): boolean {
  if (quests.length === 0) return true;
  if (quests.length !== 3) return true;
  return !isTodayQuest(quests[0]);
}

// Achievement System for MiMiG Carbon Farm
// Provides long-term goals and player progression tracking

export type AchievementCategory = 'tap' | 'points' | 'upgrade' | 'level' | 'special' | 'travel';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  target: number;
  reward: number;
  completed: boolean;
  completedAt?: Date;
  hidden: boolean; // Hidden achievements (shown only when completed)
}

export interface AchievementStats {
  totalTaps: number;
  totalPoints: number;
  totalQuests: number;
  playTime: number; // in seconds
  loginStreak: number;
  lastLoginDate: string;
  firstLoginDate: string;
  // Travel stats
  countriesVisited: number;
  travelQuestsCompleted: number;
  totalStars: number;
  perfectCountries: number;
}

// Achievement Templates
export const ACHIEVEMENTS: Achievement[] = [
  // ========================================
  // TAP CATEGORY - Click-based achievements
  // ========================================
  {
    id: 'first_harvest',
    title: 'Hello World',
    description: 'Establish your first connection to the Hub',
    icon: '🛰️',
    category: 'tap',
    target: 1,
    reward: 10,
    completed: false,
    hidden: false,
  },
  {
    id: 'century_club',
    title: 'Data Streamer',
    description: 'Sync 100 data packets to the Hub',
    icon: '📡',
    category: 'tap',
    target: 100,
    reward: 100,
    completed: false,
    hidden: false,
  },
  {
    id: 'millennium',
    title: 'High Bandwidth',
    description: 'Sync 1,000 data packets',
    icon: '⚡',
    category: 'tap',
    target: 1000,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'click_master',
    title: 'Mainframe Access',
    description: 'Sync 10,000 data packets',
    icon: '💻',
    category: 'tap',
    target: 10000,
    reward: 2000,
    completed: false,
    hidden: false,
  },

  // ========================================
  // POINTS CATEGORY - Point accumulation
  // ========================================
  {
    id: 'first_fortune',
    title: 'Initial Capital',
    description: 'Accumulate your first 1,000 kindness points',
    icon: '💝',
    category: 'points',
    target: 1000,
    reward: 100,
    completed: false,
    hidden: false,
  },
  {
    id: 'point_collector',
    title: 'Impact Maker',
    description: 'Accumulate 10,000 kindness points',
    icon: '🌍',
    category: 'points',
    target: 10000,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'wealthy_farmer',
    title: 'Equality Champion',
    description: 'Accumulate 100,000 kindness points',
    icon: '🏆',
    category: 'points',
    target: 100000,
    reward: 2000,
    completed: false,
    hidden: false,
  },

  // ========================================
  // UPGRADE CATEGORY - Upgrade achievements
  // ========================================
  {
    id: 'first_upgrade',
    title: 'Node Optimization',
    description: 'Install your first hub optimization module',
    icon: '⚙️',
    category: 'upgrade',
    target: 1,
    reward: 50,
    completed: false,
    hidden: false,
  },
  {
    id: 'max_energy',
    title: 'Buffer Overflow',
    description: 'Upgrade Compute Nodes to level 10',
    icon: '💾',
    category: 'upgrade',
    target: 10,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'power_tapper',
    title: 'Neural Link',
    description: 'Upgrade Labeling Speed to level 10',
    icon: '🧠',
    category: 'upgrade',
    target: 10,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'automation_king',
    title: 'AI Singularity',
    description: 'Upgrade Auto-ML Model to level 10',
    icon: '🤖',
    category: 'upgrade',
    target: 10,
    reward: 1000,
    completed: false,
    hidden: false,
  },
  {
    id: 'energy_master',
    title: 'Zero Latency',
    description: 'Upgrade Cooling System to level 10',
    icon: '❄️',
    category: 'upgrade',
    target: 10,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'perfect_farm',
    title: 'Tier 1 Operator',
    description: 'Maximize all hub modules',
    icon: '👑',
    category: 'upgrade',
    target: 40,
    reward: 5000,
    completed: false,
    hidden: false,
  },

  // ========================================
  // LEVEL CATEGORY - Level-based achievements
  // ========================================
  {
    id: 'beginner',
    title: 'Alpha Tester',
    description: 'Reach Phase 5',
    icon: '🧪',
    category: 'level',
    target: 5,
    reward: 200,
    completed: false,
    hidden: false,
  },
  {
    id: 'advanced',
    title: 'Beta Synchronizer',
    description: 'Reach Phase 10',
    icon: '🛰️',
    category: 'level',
    target: 10,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'master',
    title: 'Hub Architect',
    description: 'Reach Phase 25',
    icon: '💠',
    category: 'level',
    target: 25,
    reward: 2000,
    completed: false,
    hidden: false,
  },

  // ========================================
  // SPECIAL CATEGORY - Special conditions
  // ========================================
  {
    id: 'night_owl',
    title: 'Deep Learning',
    description: 'Sync data during the night cycle (00:00 - 06:00)',
    icon: '🌙',
    category: 'special',
    target: 1,
    reward: 100,
    completed: false,
    hidden: true,
  },
  {
    id: 'dedicated',
    title: 'Stable Connection',
    description: 'Access the hub for 7 consecutive days',
    icon: '📅',
    category: 'special',
    target: 7,
    reward: 1000,
    completed: false,
    hidden: false,
  },
  {
    id: 'veteran',
    title: 'Core Member',
    description: 'Total uptime exceeds 10 hours',
    icon: '🎮',
    category: 'special',
    target: 36000,
    reward: 1500,
    completed: false,
    hidden: true,
  },
  {
    id: 'quest_master',
    title: 'Mission Veteran',
    description: 'Complete 10 daily logs',
    icon: '🏅',
    category: 'special',
    target: 10,
    reward: 1000,
    completed: false,
    hidden: false,
  },

  // ========================================
  // TRAVEL CATEGORY - World Travel achievements
  // ========================================
  {
    id: 'first_journey',
    title: 'First Steps',
    description: 'Visit your first country',
    icon: '🌍',
    category: 'travel',
    target: 1,
    reward: 100,
    completed: false,
    hidden: false,
  },
  {
    id: 'world_explorer',
    title: 'World Explorer',
    description: 'Visit 5 different countries',
    icon: '✈️',
    category: 'travel',
    target: 5,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'globe_trotter',
    title: 'Globe Trotter',
    description: 'Visit 10 different countries',
    icon: '🗺️',
    category: 'travel',
    target: 10,
    reward: 1500,
    completed: false,
    hidden: false,
  },
  {
    id: 'world_citizen',
    title: 'World Citizen',
    description: 'Visit all 20 countries',
    icon: '🌐',
    category: 'travel',
    target: 20,
    reward: 5000,
    completed: false,
    hidden: false,
  },
  {
    id: 'first_star',
    title: 'Rising Star',
    description: 'Earn your first star in any country',
    icon: '⭐',
    category: 'travel',
    target: 1,
    reward: 200,
    completed: false,
    hidden: false,
  },
  {
    id: 'star_collector',
    title: 'Star Collector',
    description: 'Earn 10 stars total',
    icon: '🌟',
    category: 'travel',
    target: 10,
    reward: 1000,
    completed: false,
    hidden: false,
  },
  {
    id: 'constellation',
    title: 'Constellation',
    description: 'Earn 30 stars total',
    icon: '💫',
    category: 'travel',
    target: 30,
    reward: 3000,
    completed: false,
    hidden: false,
  },
  {
    id: 'perfect_country',
    title: 'Cultural Master',
    description: 'Get 3 stars in any country',
    icon: '🏅',
    category: 'travel',
    target: 1,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'travel_quest_10',
    title: 'Curious Traveler',
    description: 'Complete 10 travel quests',
    icon: '📚',
    category: 'travel',
    target: 10,
    reward: 500,
    completed: false,
    hidden: false,
  },
  {
    id: 'travel_quest_50',
    title: 'Cultural Scholar',
    description: 'Complete 50 travel quests',
    icon: '🎓',
    category: 'travel',
    target: 50,
    reward: 3000,
    completed: false,
    hidden: false,
  },
];

/**
 * Check if an achievement should be marked as completed
 * @param achievement - The achievement to check
 * @param current - Current progress value
 * @returns true if achievement is completed
 */
export function checkAchievement(achievement: Achievement, current: number): boolean {
  return current >= achievement.target;
}

/**
 * Calculate progress percentage for an achievement
 * @param achievement - The achievement
 * @param current - Current progress value
 * @returns Progress percentage (0-100)
 */
export function getProgress(achievement: Achievement, current: number): number {
  const progress = (current / achievement.target) * 100;
  return Math.min(progress, 100);
}

/**
 * Get achievements by category
 * @param category - Category to filter by
 * @returns Filtered achievements
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get total rewards from all achievements
 * @returns Total reward points
 */
export function getTotalRewards(): number {
  return ACHIEVEMENTS.reduce((sum, a) => sum + a.reward, 0);
}

/**
 * Calculate completion rate
 * @param achievements - User's achievement list
 * @returns Completion rate (0-100)
 */
export function getCompletionRate(achievements: Achievement[]): number {
  const completed = achievements.filter(a => a.completed).length;
  return Math.round((completed / achievements.length) * 100);
}

/**
 * Check if current time is between midnight and 6 AM (Night Owl achievement)
 * @returns true if it's night time
 */
export function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 0 && hour < 6;
}

/**
 * Calculate login streak
 * @param lastLoginDate - Last login date string
 * @param currentDate - Current date string
 * @returns Updated streak count
 */
export function calculateLoginStreak(lastLoginDate: string, currentDate: string): number {
  if (!lastLoginDate) return 1;

  const last = new Date(lastLoginDate);
  const current = new Date(currentDate);

  // Reset to start of day for comparison
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  // If logged in yesterday, increment streak
  if (diffDays === 1) {
    return 1; // Will be incremented by caller
  }

  // If logged in today (same day), keep current streak
  if (diffDays === 0) {
    return 0; // No change
  }

  // If more than 1 day gap, reset streak
  return -1; // Will be reset to 1 by caller
}

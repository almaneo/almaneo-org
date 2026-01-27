// Game balance constants
export const GAME_CONFIG = {
  // Energy system
  INITIAL_ENERGY: 100,
  INITIAL_MAX_ENERGY: 100,
  INITIAL_ENERGY_REGEN: 10, // points per minute (10x faster: 60s = 10 energy)
  ENERGY_PER_CLICK: 1,

  // Points system
  INITIAL_TAP_POWER: 1,
  INITIAL_AUTO_FARM: 0,

  // Levels
  MAX_LEVEL: 100,
  INITIAL_LEVEL: 1,

  // Offline earnings
  MAX_OFFLINE_HOURS: 4,
} as const;

// Upgrade configurations
export const UPGRADES = {
  tapPower: {
    maxLevel: 10,
    getCost: (level: number) => 100 * Math.pow(level, 2),
    getEffect: (level: number) => level,
  },
  autoFarm: {
    maxLevel: 10,
    getCost: (level: number) => Math.floor(500 * Math.pow(1.5, level)),
    getEffect: (level: number) => {
      // Base offline earning even at level 0
      if (level === 0) return 0.1; // 0.1 points per second (6 points/min)
      return Math.pow(2, level - 1);
    },
  },
  energyCapacity: {
    maxLevel: 10,
    getCost: (level: number) => Math.floor(150 * Math.pow(level, 1.8)),
    getEffect: (level: number) => 100 + level * 10,
  },
  energyRegen: {
    maxLevel: 10,
    getCost: (level: number) => Math.floor(200 * Math.pow(level, 2.2)),
    getEffect: (level: number) => 10 + level * 2, // Base 10/min, +2/min per level
  },
} as const;

// Level system
export const LEVEL_SYSTEM = {
  getRequiredPoints: (level: number) => Math.floor(1000 * Math.pow(level, 1.5)),

  getLevelReward: (level: number) => {
    const milestones: Record<number, number> = {
      10: 500,
      25: 2000,
      50: 10000,
      75: 30000,
      100: 50000,
    };
    return milestones[level] || 100;
  },
} as const;

// Tier system (Jeong-SBT Tiers)
export const TIERS = {
  bronze: {
    threshold: 0,
    multiplier: 1.0,
    color: '#CD7F32',
    nameKey: 'tiers.bronze',
  },
  silver: {
    threshold: 10000,
    multiplier: 1.1,
    color: '#C0C0C0',
    nameKey: 'tiers.silver',
    reward: 1000,
  },
  gold: {
    threshold: 50000,
    multiplier: 1.25,
    color: '#FFD700',
    nameKey: 'tiers.gold',
    reward: 5000,
  },
  platinum: {
    threshold: 200000,
    multiplier: 1.5,
    color: '#E5E4E2',
    nameKey: 'tiers.platinum',
    reward: 20000,
  },
} as const;

// Kindness Impact (replaces Environmental)
export const KINDNESS_IMPACT = {
  POINTS_PER_GAII_IMPROVEMENT: 10000,  // 10,000 points = 0.01 GAII improvement
  HUMANS_HELPED_PER_10K: 1,            // 10,000 points = 1 human helped with AI access
} as const;

// Legacy alias for compatibility
export const ENVIRONMENTAL = KINDNESS_IMPACT;

// Auto-save interval
export const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

// Token conversion
export const TOKEN_CONVERSION = {
  POINTS_PER_TOKEN: 10000, // 10,000 points = 1 ALMAN token
  MIN_CLAIM_POINTS: 1000, // Minimum 1,000 points to claim (0.1 ALMAN)
} as const;

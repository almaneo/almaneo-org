import { create } from 'zustand';
import { GAME_CONFIG, UPGRADES } from '@/lib/constants';
import { saveGameState as saveGameStateLocal, loadGameState as loadGameStateLocal, GameState } from '@/lib/storage';
import { DailyQuest, generateDailyQuests, needsQuestReset } from '@/lib/quests';
import { Achievement, ACHIEVEMENTS, AchievementStats, checkAchievement, isNightTime, calculateLoginStreak } from '@/lib/achievements';
import { updateUserRank } from '@/lib/firebaseLeaderboard';
import {
  saveGameState as saveGameStateFirestore,
  loadGameState as loadGameStateFirestore,
  createUser,
  updateLeaderboard,
} from '@/lib/firebase-db';
import { SaveGameInput } from '@/types/firestore';
import { Timestamp } from 'firebase/firestore';
import {
  getClaimableTokens,
  canClaimTokens as canClaimTokensLib,
  getPointsUntilNextClaim as getPointsUntilNextClaimLib,
  getClaimableTokensWithMining,
  canClaimTokensWithMining,
  getPointsUntilNextClaimWithMining,
} from '@/lib/tokenReward';
import { getMiningStats, getCurrentConversionRate } from '@/lib/tokenMining';
import type { MiningStats } from '@/lib/tokenMining';
import {
  getGlobalMiningStats,
  updateAllMiningStats,
  ensureGlobalStatsExists,
} from '@/lib/miningFirestore';
import { Timestamp as FirestoreTimestamp } from 'firebase/firestore';
import type { ClaimRecord } from '@/types/miningFirestore';

// Debounce timer for leaderboard updates
let leaderboardUpdateTimer: NodeJS.Timeout | null = null;

interface GameStore {
  // State
  userId: string | null;
  username?: string;
  points: number;
  totalPoints: number;
  energy: number;
  maxEnergy: number;
  level: number;
  upgrades: {
    tapPower: number;
    autoFarm: number;
    energyCapacity: number;
    energyRegen: number;
  };
  lastActiveTime: number;
  isLoading: boolean;
  
  // Save state
  lastSaveTime: number;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  saveError: string | null;
  
  // Offline earnings
  offlineEarnings: number;
  offlineTime: number;
  showOfflineModal: boolean;

  // Token Rewards
  lastClaimedPoints: number;
  totalClaimedTokens: number;
  lastClaimTime: number;

  // Token Mining
  globalTotalMined: number;  // 글로벌 채굴 통계

  // Daily Quests
  dailyQuests: DailyQuest[];
  dailyQuestStats: {
    tapsToday: number;
    pointsToday: number;
    upgradesToday: number;
  };

  // Achievements
  achievements: Achievement[];
  achievementStats: AchievementStats;

  // Actions
  setUserId: (userId: string) => void;
  addPoints: (amount: number) => void;
  consumeEnergy: (amount: number) => void;
  incrementEnergy: () => void;
  regenerateEnergy: () => void;
  upgrade: (type: keyof GameStore['upgrades']) => void;
  checkLevelUp: () => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'success' | 'error', error?: string | null) => void;
  dismissOfflineModal: () => void;
  initializeDailyQuests: () => void;
  updateQuestProgress: (type: 'tap' | 'points' | 'upgrade', amount?: number) => void;
  claimQuestReward: (questId: string) => void;
  checkQuestReset: () => void;
  initializeAchievements: () => void;
  checkAchievements: () => void;
  completeAchievement: (id: string) => void;
  updateAchievementStats: (type: 'tap' | 'points' | 'upgrade' | 'quest' | 'playTime', amount?: number) => void;
  getClaimableTokenAmount: () => number;
  canClaimTokens: () => boolean;
  getPointsUntilNextClaim: () => number;
  getCurrentConversionRate: () => number;
  getMiningStats: () => MiningStats;
  setGlobalTotalMined: (amount: number) => void;
  recordTokenClaim: (amount: number, transactionHash?: string) => void;
  saveGame: () => Promise<void>;
  loadGame: (userId: string) => Promise<void>;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  userId: null,
  username: undefined,
  points: 0,
  totalPoints: 0,
  energy: GAME_CONFIG.INITIAL_ENERGY,
  maxEnergy: GAME_CONFIG.INITIAL_MAX_ENERGY,
  level: GAME_CONFIG.INITIAL_LEVEL,
  upgrades: {
    tapPower: 1,
    autoFarm: 0,
    energyCapacity: 1,
    energyRegen: 1,
  },
  lastActiveTime: Date.now(),
  isLoading: false,
  
  // Save state
  lastSaveTime: 0,
  saveStatus: 'idle',
  saveError: null,
  
  // Offline earnings
  offlineEarnings: 0,
  offlineTime: 0,
  showOfflineModal: false,

  // Token Rewards
  lastClaimedPoints: 0,
  totalClaimedTokens: 0,
  lastClaimTime: 0,

  // Token Mining
  globalTotalMined: 0,

  // Daily Quests
  dailyQuests: [],
  dailyQuestStats: {
    tapsToday: 0,
    pointsToday: 0,
    upgradesToday: 0,
  },

  // Achievements
  achievements: [],
  achievementStats: {
    totalTaps: 0,
    totalPoints: 0,
    totalQuests: 0,
    playTime: 0,
    loginStreak: 0,
    lastLoginDate: '',
    firstLoginDate: '',
  },

  // Set user ID
  setUserId: (userId: string) => {
    set({ userId });
  },

  // Add points
  addPoints: (amount: number) => {
    set((state) => {
      const newPoints = state.points + amount;
      const newTotalPoints = state.totalPoints + amount;
      return {
        points: newPoints,
        totalPoints: newTotalPoints,
      };
    });
    
    // Update quest progress and achievement stats
    get().updateQuestProgress('points', amount);
    get().updateAchievementStats('points', amount);
    get().checkLevelUp();
    
    // Debounced leaderboard update (5초 대기)
    if (leaderboardUpdateTimer) {
      clearTimeout(leaderboardUpdateTimer);
    }
    
    leaderboardUpdateTimer = setTimeout(() => {
      const state = get();
      if (state.userId) {
        updateUserRank(state.userId, {
          username: 'You', // TODO: 실제 유저명으로 교체
          totalPoints: state.totalPoints,
          level: state.level,
        }).catch(error => {
          console.error('Failed to update leaderboard:', error);
        });
      }
    }, 5000);
  },

  // Consume energy
  consumeEnergy: (amount: number) => {
    set((state) => ({
      energy: Math.max(0, state.energy - amount),
    }));
  },

  // Increment energy (for timer-based regeneration)
  incrementEnergy: () => {
    set((state) => ({
      energy: Math.min(state.energy + 1, state.maxEnergy),
    }));
  },

  // Regenerate energy
  regenerateEnergy: () => {
    set((state) => {
      const now = Date.now();
      const elapsed = (now - state.lastActiveTime) / 60000; // minutes
      const regenRate = UPGRADES.energyRegen.getEffect(state.upgrades.energyRegen);
      const regen = elapsed * regenRate;
      const newEnergy = Math.min(state.energy + regen, state.maxEnergy);
      
      return {
        energy: newEnergy,
        lastActiveTime: now,
      };
    });
  },

  // Upgrade
  upgrade: (type) => {
    const state = get();
    const currentLevel = state.upgrades[type];
    const upgradeConfig = UPGRADES[type];
    
    if (currentLevel >= upgradeConfig.maxLevel) {
      return;
    }
    
    const cost = upgradeConfig.getCost(currentLevel + 1);
    
    if (state.points < cost) {
      return;
    }

    set((state) => ({
      points: state.points - cost,
      upgrades: {
        ...state.upgrades,
        [type]: currentLevel + 1,
      },
      maxEnergy: type === 'energyCapacity' 
        ? upgradeConfig.getEffect(currentLevel + 1) 
        : state.maxEnergy,
    }));

    // Track quest progress and achievements
    get().updateQuestProgress('upgrade');
    get().updateAchievementStats('upgrade');
    get().checkAchievements();
  },

  // Check level up
  checkLevelUp: () => {
    const state = get();
    
    // Loop to handle multiple level ups at once
    let currentLevel = state.level;
    let levelsGained = 0;
    
    while (currentLevel < GAME_CONFIG.MAX_LEVEL) {
      const requiredPoints = 1000 * Math.pow(currentLevel, 1.5);
      
      if (state.totalPoints >= requiredPoints) {
        currentLevel++;
        levelsGained++;
      } else {
        break;
      }
    }
    
    if (levelsGained > 0) {
      set({ level: currentLevel });
      
      // Check level achievements
      get().checkAchievements();
      
      // Update leaderboard on level up
      const newState = get();
      if (newState.userId) {
        updateUserRank(newState.userId, {
          username: 'You', // TODO: 실제 유저명으로 교체
          totalPoints: newState.totalPoints,
          level: newState.level,
        }).catch(error => {
          console.error('Failed to update leaderboard on level up:', error);
        });
      }
    }
  },

  // Set save status
  setSaveStatus: (status, error = null) => {
    set({
      saveStatus: status,
      saveError: error,
      lastSaveTime: status === 'success' ? Date.now() : get().lastSaveTime,
    });
  },

  // Dismiss offline modal
  dismissOfflineModal: () => {
    set({
      showOfflineModal: false,
      offlineEarnings: 0,
      offlineTime: 0,
    });
  },

  // Initialize daily quests
  initializeDailyQuests: () => {
    const newQuests = generateDailyQuests();
    set({
      dailyQuests: newQuests,
      dailyQuestStats: {
        tapsToday: 0,
        pointsToday: 0,
        upgradesToday: 0,
      },
    });
  },

  // Update quest progress
  updateQuestProgress: (type, amount = 1) => {
    set((state) => {
      // Update stats
      const newStats = { ...state.dailyQuestStats };
      if (type === 'tap') newStats.tapsToday += amount;
      if (type === 'points') newStats.pointsToday += amount;
      if (type === 'upgrade') newStats.upgradesToday += amount;

      // Update quests
      const updatedQuests = state.dailyQuests.map((quest) => {
        if (quest.completed) return quest;
        if (quest.type !== type) return quest;

        let newCurrent = quest.current;
        if (type === 'tap') newCurrent = newStats.tapsToday;
        if (type === 'points') newCurrent = newStats.pointsToday;
        if (type === 'upgrade') newCurrent = newStats.upgradesToday;

        return {
          ...quest,
          current: Math.min(newCurrent, quest.target),
        };
      });

      return {
        dailyQuestStats: newStats,
        dailyQuests: updatedQuests,
      };
    });
  },

  // Claim quest reward
  claimQuestReward: (questId) => {
    set((state) => {
      const quest = state.dailyQuests.find((q) => q.id === questId);
      if (!quest || quest.completed || quest.current < quest.target) {
        return state;
      }

      const updatedQuests = state.dailyQuests.map((q) =>
        q.id === questId ? { ...q, completed: true } : q
      );

      return {
        dailyQuests: updatedQuests,
        points: state.points + quest.reward,
        totalPoints: state.totalPoints + quest.reward,
      };
    });
    
    // Track quest completion achievement
    get().updateAchievementStats('quest');
  },

  // Check if quests need reset
  checkQuestReset: () => {
    const state = get();
    if (needsQuestReset(state.dailyQuests)) {
      get().initializeDailyQuests();
    }
  },

  // Initialize achievements
  initializeAchievements: () => {
    const state = get();
    if (state.achievements.length === 0) {
      set({ achievements: [...ACHIEVEMENTS] });
    }
  },

  // Check all achievements and complete if targets are met
  checkAchievements: () => {
    set((state) => {
      const { achievements, achievementStats, upgrades, level } = state;
      
      const updatedAchievements = achievements.map((achievement) => {
        if (achievement.completed) return achievement;

        let currentValue = 0;

        // Calculate current value based on achievement type
        switch (achievement.id) {
          case 'first_harvest':
          case 'century_club':
          case 'millennium':
          case 'click_master':
            currentValue = achievementStats.totalTaps;
            break;
          case 'first_fortune':
          case 'point_collector':
          case 'wealthy_farmer':
            currentValue = achievementStats.totalPoints;
            break;
          case 'first_upgrade':
            currentValue = upgrades.tapPower + upgrades.energyCapacity + upgrades.autoFarm + upgrades.energyRegen - 4;
            break;
          case 'max_energy':
            currentValue = upgrades.energyCapacity;
            break;
          case 'power_tapper':
            currentValue = upgrades.tapPower;
            break;
          case 'automation_king':
            currentValue = upgrades.autoFarm;
            break;
          case 'energy_master':
            currentValue = upgrades.energyRegen;
            break;
          case 'perfect_farm':
            currentValue = upgrades.tapPower + upgrades.energyCapacity + upgrades.autoFarm + upgrades.energyRegen;
            break;
          case 'beginner':
          case 'advanced':
          case 'master':
            currentValue = level;
            break;
          case 'night_owl':
            currentValue = isNightTime() ? 1 : 0;
            break;
          case 'dedicated':
            currentValue = achievementStats.loginStreak;
            break;
          case 'veteran':
            currentValue = achievementStats.playTime;
            break;
          case 'quest_master':
            currentValue = achievementStats.totalQuests;
            break;
          default:
            currentValue = 0;
        }

        // Check if achievement should be completed
        if (checkAchievement(achievement, currentValue)) {
          return {
            ...achievement,
            completed: true,
            completedAt: new Date(),
          };
        }

        return achievement;
      });

      return { achievements: updatedAchievements };
    });
  },

  // Complete achievement and give reward
  completeAchievement: (id: string) => {
    set((state) => {
      const achievement = state.achievements.find((a) => a.id === id);
      if (!achievement || achievement.completed) return state;

      const updatedAchievements = state.achievements.map((a) =>
        a.id === id ? { ...a, completed: true, completedAt: new Date() } : a
      );

      return {
        achievements: updatedAchievements,
        points: state.points + achievement.reward,
        totalPoints: state.totalPoints + achievement.reward,
      };
    });
  },

  // Update achievement stats
  updateAchievementStats: (type, amount = 1) => {
    set((state) => {
      const newStats = { ...state.achievementStats };

      switch (type) {
        case 'tap':
          newStats.totalTaps += amount;
          break;
        case 'points':
          newStats.totalPoints += amount;
          break;
        case 'quest':
          newStats.totalQuests += amount;
          break;
        case 'playTime':
          newStats.playTime += amount;
          break;
      }

      return { achievementStats: newStats };
    });

    // Check achievements after stats update
    get().checkAchievements();
  },

  // Save game
  saveGame: async () => {
    const state = get();
    if (!state.userId) return;

    try {
      get().setSaveStatus('saving');

      // SaveGameInput 형식으로 변환 (undefined 필드 제외)
      const gameInput: SaveGameInput = {
        userId: state.userId,
        points: state.points,
        totalPoints: state.totalPoints,
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        level: state.level,
        upgrades: state.upgrades,
        dailyQuests: state.dailyQuests.map(q => ({
          ...q,
          createdAt: Timestamp.now(),
        })),
        dailyQuestStats: state.dailyQuestStats,
        achievements: state.achievements.map(a => {
          // completedAt이 있을 때만 포함
          const achievement: any = {
            id: a.id,
            title: a.title,
            description: a.description,
            icon: a.icon,
            reward: a.reward,
            category: a.category,
            target: a.target,
            completed: a.completed,
          };
          if (a.completedAt) {
            achievement.completedAt = Timestamp.now();
          }
          return achievement;
        }),
        achievementStats: state.achievementStats,
        lastActiveTime: Date.now(),
        lastClaimedPoints: state.lastClaimedPoints,
        totalClaimedTokens: state.totalClaimedTokens,
        lastClaimTime: state.lastClaimTime,
      };

      // Firestore에 저장
      await saveGameStateFirestore(gameInput);
      
      // 리더보드도 업데이트
      await updateLeaderboard(
        state.userId,
        'Player',
        state.totalPoints,
        state.level
      );
      
      get().setSaveStatus('success');
    } catch (error) {
      console.error('Failed to save game:', error);
      get().setSaveStatus('error', 'Failed to save game');
    }
  },

  // Load game
  loadGame: async (userId: string) => {
    set({ isLoading: true });
    
    try {
      // Ensure global stats exist (initialize if needed)
      await ensureGlobalStatsExists();
      
      // Firestore에서 데이터 로드
      const savedState = await loadGameStateFirestore(userId);
      
      if (savedState) {
        // Calculate offline earnings
        const now = Date.now();
        const elapsed = (now - savedState.lastActiveTime) / 1000; // seconds
        const maxOfflineSeconds = GAME_CONFIG.MAX_OFFLINE_HOURS * 3600;
        const offlineSeconds = Math.min(elapsed, maxOfflineSeconds);
        
        const autoFarmLevel = savedState.upgrades.autoFarm;
        const pointsPerSecond = UPGRADES.autoFarm.getEffect(autoFarmLevel);
        const offlineEarnings = Math.floor(offlineSeconds * pointsPerSecond);
        
        // Calculate offline energy regeneration (50% speed)
        const offlineMinutes = offlineSeconds / 60; // Convert to minutes
        const energyRegenLevel = savedState.upgrades.energyRegen;
        const regenPerMinute = UPGRADES.energyRegen.getEffect(energyRegenLevel);
        const offlineEnergyRegen = offlineMinutes * regenPerMinute * 0.5; // 50% speed offline
        const newEnergy = Math.min(
          savedState.energy + Math.floor(offlineEnergyRegen), 
          savedState.maxEnergy
        );
        
        // Debug logging
        console.log('🔍 Offline Debug:', {
          elapsed: `${Math.floor(elapsed)}s (${Math.floor(offlineMinutes)}min)`,
          autoFarmLevel,
          pointsPerSecond,
          offlineEarnings,
          energyRegenLevel,
          regenPerMinute,
          offlineEnergyRegen: Math.floor(offlineEnergyRegen),
          savedEnergy: savedState.energy,
          newEnergy,
        });
        
        // Show modal only if offline earnings > 0 and was away for > 60 seconds
        const shouldShowModal = offlineEarnings > 0 && elapsed > 60;
        
        set({
          userId,
          points: savedState.points + offlineEarnings,
          totalPoints: savedState.totalPoints + offlineEarnings,
          energy: newEnergy, // Offline energy regeneration applied
          maxEnergy: savedState.maxEnergy,
          level: savedState.level,
          upgrades: savedState.upgrades,
          dailyQuestStats: savedState.dailyQuestStats,
          achievementStats: savedState.achievementStats,
          lastActiveTime: now,
          isLoading: false,
          offlineEarnings: shouldShowModal ? offlineEarnings : 0,
          offlineTime: shouldShowModal ? Math.floor(offlineSeconds) : 0,
          showOfflineModal: shouldShowModal,
          lastClaimedPoints: savedState.lastClaimedPoints || 0,
          totalClaimedTokens: savedState.totalClaimedTokens || 0,
          lastClaimTime: savedState.lastClaimTime || 0,
        });

        // Load global mining stats from Firestore
        try {
          const globalStats = await getGlobalMiningStats();
          set({ globalTotalMined: globalStats.totalMined });
          console.log('✅ Global mining stats loaded:', globalStats.totalMined);
        } catch (error) {
          console.error('❌ Failed to load global stats, using 0:', error);
          set({ globalTotalMined: 0 });
        }

        // Initialize or reset daily quests
        get().initializeDailyQuests();
        get().checkQuestReset();
        
        // Initialize achievements
        get().initializeAchievements();
        get().checkAchievements();
        
        // Check level up based on loaded totalPoints
        get().checkLevelUp();
      } else {
        // 신규 사용자 - Firestore에 생성
        await createUser(userId);
        
        set({ 
          userId, 
          isLoading: false,
        });

        // Load global mining stats from Firestore
        try {
          const globalStats = await getGlobalMiningStats();
          set({ globalTotalMined: globalStats.totalMined });
          console.log('✅ Global mining stats loaded (new user):', globalStats.totalMined);
        } catch (error) {
          console.error('❌ Failed to load global stats, using 0:', error);
          set({ globalTotalMined: 0 });
        }

        // Initialize quests and achievements for new player
        get().initializeDailyQuests();
        get().initializeAchievements();
        get().checkLevelUp();
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      set({ isLoading: false });
    }
  },

  // Token Reward Functions
  getClaimableTokenAmount: () => {
    const state = get();
    return getClaimableTokensWithMining(
      state.totalPoints,
      state.lastClaimedPoints,
      state.globalTotalMined
    );
  },

  canClaimTokens: () => {
    const state = get();
    return canClaimTokensWithMining(
      state.totalPoints,
      state.lastClaimedPoints,
      state.globalTotalMined
    );
  },

  getPointsUntilNextClaim: () => {
    const state = get();
    return getPointsUntilNextClaimWithMining(
      state.totalPoints,
      state.lastClaimedPoints,
      state.globalTotalMined
    );
  },

  getCurrentConversionRate: () => {
    const state = get();
    return getCurrentConversionRate(state.globalTotalMined);
  },

  getMiningStats: () => {
    const state = get();
    return getMiningStats(state.globalTotalMined);
  },

  setGlobalTotalMined: (amount: number) => {
    set({ globalTotalMined: amount });
  },

  recordTokenClaim: async (amount: number, transactionHash?: string) => {
    const state = get();
    
    // Update local state first
    set({
      lastClaimedPoints: state.totalPoints,
      totalClaimedTokens: state.totalClaimedTokens + amount,
      lastClaimTime: Date.now(),
      globalTotalMined: state.globalTotalMined + amount, // 로컬 상태 즉시 업데이트
    });
    
    console.log('✅ Token claim recorded (local):', {
      amount,
      totalPoints: state.totalPoints,
      totalClaimedTokens: state.totalClaimedTokens + amount,
      globalTotalMined: state.globalTotalMined + amount,
      transactionHash,
    });

    // Update Firestore stats asynchronously
    if (state.userId) {
      try {
        const miningStats = getMiningStats(state.globalTotalMined);
        const claimRecord: ClaimRecord = {
          amount,
          points: state.totalPoints - state.lastClaimedPoints,
          timestamp: FirestoreTimestamp.now(),
          txHash: transactionHash,
          conversionRate: getCurrentConversionRate(state.globalTotalMined),
          epoch: miningStats.currentEpoch?.epoch ?? 1, // 기본값 1 (Genesis Era)
        };

        await updateAllMiningStats(amount, state.userId, claimRecord);
        console.log('✅ Firestore mining stats updated');
      } catch (error) {
        console.error('❌ Failed to update Firestore stats:', error);
        // Non-critical error - local state already updated
      }
    }
  },

  // Reset game
  resetGame: () => {
    set({
      points: 0,
      totalPoints: 0,
      energy: GAME_CONFIG.INITIAL_ENERGY,
      maxEnergy: GAME_CONFIG.INITIAL_MAX_ENERGY,
      level: GAME_CONFIG.INITIAL_LEVEL,
      upgrades: {
        tapPower: 1,
        autoFarm: 0,
        energyCapacity: 1,
        energyRegen: 1,
      },
      lastActiveTime: Date.now(),
      lastClaimedPoints: 0,
      totalClaimedTokens: 0,
      lastClaimTime: 0,
      globalTotalMined: 0,
    });
  },
}));

import Dexie, { Table } from 'dexie';

// Game state interface
export interface GameState {
  userId: string;
  points: number;
  totalPoints: number;
  energy: number;
  level: number;
  upgrades: {
    tapPower: number;
    autoFarm: number;
    energyCapacity: number;
    energyRegen: number;
  };
  lastActiveTime: number;
  createdAt: number;
  updatedAt: number;
}

// Settings interface
export interface GameSettings {
  userId: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  language: string;
  theme: 'light' | 'dark';
}

// Database class
class GameDatabase extends Dexie {
  gameState!: Table<GameState, string>;
  settings!: Table<GameSettings, string>;

  constructor() {
    super('MiMiGCarbonFarm');
    
    this.version(1).stores({
      gameState: 'userId, points, level, updatedAt',
      settings: 'userId',
    });
  }
}

// Create database instance
export const db = new GameDatabase();

// Helper functions
export const saveGameState = async (state: GameState): Promise<void> => {
  try {
    await db.gameState.put({
      ...state,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = async (userId: string): Promise<GameState | null> => {
  try {
    const state = await db.gameState.get(userId);
    return state || null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const saveSettings = async (settings: GameSettings): Promise<void> => {
  try {
    await db.settings.put(settings);
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettings = async (userId: string): Promise<GameSettings | null> => {
  try {
    const settings = await db.settings.get(userId);
    return settings || null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
};

export const clearGameData = async (userId: string): Promise<void> => {
  try {
    await db.gameState.delete(userId);
    await db.settings.delete(userId);
  } catch (error) {
    console.error('Failed to clear game data:', error);
  }
};

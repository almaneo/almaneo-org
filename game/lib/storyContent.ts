/**
 * Story Content System
 * AlmaNEO Kindness Game
 *
 * Provides:
 * - Opening story (5 scenes)
 * - Level milestone messages
 * - Narrative elements
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface StoryScene {
  id: number;
  text: string;
  image: string;
}

export interface StoryMilestone {
  level: number;
  title: string;
  message: string;
  emoji: string;
}

// ============================================================================
// Opening Story (5 Scenes)
// ============================================================================

export const openingStory: StoryScene[] = [
  {
    id: 1,
    text: "In a world where 90% of AI resources are controlled by 1% of the population, billions are left behind. You've decided to change this - one act of kindness at a time...",
    image: '/images/story/intro-1.png'
  },
  {
    id: 2,
    text: "AI subscription costs equal 10-30% of monthly income in the Global South. While some create art with AI, others can't even access basic educational tools. This is the AI divide...",
    image: '/images/story/intro-2.png'
  },
  {
    id: 3,
    text: "You discovered AlmaNEO and its mission to democratize AI. Through the Kindness Protocol, you can help bridge this gap. Every action spreads 정(情) - the Korean concept of deep human bonds...",
    image: '/images/story/intro-3.png'
  },
  {
    id: 4,
    text: "With each tap, you're not just earning points - you're contributing to a global movement! Your kindness helps reduce the GAII (Global AI Inequality Index) and brings AI access to those who need it most.",
    image: '/images/story/intro-4.png'
  },
  {
    id: 5,
    text: "Join the AlmaNEO community and become a Kindness Champion! Every action brings us closer to AI equality for all 8 billion humans. Cold Code, Warm Soul - let's grow together! 💙🧡",
    image: '/images/story/intro-5.png'
  }
];

// ============================================================================
// Level Milestones
// ============================================================================

export const storyMilestones: StoryMilestone[] = [
  {
    level: 5,
    title: "Seeds of Kindness (친절의 씨앗)",
    message: "Your journey of spreading kindness has begun!",
    emoji: "🌱"
  },
  {
    level: 10,
    title: "First Connection Made!",
    message: "Your kindness has helped someone access AI tools for the first time!",
    emoji: "🤝"
  },
  {
    level: 15,
    title: "Growing Impact",
    message: "Your 정(情) is spreading - more people are joining the movement!",
    emoji: "💪"
  },
  {
    level: 20,
    title: "Community Builder",
    message: "You're building bridges between the digital divide. Keep going!",
    emoji: "👥"
  },
  {
    level: 25,
    title: "Kindness Ambassador",
    message: "Your Jeong-SBT is gaining recognition in the community!",
    emoji: "⭐"
  },
  {
    level: 30,
    title: "AI Equality Champion",
    message: "Your contributions are measurably reducing the GAII index!",
    emoji: "🌍"
  },
  {
    level: 40,
    title: "Regional Impact",
    message: "Your kindness network is expanding across regions!",
    emoji: "🚀"
  },
  {
    level: 50,
    title: "Global Recognition",
    message: "You're recognized as a pioneer in AI democratization!",
    emoji: "🏆"
  },
  {
    level: 75,
    title: "Tree of Warmth (따뜻함의 나무)",
    message: "Your legacy of kindness inspires people around the world!",
    emoji: "🌳"
  },
  {
    level: 100,
    title: "Forest of Humanity (인류의 숲)",
    message: "You've reached the pinnacle! Your 정(情) has created a forest of human connection!",
    emoji: "👑"
  }
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get story milestone for a specific level
 * @param level - User's current level
 * @returns Story milestone or null
 */
export const getStoryMilestone = (level: number): StoryMilestone | null => {
  return storyMilestones.find(m => m.level === level) || null;
};

/**
 * Get all unlocked story milestones
 * @param level - User's current level
 * @returns Array of unlocked milestones
 */
export const getUnlockedMilestones = (level: number): StoryMilestone[] => {
  return storyMilestones.filter(m => m.level <= level);
};

/**
 * Get next milestone
 * @param level - User's current level
 * @returns Next milestone or null
 */
export const getNextMilestone = (level: number): StoryMilestone | null => {
  return storyMilestones.find(m => m.level > level) || null;
};

/**
 * Check if a level has a milestone
 * @param level - Level to check
 * @returns True if milestone exists
 */
export const hasMilestone = (level: number): boolean => {
  return storyMilestones.some(m => m.level === level);
};

/**
 * Get total number of story scenes
 */
export const getTotalScenes = (): number => {
  return openingStory.length;
};

/**
 * Get scene by ID
 * @param id - Scene ID
 * @returns Story scene or null
 */
export const getSceneById = (id: number): StoryScene | null => {
  return openingStory.find(scene => scene.id === id) || null;
};

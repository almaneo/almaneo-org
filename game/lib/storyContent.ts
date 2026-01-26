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
// Opening Story (5 Scenes) - New Story from story.md
// ============================================================================

export const openingStory: StoryScene[] = [
  {
    id: 1,
    text: "The year is 2026. Artificial Intelligence has transformed the world \u2014 but not equally. In gleaming cities, AI writes code, creates art, and diagnoses diseases. Yet for billions across the Global South, even a simple AI chatbot costs more than a day\u2019s wage.",
    image: '/images/story/intro-1.webp'
  },
  {
    id: 2,
    text: "Then you discovered something powerful \u2014 \uc815(\u60C5). A Korean word with no direct translation. It\u2019s the warmth between strangers who share a meal, the bond that forms when humans truly see each other. What if this ancient wisdom could heal the digital divide?",
    image: '/images/story/intro-2.webp'
  },
  {
    id: 3,
    text: "AlmaNEO was born from a simple belief: technology should serve all of humanity. Cold Code, Warm Soul \u2014 combining blockchain\u2019s transparency with the warmth of human kindness. A protocol where every act of compassion is recorded, valued, and rewarded.",
    image: '/images/story/intro-3.webp'
  },
  {
    id: 4,
    text: "Your journey begins now. Travel across 20 countries, learn their cultures, and spread kindness wherever you go. From the temples of Japan to the markets of Kenya, from the caf\u00E9s of Paris to the festivals of Brazil \u2014 every culture has wisdom to share.",
    image: '/images/story/intro-4.webp'
  },
  {
    id: 5,
    text: "Every tap spreads kindness. Every quest bridges cultures. Every connection reduces the AI divide. You are not alone \u2014 8 billion souls, one shared dream. Welcome to AlmaNEO. Let your journey of warmth begin.",
    image: '/images/story/intro-5.webp'
  }
];

// ============================================================================
// Level Milestones
// ============================================================================

export const storyMilestones: StoryMilestone[] = [
  {
    level: 5,
    title: "Seeds of Kindness (\uce5c\uc808\uc758 \uc528\uc557)",
    message: "Your journey of spreading kindness has begun!",
    emoji: "\uD83C\uDF31"
  },
  {
    level: 10,
    title: "First Connection Made!",
    message: "Your kindness has helped someone access AI tools for the first time!",
    emoji: "\uD83E\uDD1D"
  },
  {
    level: 15,
    title: "Growing Impact",
    message: "Your \uc815(\u60C5) is spreading \u2014 more people are joining the movement!",
    emoji: "\uD83D\uDCAA"
  },
  {
    level: 20,
    title: "Community Builder",
    message: "You\u2019re building bridges between the digital divide. Keep going!",
    emoji: "\uD83D\uDC65"
  },
  {
    level: 25,
    title: "Kindness Ambassador",
    message: "Your Jeong-SBT is gaining recognition in the community!",
    emoji: "\u2B50"
  },
  {
    level: 30,
    title: "AI Equality Champion",
    message: "Your contributions are measurably reducing the GAII index!",
    emoji: "\uD83C\uDF0D"
  },
  {
    level: 40,
    title: "Regional Impact",
    message: "Your kindness network is expanding across regions!",
    emoji: "\uD83D\uDE80"
  },
  {
    level: 50,
    title: "Global Recognition",
    message: "You\u2019re recognized as a pioneer in AI democratization!",
    emoji: "\uD83C\uDFC6"
  },
  {
    level: 75,
    title: "Tree of Warmth (\ub530\ub73b\ud568\uc758 \ub098\ubb34)",
    message: "Your legacy of kindness inspires people around the world!",
    emoji: "\uD83C\uDF33"
  },
  {
    level: 100,
    title: "Forest of Humanity (\uc778\ub958\uc758 \uc232)",
    message: "You\u2019ve reached the pinnacle! Your \uc815(\u60C5) has created a forest of human connection!",
    emoji: "\uD83D\uDC51"
  }
];

// ============================================================================
// Helper Functions
// ============================================================================

export const getStoryMilestone = (level: number): StoryMilestone | null => {
  return storyMilestones.find(m => m.level === level) || null;
};

export const getUnlockedMilestones = (level: number): StoryMilestone[] => {
  return storyMilestones.filter(m => m.level <= level);
};

export const getNextMilestone = (level: number): StoryMilestone | null => {
  return storyMilestones.find(m => m.level > level) || null;
};

export const hasMilestone = (level: number): boolean => {
  return storyMilestones.some(m => m.level === level);
};

export const getTotalScenes = (): number => {
  return openingStory.length;
};

export const getSceneById = (id: number): StoryScene | null => {
  return openingStory.find(scene => scene.id === id) || null;
};

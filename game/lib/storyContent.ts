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
  textKey: string;
  image: string;
}

export interface StoryMilestone {
  level: number;
  titleKey: string;
  messageKey: string;
  emoji: string;
}

// ============================================================================
// Opening Story (5 Scenes) - New Story from story.md
// ============================================================================

export const openingStory: StoryScene[] = [
  {
    id: 1,
    textKey: 'story.scene1',
    image: '/images/story/intro-1.webp'
  },
  {
    id: 2,
    textKey: 'story.scene2',
    image: '/images/story/intro-2.webp'
  },
  {
    id: 3,
    textKey: 'story.scene3',
    image: '/images/story/intro-3.webp'
  },
  {
    id: 4,
    textKey: 'story.scene4',
    image: '/images/story/intro-4.webp'
  },
  {
    id: 5,
    textKey: 'story.scene5',
    image: '/images/story/intro-5.webp'
  }
];

// ============================================================================
// Level Milestones
// ============================================================================

export const storyMilestones: StoryMilestone[] = [
  {
    level: 5,
    titleKey: 'milestones.level5.title',
    messageKey: 'milestones.level5.message',
    emoji: "\uD83C\uDF31"
  },
  {
    level: 10,
    titleKey: 'milestones.level10.title',
    messageKey: 'milestones.level10.message',
    emoji: "\uD83E\uDD1D"
  },
  {
    level: 15,
    titleKey: 'milestones.level15.title',
    messageKey: 'milestones.level15.message',
    emoji: "\uD83D\uDCAA"
  },
  {
    level: 20,
    titleKey: 'milestones.level20.title',
    messageKey: 'milestones.level20.message',
    emoji: "\uD83D\uDC65"
  },
  {
    level: 25,
    titleKey: 'milestones.level25.title',
    messageKey: 'milestones.level25.message',
    emoji: "\u2B50"
  },
  {
    level: 30,
    titleKey: 'milestones.level30.title',
    messageKey: 'milestones.level30.message',
    emoji: "\uD83C\uDF0D"
  },
  {
    level: 40,
    titleKey: 'milestones.level40.title',
    messageKey: 'milestones.level40.message',
    emoji: "\uD83D\uDE80"
  },
  {
    level: 50,
    titleKey: 'milestones.level50.title',
    messageKey: 'milestones.level50.message',
    emoji: "\uD83C\uDFC6"
  },
  {
    level: 75,
    titleKey: 'milestones.level75.title',
    messageKey: 'milestones.level75.message',
    emoji: "\uD83C\uDF33"
  },
  {
    level: 100,
    titleKey: 'milestones.level100.title',
    messageKey: 'milestones.level100.message',
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

/**
 * Education Content System
 * 
 * Provides educational information about:
 * - AWD (Alternate Wetting and Drying)
 * - Magnetic Filter Technology
 * - Carbon Credits
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  image: string;
  level: number; // Level at which this content is shown
  category: 'core' | 'ai' | 'impact';
}

// ============================================================================
// Education Content Data
// ============================================================================

export const educationContents: EducationContent[] = [
  {
    id: 'ai-divide',
    title: 'The AI Divide',
    description: `As AI becomes the most powerful tool in human history, a "digital divide" is growing into an "AI divide". 90% of AI development and resources are concentrated in just a few countries.

Challenges:
• High GPU costs prevent local innovation
• Data bias ignores diverse cultures
• Linguistic exclusion (English-centric)
• Economic inequality through automation

AlmaNEO exists to ensure AI is a global public good, not a private monopoly.`,
    image: '/images/education/ai-divide.png',
    level: 10,
    category: 'impact'
  },
  {
    id: 'kindness-protocol',
    title: 'The Kindness Protocol',
    description: `Kindness is the fundamental layer of human intelligence. Our Kindness Protocol uses blockchain to reward human data labeling and cultural context sharing.

How it works:
• Users label cultural and ethical context
• Data is used to align AI models
• Human values are "mined" into the model
• Rewards are distributed via ALMAN tokens

This ensures AI systems share "Cold Code, Warm Soul" values and remain beneficial to humanity.`,
    image: '/images/education/kindness-protocol.png',
    level: 25,
    category: 'core'
  },
  {
    id: 'gaii-index',
    title: 'What is GAII?',
    description: `The GAII (Global AI Inequality Index) measures the gap in AI infrastructure and usage between nations. High GAII means a country is at risk of falling behind in the AI era.

Our Mission:
• Reduce GAII through open-source data
• Provide decentralized compute access
• Empower local communities with AI
• Reach 8 billion humans by 2026

Every tap in this game helps lower the GAII and provides AI access to someone who needs it most.`,
    image: '/images/education/gaii-index.png',
    level: 50,
    category: 'impact'
  }
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get education content for a specific level
 * @param level - User's current level
 * @returns Education content or null if none exists for this level
 */
export const getEducationByLevel = (level: number): EducationContent | null => {
  return educationContents.find(content => content.level === level) || null;
};

/**
 * Get all education content up to a specific level
 * @param level - User's current level
 * @returns Array of education content
 */
export const getUnlockedEducation = (level: number): EducationContent[] => {
  return educationContents.filter(content => content.level <= level);
};

/**
 * Get education content by ID
 * @param id - Content ID
 * @returns Education content or null
 */
export const getEducationById = (id: string): EducationContent | null => {
  return educationContents.find(content => content.id === id) || null;
};

/**
 * Get education content by category
 * @param category - Content category
 * @returns Array of education content
 */
export const getEducationByCategory = (
  category: EducationContent['category']
): EducationContent[] => {
  return educationContents.filter(content => content.category === category);
};

/**
 * Check if a level has education content
 * @param level - Level to check
 * @returns True if content exists
 */
export const hasEducationContent = (level: number): boolean => {
  return educationContents.some(content => content.level === level);
};

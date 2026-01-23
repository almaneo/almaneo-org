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
  category: 'farming' | 'technology' | 'environment';
}

// ============================================================================
// Education Content Data
// ============================================================================

export const educationContents: EducationContent[] = [
  {
    id: 'awd',
    title: 'AWD (Alternate Wetting and Drying)',
    description: `AWD is a revolutionary water management technique that transforms traditional rice farming. Instead of continuously flooding fields, water is alternately applied and drained based on soil moisture levels.

Benefits:
• Reduces water usage by 30%
• Cuts methane emissions by 50%
• Improves rice quality
• Reduces production costs
• Easy to implement

This simple change makes a massive environmental impact while helping farmers save money and resources.`,
    image: '/images/education/awd-diagram.png',
    level: 10,
    category: 'farming'
  },
  {
    id: 'magnetic-filter',
    title: 'Magnetic Filter Technology',
    description: `Our magnetic filtration system is a breakthrough innovation that removes iron and other metallic contaminants from irrigation water.

How it works:
• Water passes through powerful magnetic fields
• Iron particles are attracted and captured
• Clean water flows to rice fields
• No chemicals or electricity needed

Benefits:
• Improves rice quality and yield
• Reduces soil contamination
• Prevents equipment damage
• Environmentally friendly
• Low maintenance cost

This technology helps farmers achieve higher yields while protecting soil health for future generations.`,
    image: '/images/education/magnetic-filter.png',
    level: 25,
    category: 'technology'
  },
  {
    id: 'carbon-credit',
    title: 'Carbon Credits & Climate Impact',
    description: `Carbon credits create economic incentives for environmental protection. When farmers adopt sustainable practices like AWD, they reduce CO2 emissions and can earn carbon credits.

The MiMiG System:
• Measure real CO2 reduction
• Convert to blockchain tokens
• Trade on global markets
• Earn passive income
• Support climate action

Impact:
• 1 ton CO2 reduced = 1 carbon credit
• Credits can be sold to companies
• Creates sustainable income stream
• Rewards environmental stewardship

You're not just playing a game - you're learning about real solutions that help farmers and save our planet!`,
    image: '/images/education/carbon-credit.png',
    level: 50,
    category: 'environment'
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

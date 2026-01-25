/**
 * Kindness Impact Calculation System
 *
 * AlmaNEO AI Hub Game
 * Calculates GAII reduction, humans empowered, and AI reconstruction quality
 * based on user's contribution points
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface KindnessImpact {
    gaiiImprovement: number;      // % improvement in GAII
    humansEmpowered: number;     // Number of humans provided with AI access
    reconstructionQuality: number; // AI model alignment quality %
}

export interface ImpactMessage {
    gaii: string;
    humans: string;
    quality: string;
}

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate GAII improvement in percentage
 * Conversion rate: 10,000 points = 0.01% GAII improvement
 * 
 * @param totalPoints - User's total contribution points
 * @returns GAII improvement %
 */
export const calculateGAIIImprovement = (totalPoints: number): number => {
    if (totalPoints < 0) return 0;
    return (totalPoints / 10000) * 0.01;
};

/**
 * Calculate humans empowered
 * Conversion rate: 10,000 points = 1 human provided with AI access/resources
 * 
 * @param totalPoints - User's total points
 * @returns Number of humans empowered
 */
export const calculateHumansEmpowered = (totalPoints: number): number => {
    if (totalPoints < 0) return 0;
    return Math.floor(totalPoints / 10000);
};

/**
 * Calculate AI reconstruction quality
 * Base 45%, + contribution progress
 * 
 * @param totalPoints - User's total points
 * @returns Quality percentage (max 100%)
 */
export const calculateReconstructionQuality = (totalPoints: number): number => {
    if (totalPoints < 0) return 45.0;
    return Math.min(100, 45 + (totalPoints / 5000));
};

// ============================================================================
// Message Generation
// ============================================================================

/**
 * Generate user-friendly impact messages
 * 
 * @param totalPoints - User's total contribution points
 * @returns Object containing formatted messages
 */
export const getImpactMessage = (totalPoints: number): ImpactMessage => {
    const gaii = calculateGAIIImprovement(totalPoints);
    const humans = calculateHumansEmpowered(totalPoints);
    const quality = calculateReconstructionQuality(totalPoints);

    return {
        gaii: `GAII Improvement: +${gaii.toFixed(2)}%`,
        humans: `${humans.toLocaleString()} Humans Empowered!`,
        quality: `RECON Quality: ${quality.toFixed(1)}%`
    };
};

// ============================================================================
// Complete Impact Calculation
// ============================================================================

/**
 * Calculate complete kindness impact
 * Main function that returns all impact metrics
 * 
 * @param totalPoints - User's total contribution points
 * @returns Complete kindness impact data
 */
export const calculateKindnessImpact = (
    totalPoints: number
): KindnessImpact => {
    return {
        gaiiImprovement: calculateGAIIImprovement(totalPoints),
        humansEmpowered: calculateHumansEmpowered(totalPoints),
        reconstructionQuality: calculateReconstructionQuality(totalPoints)
    };
};

// ============================================================================
// Legacy compatibility (rebranding)
// ============================================================================
export const calculateEnvironmentalImpact = calculateKindnessImpact;

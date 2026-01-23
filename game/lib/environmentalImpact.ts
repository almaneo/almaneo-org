/**
 * Environmental Impact Calculation System
 *
 * MiMiG Carbon Farm Game
 * Calculates CO2 reduction, tree equivalents, and temperature impact
 * based on user's farming points
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface EnvironmentalImpact {
  co2Tons: number;
  treeEquivalent: number;
  temperatureImpact: number;
}

export interface ImpactMessage {
  co2: string;
  trees: string;
  global: string;
}

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate CO2 reduction in tons
 * Conversion rate: 10,000 points = 1 ton CO2
 * 
 * @param totalPoints - User's total farming points
 * @returns CO2 reduction in tons
 */
export const calculateCO2Reduction = (totalPoints: number): number => {
  if (totalPoints < 0) return 0;
  return totalPoints / 10000;
};

/**
 * Calculate tree equivalent
 * Conversion rate: 1 ton CO2 = 50 trees absorbing CO2 for 1 year
 * 
 * @param co2Tons - CO2 reduction in tons
 * @returns Number of trees equivalent
 */
export const calculateTreeEquivalent = (co2Tons: number): number => {
  if (co2Tons < 0) return 0;
  return Math.floor(co2Tons * 50);
};

/**
 * Calculate symbolic temperature impact
 * This is a symbolic representation for user engagement
 * Conversion rate: 1 ton CO2 = 0.0000001°C reduction
 * 
 * @param co2Tons - CO2 reduction in tons
 * @returns Temperature impact in °C
 */
export const calculateTemperatureImpact = (co2Tons: number): number => {
  if (co2Tons < 0) return 0;
  return co2Tons * 0.0000001;
};

// ============================================================================
// Message Generation
// ============================================================================

/**
 * Generate user-friendly impact messages
 * 
 * @param totalPoints - User's total farming points
 * @returns Object containing formatted messages
 */
export const getImpactMessage = (totalPoints: number): ImpactMessage => {
  const co2 = calculateCO2Reduction(totalPoints);
  const trees = calculateTreeEquivalent(co2);
  const temp = calculateTemperatureImpact(co2);
  
  return {
    co2: `${co2.toFixed(2)} tons of CO2 reduced!`,
    trees: `Equal to planting ${trees} trees!`,
    global: `Contributing ${temp.toFixed(8)}°C to cooling our planet!`
  };
};

// ============================================================================
// Complete Impact Calculation
// ============================================================================

/**
 * Calculate complete environmental impact
 * Main function that returns all impact metrics
 * 
 * @param totalPoints - User's total farming points
 * @returns Complete environmental impact data
 */
export const calculateEnvironmentalImpact = (
  totalPoints: number
): EnvironmentalImpact => {
  const co2Tons = calculateCO2Reduction(totalPoints);
  
  return {
    co2Tons,
    treeEquivalent: calculateTreeEquivalent(co2Tons),
    temperatureImpact: calculateTemperatureImpact(co2Tons)
  };
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format CO2 value for display
 * @param co2Tons - CO2 in tons
 * @returns Formatted string
 */
export const formatCO2 = (co2Tons: number): string => {
  return `${co2Tons.toFixed(2)} tons`;
};

/**
 * Format tree count for display
 * @param treeCount - Number of trees
 * @returns Formatted string
 */
export const formatTrees = (treeCount: number): string => {
  return `${treeCount.toLocaleString()} trees`;
};

/**
 * Format temperature impact for display
 * @param tempImpact - Temperature in °C
 * @returns Formatted string
 */
export const formatTemperature = (tempImpact: number): string => {
  return `${tempImpact.toFixed(8)}°C`;
};

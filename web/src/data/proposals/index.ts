/**
 * Proposals Data Module
 * 제안서 데이터 모듈 (다국어 지원)
 */

// Types
export * from './types';

// Proposals - Korean
export { polygonGrantProposal, polygonGrantSlides } from './polygon-grant';

// Proposals - English
export { polygonGrantProposalEn, polygonGrantSlidesEn } from './polygon-grant-en';

// Imports for registry
import { polygonGrantProposal } from './polygon-grant';
import { polygonGrantProposalEn } from './polygon-grant-en';
import type { Proposal, ProposalLanguage, ProposalRegistry } from './types';

// Multi-language Proposal Registry
export const proposalRegistry: ProposalRegistry = {
  'polygon-grant': {
    ko: polygonGrantProposal,
    en: polygonGrantProposalEn,
  },
};

// Legacy single-language registry (backwards compatibility)
export const proposals: Record<string, Proposal> = {
  'polygon-grant': polygonGrantProposal,
};

/**
 * Get proposal by ID and language
 * @param id - Proposal ID (e.g., 'polygon-grant')
 * @param language - Language code (default: 'ko')
 * @returns Proposal object or undefined
 */
export function getProposalById(
  id: string,
  language: ProposalLanguage = 'ko'
): Proposal | undefined {
  const proposalLangs = proposalRegistry[id];
  if (!proposalLangs) return undefined;

  // Return requested language or fallback to Korean
  return proposalLangs[language] || proposalLangs.ko;
}

/**
 * Get available languages for a proposal
 * @param id - Proposal ID
 * @returns Array of available language codes
 */
export function getProposalLanguages(id: string): ProposalLanguage[] {
  const proposalLangs = proposalRegistry[id];
  if (!proposalLangs) return [];
  return Object.keys(proposalLangs) as ProposalLanguage[];
}

/**
 * Get all proposal IDs
 * @returns Array of proposal IDs
 */
export function getProposalIds(): string[] {
  return Object.keys(proposalRegistry);
}

/**
 * Check if a proposal exists
 * @param id - Proposal ID
 * @returns boolean
 */
export function proposalExists(id: string): boolean {
  return id in proposalRegistry;
}

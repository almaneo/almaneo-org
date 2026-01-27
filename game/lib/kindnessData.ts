/**
 * Kindness Scenarios - derived from World Travel country data
 * Used by KindnessCanvas for the main tap gameplay
 *
 * Supports both static (hardcoded) and dynamic (DB-loaded) content.
 */

import { ALL_COUNTRIES } from './worldTravel/countries';
import { contentService } from './contentService';
import type { Country } from './worldTravel/types';
import type { CulturalScenarioData } from './worldTravel/types';

export interface KindnessScenario {
    id: string;
    culture: string;
    flag: string;
    value: string; // The specific cultural value (e.g., Jeong, Omotenashi)
    situation: string;
    options: {
        left: { text: string; isKind: boolean };
        right: { text: string; isKind: boolean };
    };
}

/**
 * Extract all cultural_scenario quests from countries
 * and convert them to KindnessScenario format
 */
function buildScenarios(countries: Country[]): KindnessScenario[] {
    const scenarios: KindnessScenario[] = [];

    for (const country of countries) {
        for (const quest of country.quests) {
            if (quest.type === 'cultural_scenario') {
                const data = quest.data as CulturalScenarioData;
                scenarios.push({
                    id: quest.id,
                    culture: country.name,
                    flag: country.flag,
                    value: data.culturalValue,
                    situation: data.situation,
                    options: data.options,
                });
            }
        }
    }

    return scenarios;
}

// Static fallback (built at module load time from hardcoded data)
const STATIC_SCENARIOS: KindnessScenario[] = buildScenarios(ALL_COUNTRIES);

// Memoization for dynamic scenarios
let cachedDynamicScenarios: KindnessScenario[] | null = null;
let cachedLanguage: string | null = null;

/**
 * Get kindness scenarios - uses DB content when available, static fallback otherwise.
 * Results are memoized until content language changes.
 */
export function getKindnessScenarios(): KindnessScenario[] {
    if (!contentService.isLoaded()) {
        return STATIC_SCENARIOS;
    }

    const currentLang = contentService.getCurrentLanguage();
    if (cachedDynamicScenarios && cachedLanguage === currentLang) {
        return cachedDynamicScenarios;
    }

    cachedDynamicScenarios = buildScenarios(contentService.getCountries());
    cachedLanguage = currentLang;

    // Return static if dynamic build produced nothing (shouldn't happen normally)
    return cachedDynamicScenarios.length > 0 ? cachedDynamicScenarios : STATIC_SCENARIOS;
}

/** @deprecated Use getKindnessScenarios() for dynamic content support */
export const KINDNESS_SCENARIOS: KindnessScenario[] = STATIC_SCENARIOS;

/**
 * Kindness Scenarios - derived from World Travel country data
 * Used by KindnessCanvas for the main tap gameplay
 */

import { ALL_COUNTRIES } from './worldTravel/countries';
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
 * Extract all cultural_scenario quests from travel countries
 * and convert them to KindnessScenario format
 */
function buildScenariosFromCountries(): KindnessScenario[] {
    const scenarios: KindnessScenario[] = [];

    for (const country of ALL_COUNTRIES) {
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

export const KINDNESS_SCENARIOS: KindnessScenario[] = buildScenariosFromCountries();

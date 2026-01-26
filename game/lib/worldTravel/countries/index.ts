import type { Country } from '../types';
import { EAST_ASIA_COUNTRIES } from './eastAsia';
import { SOUTHEAST_ASIA_COUNTRIES } from './southeastAsia';
import { SOUTH_ASIA_COUNTRIES } from './southAsia';
import { MIDDLE_EAST_COUNTRIES } from './middleEast';
import { EUROPE_COUNTRIES } from './europe';
import { AFRICA_COUNTRIES } from './africa';
import { AMERICAS_COUNTRIES } from './americas';
import { OCEANIA_COUNTRIES } from './oceania';

export const ALL_COUNTRIES: Country[] = [
  ...EAST_ASIA_COUNTRIES,
  ...SOUTHEAST_ASIA_COUNTRIES,
  ...SOUTH_ASIA_COUNTRIES,
  ...MIDDLE_EAST_COUNTRIES,
  ...EUROPE_COUNTRIES,
  ...AFRICA_COUNTRIES,
  ...AMERICAS_COUNTRIES,
  ...OCEANIA_COUNTRIES,
];

export function getCountryById(id: string): Country | undefined {
  return ALL_COUNTRIES.find(c => c.id === id);
}

export function getCountriesByRegion(regionId: string): Country[] {
  return ALL_COUNTRIES.filter(c => c.region === regionId);
}

export {
  EAST_ASIA_COUNTRIES,
  SOUTHEAST_ASIA_COUNTRIES,
  SOUTH_ASIA_COUNTRIES,
  MIDDLE_EAST_COUNTRIES,
  EUROPE_COUNTRIES,
  AFRICA_COUNTRIES,
  AMERICAS_COUNTRIES,
  OCEANIA_COUNTRIES,
};

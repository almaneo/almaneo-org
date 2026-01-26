import type { Region } from './types';

export const REGIONS: Region[] = [
  {
    id: 'east_asia',
    name: 'East Asia',
    emoji: '🏯',
    color: '#FF6B6B',
    unlockRequirement: 0, // starting region (if locale matches)
    countries: ['kr', 'jp', 'cn'],
  },
  {
    id: 'southeast_asia',
    name: 'Southeast Asia',
    emoji: '🌴',
    color: '#4ECDC4',
    unlockRequirement: 3,
    countries: ['th', 'vn', 'id'],
  },
  {
    id: 'south_asia',
    name: 'South Asia',
    emoji: '🕌',
    color: '#FFE66D',
    unlockRequirement: 6,
    countries: ['in'],
  },
  {
    id: 'middle_east',
    name: 'Middle East',
    emoji: '🏜️',
    color: '#F7A072',
    unlockRequirement: 8,
    countries: ['tr', 'ae'],
  },
  {
    id: 'europe',
    name: 'Europe',
    emoji: '🏰',
    color: '#A8DADC',
    unlockRequirement: 12,
    countries: ['fr', 'gb', 'de'],
  },
  {
    id: 'africa',
    name: 'Africa',
    emoji: '🌍',
    color: '#E8A87C',
    unlockRequirement: 16,
    countries: ['za', 'ke'],
  },
  {
    id: 'americas',
    name: 'Americas',
    emoji: '🗽',
    color: '#7EC8E3',
    unlockRequirement: 20,
    countries: ['us', 'ca', 'br', 'mx'],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    emoji: '🦘',
    color: '#C3AED6',
    unlockRequirement: 26,
    countries: ['au'],
  },
];

export function getRegionById(id: string) {
  return REGIONS.find(r => r.id === id);
}

export function getRegionForCountry(countryId: string) {
  return REGIONS.find(r => r.countries.includes(countryId));
}

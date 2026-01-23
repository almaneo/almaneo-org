/**
 * GAII 데이터 집계 유틸리티
 */

import type {
  RegionCode,
  RegionGAIIData,
  GlobalGAIIData,
} from './schema';
import {
  REGIONS,
} from './schema';
import { COUNTRY_DATA } from './countries';

// 지역별 집계 계산
export function aggregateByRegion(): RegionGAIIData[] {
  const regionMap = new Map<RegionCode, typeof COUNTRY_DATA>();

  // 국가를 지역별로 그룹화
  for (const country of COUNTRY_DATA) {
    const list = regionMap.get(country.region) || [];
    list.push(country);
    regionMap.set(country.region, list);
  }

  // 각 지역 집계
  return REGIONS.map((regionMeta) => {
    const countries = regionMap.get(regionMeta.code) || [];

    if (countries.length === 0) {
      return {
        code: regionMeta.code,
        name: regionMeta.name,
        nameKo: regionMeta.nameKo,
        avgGaii: 100,
        weightedGaii: 100,
        totalPopulation: 0,
        avgAdoptionRate: 0,
        countryCount: 0,
        countryWithoutData: 0,
        gradeDistribution: { Low: 0, Moderate: 0, High: 0, Critical: 0 },
        trend: 'stable' as const,
        trendValue: 0,
      };
    }

    // 통계 계산
    const totalPopulation = countries.reduce((sum, c) => sum + c.population, 0);
    const avgGaii = countries.reduce((sum, c) => sum + c.gaii, 0) / countries.length;

    // 인구 가중 GAII
    const weightedGaii = countries.reduce(
      (sum, c) => sum + c.gaii * c.population,
      0
    ) / totalPopulation;

    // 평균 채택률 (인구 가중)
    const avgAdoptionRate = countries.reduce(
      (sum, c) => sum + c.adoptionRate * c.population,
      0
    ) / totalPopulation;

    // 등급 분포
    const gradeDistribution = {
      Low: countries.filter((c) => c.gaiiGrade === 'Low').length,
      Moderate: countries.filter((c) => c.gaiiGrade === 'Moderate').length,
      High: countries.filter((c) => c.gaiiGrade === 'High').length,
      Critical: countries.filter((c) => c.gaiiGrade === 'Critical').length,
    };

    // 트렌드 계산 (인구 가중 평균)
    const avgTrendValue = countries.reduce(
      (sum, c) => sum + c.trendValue * c.population,
      0
    ) / totalPopulation;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (avgTrendValue > 0.5) trend = 'down'; // GAII가 개선 (채택률 증가)
    else if (avgTrendValue < -0.2) trend = 'up'; // GAII가 악화

    return {
      code: regionMeta.code,
      name: regionMeta.name,
      nameKo: regionMeta.nameKo,
      avgGaii: Math.round(avgGaii * 10) / 10,
      weightedGaii: Math.round(weightedGaii * 10) / 10,
      totalPopulation: Math.round(totalPopulation * 10) / 10,
      avgAdoptionRate: Math.round(avgAdoptionRate * 10) / 10,
      countryCount: countries.length,
      countryWithoutData: 0, // TODO: 데이터 없는 국가 카운트
      gradeDistribution,
      trend,
      trendValue: Math.round(avgTrendValue * 10) / 10,
    };
  });
}

// 글로벌 집계 계산
export function aggregateGlobal(): GlobalGAIIData {
  const regions = aggregateByRegion();

  // 전체 인구 및 통계
  const totalPopulation = COUNTRY_DATA.reduce((sum, c) => sum + c.population, 0);
  const globalAdoptionRate = COUNTRY_DATA.reduce(
    (sum, c) => sum + c.adoptionRate * c.population,
    0
  ) / totalPopulation;
  const globalGaii = COUNTRY_DATA.reduce(
    (sum, c) => sum + c.gaii * c.population,
    0
  ) / totalPopulation;

  // Global North (NA, EU, OC, 이스라엘, 일본, 한국, 싱가포르, UAE 등)
  const globalNorthCodes = ['NA', 'EU', 'OC'];
  const globalNorthCountries = COUNTRY_DATA.filter(
    (c) => globalNorthCodes.includes(c.region) ||
    ['JPN', 'KOR', 'SGP', 'ARE', 'ISR', 'TWN', 'HKG'].includes(c.iso3)
  );
  const northPop = globalNorthCountries.reduce((sum, c) => sum + c.population, 0);
  const globalNorthAdoption = globalNorthCountries.reduce(
    (sum, c) => sum + c.adoptionRate * c.population,
    0
  ) / northPop;

  // Global South (나머지)
  const globalSouthCountries = COUNTRY_DATA.filter(
    (c) => !globalNorthCodes.includes(c.region) &&
    !['JPN', 'KOR', 'SGP', 'ARE', 'ISR', 'TWN', 'HKG'].includes(c.iso3)
  );
  const southPop = globalSouthCountries.reduce((sum, c) => sum + c.population, 0);
  const globalSouthAdoption = globalSouthCountries.reduce(
    (sum, c) => sum + c.adoptionRate * c.population,
    0
  ) / southPop;

  return {
    globalGaii: Math.round(globalGaii * 10) / 10,
    globalAdoptionRate: Math.round(globalAdoptionRate * 10) / 10,
    totalPopulation: Math.round(totalPopulation),
    globalNorthAdoption: Math.round(globalNorthAdoption * 10) / 10,
    globalSouthAdoption: Math.round(globalSouthAdoption * 10) / 10,
    inequalityGap: Math.round((globalNorthAdoption - globalSouthAdoption) * 10) / 10,
    regions,
    countries: COUNTRY_DATA,
    version: '1.0.0',
    lastUpdated: '2025-H2',
    nextUpdate: '2026-H1',
    dataSources: [
      'Microsoft Global AI Adoption 2025',
      'World Bank Population Data',
      'ITU ICT Statistics',
    ],
  };
}

// 상위/하위 국가 추출
export function getTopCountries(n: number = 10): typeof COUNTRY_DATA {
  return [...COUNTRY_DATA]
    .sort((a, b) => a.gaii - b.gaii) // 낮은 GAII = 좋음
    .slice(0, n);
}

export function getBottomCountries(n: number = 10): typeof COUNTRY_DATA {
  return [...COUNTRY_DATA]
    .sort((a, b) => b.gaii - a.gaii) // 높은 GAII = 나쁨
    .slice(0, n);
}

// 가장 빠르게 개선 중인 국가
export function getFastestImproving(n: number = 10): typeof COUNTRY_DATA {
  return [...COUNTRY_DATA]
    .filter((c) => c.trend === 'up' || c.trendValue > 0)
    .sort((a, b) => b.trendValue - a.trendValue)
    .slice(0, n);
}

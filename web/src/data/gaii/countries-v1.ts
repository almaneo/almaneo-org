/**
 * GAII v1.0 - 50개국 핵심 데이터
 *
 * AlmaNEO GAII Report v1.0 (2026-Q1)
 *
 * 데이터 소스:
 * - Microsoft Global AI Adoption 2025 Report
 * - World Bank Development Indicators 2025
 * - ITU ICT Statistics 2025
 * - UNESCO Education Data 2025
 * - Statista AI Market Data 2025
 *
 * 50개국 선정 기준:
 * - G20 국가 (19개국)
 * - 인구 상위 30개국
 * - 지역별 대표 국가
 */

import type { CountryGAIIData, GAIIIndicators } from './schema';
import { calculateGaiiV1, calculateGaiiGrade } from './schema';

// 4개 지표 기반 국가 데이터 생성
function createCountry(
  iso3: string,
  iso2: string,
  name: string,
  nameKo: string,
  region: CountryGAIIData['region'],
  population: number,
  workingAgePop: number,
  adoptionRate: number,
  paidUserIndex: number,
  indicators: GAIIIndicators,
  trend: CountryGAIIData['trend'],
  trendValue: number
): CountryGAIIData {
  const gaii = calculateGaiiV1(indicators);
  return {
    iso3,
    iso2,
    name,
    nameKo,
    region,
    population,
    workingAgePop,
    adoptionRate,
    paidUserIndex,
    indicators,
    gaii,
    gaiiGrade: calculateGaiiGrade(gaii),
    trend,
    trendValue,
    dataSource: 'AlmaNEO GAII Report v1.0',
    lastUpdated: '2026-Q1',
  };
}

// 지표 헬퍼 함수
function indicators(
  access: number,
  accessDetails: GAIIIndicators['accessDetails'],
  affordability: number,
  affordabilityDetails: GAIIIndicators['affordabilityDetails'],
  language: number,
  languageDetails: GAIIIndicators['languageDetails'],
  skill: number,
  skillDetails: GAIIIndicators['skillDetails']
): GAIIIndicators {
  return {
    access,
    accessDetails,
    affordability,
    affordabilityDetails,
    language,
    languageDetails,
    skill,
    skillDetails,
  };
}

/**
 * 50개국 핵심 데이터 (GAII Report v1.0)
 *
 * 지역별 분포:
 * - 북미 (3): USA, CAN, MEX
 * - 유럽 (12): GBR, FRA, DEU, ITA, ESP, NLD, POL, SWE, CHE, RUS, UKR, TUR
 * - 동아시아 (5): CHN, JPN, KOR, TWN, HKG
 * - 남아시아 (4): IND, PAK, BGD, LKA
 * - 동남아시아 (8): IDN, THA, VNM, PHL, MYS, SGP, MMR, KHM
 * - 중남미 (6): BRA, ARG, COL, CHL, PER, VEN
 * - 중동/북아프리카 (6): ARE, SAU, ISR, EGY, IRN, MAR
 * - 사하라 이남 아프리카 (4): NGA, ZAF, KEN, ETH
 * - 오세아니아 (2): AUS, NZL
 */
export const COUNTRY_DATA_V1: CountryGAIIData[] = [
  // ===== North America (NA) - 3개국 =====

  // 미국 - 세계 최대 AI 시장, 높은 접근성/기술력
  createCountry(
    'USA', 'US', 'United States', '미국', 'NA',
    334.9, 65, 28.3, 98,
    indicators(
      85, { aiAdoptionRate: 28.3, internetPenetration: 92, mobileConnectivity: 95, infrastructureQuality: 92 },
      75, { aiCostToIncome: 1.5, freeServiceAccess: 85, purchasingPower: 95 },
      98, { nativeLanguageSupport: 100, translationQuality: 98, localContentAvailability: 100 },
      88, { aiLiteracy: 75, stemEducation: 85, digitalSkills: 90 }
    ),
    'stable', 0.5
  ),

  // 캐나다 - 높은 인터넷 보급률, 다국어 지원
  createCountry(
    'CAN', 'CA', 'Canada', '캐나다', 'NA',
    40.1, 67, 33.5, 80,
    indicators(
      82, { aiAdoptionRate: 33.5, internetPenetration: 94, mobileConnectivity: 92, infrastructureQuality: 88 },
      78, { aiCostToIncome: 1.8, freeServiceAccess: 82, purchasingPower: 90 },
      95, { nativeLanguageSupport: 100, translationQuality: 95, localContentAvailability: 95 },
      85, { aiLiteracy: 72, stemEducation: 82, digitalSkills: 88 }
    ),
    'up', 1.2
  ),

  // 멕시코 - 성장하는 시장, 비용 장벽 존재
  createCountry(
    'MEX', 'MX', 'Mexico', '멕시코', 'NA',
    130.2, 66, 12.8, 34,
    indicators(
      45, { aiAdoptionRate: 12.8, internetPenetration: 72, mobileConnectivity: 85, infrastructureQuality: 55 },
      42, { aiCostToIncome: 8.5, freeServiceAccess: 60, purchasingPower: 45 },
      75, { nativeLanguageSupport: 95, translationQuality: 85, localContentAvailability: 70 },
      48, { aiLiteracy: 35, stemEducation: 45, digitalSkills: 52 }
    ),
    'up', 2.1
  ),

  // ===== Europe (EU) - 12개국 =====

  // 영국 - 높은 AI 채택률, 강한 기술 생태계
  createCountry(
    'GBR', 'GB', 'United Kingdom', '영국', 'EU',
    67.7, 63, 38.9, 88,
    indicators(
      88, { aiAdoptionRate: 38.9, internetPenetration: 96, mobileConnectivity: 94, infrastructureQuality: 90 },
      72, { aiCostToIncome: 2.0, freeServiceAccess: 80, purchasingPower: 85 },
      98, { nativeLanguageSupport: 100, translationQuality: 98, localContentAvailability: 100 },
      86, { aiLiteracy: 78, stemEducation: 80, digitalSkills: 88 }
    ),
    'up', 1.8
  ),

  // 프랑스 - 유럽 AI 허브, 다국어 지원 우수
  createCountry(
    'FRA', 'FR', 'France', '프랑스', 'EU',
    68.1, 62, 44.0, 82,
    indicators(
      85, { aiAdoptionRate: 44.0, internetPenetration: 92, mobileConnectivity: 91, infrastructureQuality: 88 },
      70, { aiCostToIncome: 2.2, freeServiceAccess: 78, purchasingPower: 82 },
      92, { nativeLanguageSupport: 95, translationQuality: 92, localContentAvailability: 90 },
      82, { aiLiteracy: 70, stemEducation: 78, digitalSkills: 85 }
    ),
    'up', 2.3
  ),

  // 독일 - 제조업 AI 선두, 높은 기술력
  createCountry(
    'DEU', 'DE', 'Germany', '독일', 'EU',
    84.4, 64, 26.5, 82,
    indicators(
      80, { aiAdoptionRate: 26.5, internetPenetration: 93, mobileConnectivity: 90, infrastructureQuality: 92 },
      74, { aiCostToIncome: 1.8, freeServiceAccess: 75, purchasingPower: 88 },
      88, { nativeLanguageSupport: 90, translationQuality: 90, localContentAvailability: 85 },
      88, { aiLiteracy: 72, stemEducation: 88, digitalSkills: 85 }
    ),
    'up', 1.5
  ),

  // 이탈리아 - 성장 중인 시장
  createCountry(
    'ITA', 'IT', 'Italy', '이탈리아', 'EU',
    58.9, 63, 25.8, 68,
    indicators(
      72, { aiAdoptionRate: 25.8, internetPenetration: 85, mobileConnectivity: 88, infrastructureQuality: 78 },
      65, { aiCostToIncome: 3.0, freeServiceAccess: 70, purchasingPower: 75 },
      82, { nativeLanguageSupport: 85, translationQuality: 85, localContentAvailability: 80 },
      72, { aiLiteracy: 58, stemEducation: 72, digitalSkills: 75 }
    ),
    'up', 1.2
  ),

  // 스페인 - 높은 모바일 연결성
  createCountry(
    'ESP', 'ES', 'Spain', '스페인', 'EU',
    47.6, 66, 39.7, 75,
    indicators(
      78, { aiAdoptionRate: 39.7, internetPenetration: 93, mobileConnectivity: 92, infrastructureQuality: 80 },
      62, { aiCostToIncome: 3.5, freeServiceAccess: 72, purchasingPower: 70 },
      88, { nativeLanguageSupport: 95, translationQuality: 90, localContentAvailability: 85 },
      70, { aiLiteracy: 55, stemEducation: 68, digitalSkills: 75 }
    ),
    'up', 2.0
  ),

  // 네덜란드 - 높은 디지털 역량
  createCountry(
    'NLD', 'NL', 'Netherlands', '네덜란드', 'EU',
    17.8, 65, 38.9, 84,
    indicators(
      88, { aiAdoptionRate: 38.9, internetPenetration: 98, mobileConnectivity: 95, infrastructureQuality: 92 },
      76, { aiCostToIncome: 1.5, freeServiceAccess: 82, purchasingPower: 88 },
      85, { nativeLanguageSupport: 80, translationQuality: 90, localContentAvailability: 85 },
      90, { aiLiteracy: 80, stemEducation: 85, digitalSkills: 92 }
    ),
    'up', 1.7
  ),

  // 폴란드 - 동유럽 기술 허브
  createCountry(
    'POL', 'PL', 'Poland', '폴란드', 'EU',
    37.7, 68, 26.4, 58,
    indicators(
      68, { aiAdoptionRate: 26.4, internetPenetration: 87, mobileConnectivity: 85, infrastructureQuality: 72 },
      58, { aiCostToIncome: 4.5, freeServiceAccess: 68, purchasingPower: 60 },
      72, { nativeLanguageSupport: 70, translationQuality: 78, localContentAvailability: 65 },
      70, { aiLiteracy: 55, stemEducation: 72, digitalSkills: 70 }
    ),
    'up', 2.2
  ),

  // 스웨덴 - 디지털 선진국
  createCountry(
    'SWE', 'SE', 'Sweden', '스웨덴', 'EU',
    10.5, 62, 31.2, 83,
    indicators(
      90, { aiAdoptionRate: 31.2, internetPenetration: 96, mobileConnectivity: 94, infrastructureQuality: 95 },
      80, { aiCostToIncome: 1.2, freeServiceAccess: 85, purchasingPower: 92 },
      82, { nativeLanguageSupport: 75, translationQuality: 88, localContentAvailability: 80 },
      92, { aiLiteracy: 82, stemEducation: 90, digitalSkills: 94 }
    ),
    'up', 1.5
  ),

  // 스위스 - 최고 수준 인프라
  createCountry(
    'CHE', 'CH', 'Switzerland', '스위스', 'EU',
    8.8, 67, 32.4, 89,
    indicators(
      92, { aiAdoptionRate: 32.4, internetPenetration: 96, mobileConnectivity: 95, infrastructureQuality: 98 },
      82, { aiCostToIncome: 0.8, freeServiceAccess: 80, purchasingPower: 98 },
      85, { nativeLanguageSupport: 80, translationQuality: 90, localContentAvailability: 85 },
      90, { aiLiteracy: 78, stemEducation: 92, digitalSkills: 90 }
    ),
    'up', 1.4
  ),

  // 러시아 - 대규모 시장, 제한된 접근성
  createCountry(
    'RUS', 'RU', 'Russia', '러시아', 'EU',
    144.1, 68, 15.0, 45,
    indicators(
      55, { aiAdoptionRate: 15.0, internetPenetration: 85, mobileConnectivity: 80, infrastructureQuality: 65 },
      52, { aiCostToIncome: 5.0, freeServiceAccess: 55, purchasingPower: 50 },
      75, { nativeLanguageSupport: 80, translationQuality: 78, localContentAvailability: 70 },
      68, { aiLiteracy: 55, stemEducation: 75, digitalSkills: 62 }
    ),
    'stable', 0.2
  ),

  // 우크라이나 - 전쟁으로 인한 인프라 피해
  createCountry(
    'UKR', 'UA', 'Ukraine', '우크라이나', 'EU',
    37.0, 68, 7.2, 20,
    indicators(
      35, { aiAdoptionRate: 7.2, internetPenetration: 70, mobileConnectivity: 65, infrastructureQuality: 40 },
      38, { aiCostToIncome: 12.0, freeServiceAccess: 50, purchasingPower: 25 },
      62, { nativeLanguageSupport: 65, translationQuality: 70, localContentAvailability: 55 },
      55, { aiLiteracy: 45, stemEducation: 68, digitalSkills: 50 }
    ),
    'down', -0.5
  ),

  // 터키 - 젊은 인구, 성장 잠재력
  createCountry(
    'TUR', 'TR', 'Turkey', '터키', 'ME',
    85.8, 67, 10.5, 35,
    indicators(
      48, { aiAdoptionRate: 10.5, internetPenetration: 82, mobileConnectivity: 85, infrastructureQuality: 65 },
      40, { aiCostToIncome: 9.0, freeServiceAccess: 55, purchasingPower: 40 },
      68, { nativeLanguageSupport: 70, translationQuality: 72, localContentAvailability: 60 },
      52, { aiLiteracy: 38, stemEducation: 55, digitalSkills: 55 }
    ),
    'up', 1.5
  ),

  // ===== East Asia (EA) - 5개국 =====

  // 중국 - 자체 AI 생태계, 언어 장벽
  createCountry(
    'CHN', 'CN', 'China', '중국', 'EA',
    1412.0, 70, 18.5, 55,
    indicators(
      72, { aiAdoptionRate: 18.5, internetPenetration: 75, mobileConnectivity: 92, infrastructureQuality: 85 },
      65, { aiCostToIncome: 3.5, freeServiceAccess: 75, purchasingPower: 55 },
      88, { nativeLanguageSupport: 95, translationQuality: 85, localContentAvailability: 90 },
      72, { aiLiteracy: 55, stemEducation: 80, digitalSkills: 70 }
    ),
    'up', 3.2
  ),

  // 일본 - 높은 기술력, 언어 특화 시장
  createCountry(
    'JPN', 'JP', 'Japan', '일본', 'EA',
    124.0, 59, 23.1, 74,
    indicators(
      82, { aiAdoptionRate: 23.1, internetPenetration: 93, mobileConnectivity: 95, infrastructureQuality: 95 },
      72, { aiCostToIncome: 2.0, freeServiceAccess: 75, purchasingPower: 82 },
      85, { nativeLanguageSupport: 90, translationQuality: 88, localContentAvailability: 85 },
      88, { aiLiteracy: 68, stemEducation: 90, digitalSkills: 85 }
    ),
    'up', 1.8
  ),

  // 한국 - 최고 수준 인터넷 인프라
  createCountry(
    'KOR', 'KR', 'South Korea', '대한민국', 'EA',
    51.7, 72, 30.7, 94,
    indicators(
      92, { aiAdoptionRate: 30.7, internetPenetration: 98, mobileConnectivity: 99, infrastructureQuality: 98 },
      78, { aiCostToIncome: 1.5, freeServiceAccess: 82, purchasingPower: 85 },
      88, { nativeLanguageSupport: 92, translationQuality: 90, localContentAvailability: 85 },
      90, { aiLiteracy: 78, stemEducation: 92, digitalSkills: 92 }
    ),
    'up', 5.8
  ),

  // 대만 - 반도체 강국, 높은 기술력
  createCountry(
    'TWN', 'TW', 'Taiwan', '대만', 'EA',
    23.9, 71, 26.4, 70,
    indicators(
      85, { aiAdoptionRate: 26.4, internetPenetration: 92, mobileConnectivity: 95, infrastructureQuality: 90 },
      75, { aiCostToIncome: 2.0, freeServiceAccess: 78, purchasingPower: 80 },
      82, { nativeLanguageSupport: 88, translationQuality: 85, localContentAvailability: 80 },
      85, { aiLiteracy: 72, stemEducation: 88, digitalSkills: 85 }
    ),
    'up', 2.5
  ),

  // 홍콩 - 금융 허브, 높은 접근성
  createCountry(
    'HKG', 'HK', 'Hong Kong', '홍콩', 'EA',
    7.5, 70, 22.5, 72,
    indicators(
      88, { aiAdoptionRate: 22.5, internetPenetration: 95, mobileConnectivity: 96, infrastructureQuality: 95 },
      70, { aiCostToIncome: 1.8, freeServiceAccess: 75, purchasingPower: 85 },
      90, { nativeLanguageSupport: 92, translationQuality: 90, localContentAvailability: 88 },
      85, { aiLiteracy: 72, stemEducation: 85, digitalSkills: 88 }
    ),
    'up', 1.8
  ),

  // ===== South Asia (SA) - 4개국 =====

  // 인도 - 대규모 시장, 언어 다양성 과제
  createCountry(
    'IND', 'IN', 'India', '인도', 'SA',
    1428.6, 67, 13.0, 35,
    indicators(
      42, { aiAdoptionRate: 13.0, internetPenetration: 52, mobileConnectivity: 78, infrastructureQuality: 50 },
      35, { aiCostToIncome: 12.0, freeServiceAccess: 55, purchasingPower: 30 },
      55, { nativeLanguageSupport: 45, translationQuality: 60, localContentAvailability: 50 },
      50, { aiLiteracy: 35, stemEducation: 55, digitalSkills: 48 }
    ),
    'up', 2.8
  ),

  // 파키스탄 - 젊은 인구, 인프라 부족
  createCountry(
    'PAK', 'PK', 'Pakistan', '파키스탄', 'SA',
    240.5, 60, 4.5, 7,
    indicators(
      22, { aiAdoptionRate: 4.5, internetPenetration: 35, mobileConnectivity: 55, infrastructureQuality: 30 },
      18, { aiCostToIncome: 25.0, freeServiceAccess: 35, purchasingPower: 15 },
      38, { nativeLanguageSupport: 35, translationQuality: 45, localContentAvailability: 30 },
      30, { aiLiteracy: 18, stemEducation: 35, digitalSkills: 28 }
    ),
    'up', 0.8
  ),

  // 방글라데시 - 성장하는 디지털 경제
  createCountry(
    'BGD', 'BD', 'Bangladesh', '방글라데시', 'SA',
    173.0, 66, 4.2, 6,
    indicators(
      20, { aiAdoptionRate: 4.2, internetPenetration: 38, mobileConnectivity: 62, infrastructureQuality: 28 },
      15, { aiCostToIncome: 28.0, freeServiceAccess: 30, purchasingPower: 12 },
      32, { nativeLanguageSupport: 30, translationQuality: 40, localContentAvailability: 25 },
      28, { aiLiteracy: 15, stemEducation: 32, digitalSkills: 28 }
    ),
    'up', 0.9
  ),

  // 스리랑카 - 높은 교육 수준
  createCountry(
    'LKA', 'LK', 'Sri Lanka', '스리랑카', 'SA',
    22.2, 65, 5.5, 9,
    indicators(
      28, { aiAdoptionRate: 5.5, internetPenetration: 52, mobileConnectivity: 68, infrastructureQuality: 40 },
      22, { aiCostToIncome: 18.0, freeServiceAccess: 40, purchasingPower: 22 },
      42, { nativeLanguageSupport: 38, translationQuality: 48, localContentAvailability: 35 },
      45, { aiLiteracy: 28, stemEducation: 55, digitalSkills: 42 }
    ),
    'up', 0.7
  ),

  // ===== Southeast Asia (SEA) - 8개국 =====

  // 인도네시아 - 동남아 최대 시장
  createCountry(
    'IDN', 'ID', 'Indonesia', '인도네시아', 'SEA',
    277.5, 67, 12.2, 30,
    indicators(
      38, { aiAdoptionRate: 12.2, internetPenetration: 62, mobileConnectivity: 78, infrastructureQuality: 48 },
      32, { aiCostToIncome: 10.0, freeServiceAccess: 50, purchasingPower: 32 },
      52, { nativeLanguageSupport: 55, translationQuality: 58, localContentAvailability: 45 },
      42, { aiLiteracy: 30, stemEducation: 45, digitalSkills: 42 }
    ),
    'up', 2.2
  ),

  // 태국 - 관광/서비스 AI 성장
  createCountry(
    'THA', 'TH', 'Thailand', '태국', 'SEA',
    71.8, 70, 12.5, 32,
    indicators(
      42, { aiAdoptionRate: 12.5, internetPenetration: 78, mobileConnectivity: 85, infrastructureQuality: 55 },
      38, { aiCostToIncome: 8.5, freeServiceAccess: 52, purchasingPower: 38 },
      55, { nativeLanguageSupport: 58, translationQuality: 60, localContentAvailability: 48 },
      48, { aiLiteracy: 35, stemEducation: 50, digitalSkills: 50 }
    ),
    'up', 1.8
  ),

  // 베트남 - 빠른 디지털 전환
  createCountry(
    'VNM', 'VN', 'Vietnam', '베트남', 'SEA',
    100.0, 69, 11.5, 27,
    indicators(
      40, { aiAdoptionRate: 11.5, internetPenetration: 72, mobileConnectivity: 82, infrastructureQuality: 52 },
      35, { aiCostToIncome: 9.0, freeServiceAccess: 48, purchasingPower: 35 },
      48, { nativeLanguageSupport: 50, translationQuality: 55, localContentAvailability: 42 },
      52, { aiLiteracy: 38, stemEducation: 58, digitalSkills: 52 }
    ),
    'up', 2.5
  ),

  // 필리핀 - 영어 사용국, BPO 강국
  createCountry(
    'PHL', 'PH', 'Philippines', '필리핀', 'SEA',
    117.3, 63, 11.8, 28,
    indicators(
      38, { aiAdoptionRate: 11.8, internetPenetration: 68, mobileConnectivity: 75, infrastructureQuality: 45 },
      30, { aiCostToIncome: 11.0, freeServiceAccess: 48, purchasingPower: 28 },
      72, { nativeLanguageSupport: 85, translationQuality: 80, localContentAvailability: 60 },
      52, { aiLiteracy: 40, stemEducation: 52, digitalSkills: 55 }
    ),
    'up', 2.0
  ),

  // 말레이시아 - 다문화, 높은 영어 보급
  createCountry(
    'MYS', 'MY', 'Malaysia', '말레이시아', 'SEA',
    34.3, 69, 19.2, 46,
    indicators(
      58, { aiAdoptionRate: 19.2, internetPenetration: 90, mobileConnectivity: 92, infrastructureQuality: 72 },
      52, { aiCostToIncome: 5.5, freeServiceAccess: 62, purchasingPower: 52 },
      78, { nativeLanguageSupport: 82, translationQuality: 80, localContentAvailability: 72 },
      62, { aiLiteracy: 48, stemEducation: 65, digitalSkills: 65 }
    ),
    'up', 2.3
  ),

  // 싱가포르 - 아시아 AI 허브
  createCountry(
    'SGP', 'SG', 'Singapore', '싱가포르', 'SEA',
    6.0, 74, 60.9, 95,
    indicators(
      95, { aiAdoptionRate: 60.9, internetPenetration: 98, mobileConnectivity: 99, infrastructureQuality: 98 },
      85, { aiCostToIncome: 0.8, freeServiceAccess: 88, purchasingPower: 95 },
      95, { nativeLanguageSupport: 98, translationQuality: 95, localContentAvailability: 95 },
      92, { aiLiteracy: 85, stemEducation: 95, digitalSkills: 95 }
    ),
    'up', 2.3
  ),

  // 미얀마 - 정치 불안정, 인프라 부족
  createCountry(
    'MMR', 'MM', 'Myanmar', '미얀마', 'SEA',
    54.8, 66, 2.5, 3,
    indicators(
      15, { aiAdoptionRate: 2.5, internetPenetration: 35, mobileConnectivity: 55, infrastructureQuality: 20 },
      12, { aiCostToIncome: 30.0, freeServiceAccess: 22, purchasingPower: 10 },
      28, { nativeLanguageSupport: 25, translationQuality: 35, localContentAvailability: 20 },
      18, { aiLiteracy: 10, stemEducation: 22, digitalSkills: 18 }
    ),
    'down', -0.3
  ),

  // 캄보디아 - 성장 초기 단계
  createCountry(
    'KHM', 'KH', 'Cambodia', '캄보디아', 'SEA',
    17.0, 63, 2.1, 2,
    indicators(
      18, { aiAdoptionRate: 2.1, internetPenetration: 52, mobileConnectivity: 65, infrastructureQuality: 25 },
      15, { aiCostToIncome: 22.0, freeServiceAccess: 28, purchasingPower: 12 },
      25, { nativeLanguageSupport: 22, translationQuality: 30, localContentAvailability: 18 },
      22, { aiLiteracy: 12, stemEducation: 28, digitalSkills: 22 }
    ),
    'up', 0.5
  ),

  // ===== Latin America (LA) - 6개국 =====

  // 브라질 - 남미 최대 시장
  createCountry(
    'BRA', 'BR', 'Brazil', '브라질', 'LA',
    216.4, 69, 14.1, 40,
    indicators(
      48, { aiAdoptionRate: 14.1, internetPenetration: 75, mobileConnectivity: 85, infrastructureQuality: 58 },
      42, { aiCostToIncome: 7.5, freeServiceAccess: 55, purchasingPower: 42 },
      78, { nativeLanguageSupport: 88, translationQuality: 82, localContentAvailability: 70 },
      52, { aiLiteracy: 38, stemEducation: 50, digitalSkills: 55 }
    ),
    'up', 2.0
  ),

  // 아르헨티나 - 높은 교육 수준
  createCountry(
    'ARG', 'AR', 'Argentina', '아르헨티나', 'LA',
    46.2, 64, 15.5, 38,
    indicators(
      52, { aiAdoptionRate: 15.5, internetPenetration: 87, mobileConnectivity: 88, infrastructureQuality: 60 },
      38, { aiCostToIncome: 10.0, freeServiceAccess: 52, purchasingPower: 35 },
      82, { nativeLanguageSupport: 92, translationQuality: 85, localContentAvailability: 75 },
      58, { aiLiteracy: 45, stemEducation: 62, digitalSkills: 58 }
    ),
    'up', 1.5
  ),

  // 콜롬비아 - 성장하는 테크 허브
  createCountry(
    'COL', 'CO', 'Colombia', '콜롬비아', 'LA',
    52.2, 68, 11.2, 26,
    indicators(
      42, { aiAdoptionRate: 11.2, internetPenetration: 72, mobileConnectivity: 80, infrastructureQuality: 52 },
      35, { aiCostToIncome: 9.5, freeServiceAccess: 48, purchasingPower: 32 },
      78, { nativeLanguageSupport: 90, translationQuality: 82, localContentAvailability: 68 },
      48, { aiLiteracy: 35, stemEducation: 50, digitalSkills: 50 }
    ),
    'up', 1.8
  ),

  // 칠레 - 남미 디지털 선진국
  createCountry(
    'CHL', 'CL', 'Chile', '칠레', 'LA',
    19.5, 68, 19.5, 48,
    indicators(
      62, { aiAdoptionRate: 19.5, internetPenetration: 88, mobileConnectivity: 90, infrastructureQuality: 72 },
      55, { aiCostToIncome: 5.0, freeServiceAccess: 62, purchasingPower: 55 },
      82, { nativeLanguageSupport: 92, translationQuality: 85, localContentAvailability: 75 },
      62, { aiLiteracy: 48, stemEducation: 65, digitalSkills: 65 }
    ),
    'up', 1.8
  ),

  // 페루 - 성장 중인 시장
  createCountry(
    'PER', 'PE', 'Peru', '페루', 'LA',
    34.0, 66, 10.8, 24,
    indicators(
      38, { aiAdoptionRate: 10.8, internetPenetration: 65, mobileConnectivity: 78, infrastructureQuality: 48 },
      32, { aiCostToIncome: 10.5, freeServiceAccess: 45, purchasingPower: 30 },
      75, { nativeLanguageSupport: 88, translationQuality: 80, localContentAvailability: 62 },
      42, { aiLiteracy: 30, stemEducation: 45, digitalSkills: 45 }
    ),
    'up', 1.5
  ),

  // 베네수엘라 - 경제 위기, 인프라 악화
  createCountry(
    'VEN', 'VE', 'Venezuela', '베네수엘라', 'LA',
    28.4, 65, 1.4, 1,
    indicators(
      12, { aiAdoptionRate: 1.4, internetPenetration: 35, mobileConnectivity: 45, infrastructureQuality: 18 },
      8, { aiCostToIncome: 35.0, freeServiceAccess: 18, purchasingPower: 5 },
      65, { nativeLanguageSupport: 85, translationQuality: 75, localContentAvailability: 45 },
      25, { aiLiteracy: 18, stemEducation: 35, digitalSkills: 22 }
    ),
    'down', -0.5
  ),

  // ===== Middle East & North Africa (ME) - 6개국 =====

  // UAE - 세계 최고 AI 채택률
  createCountry(
    'ARE', 'AE', 'United Arab Emirates', '아랍에미리트', 'ME',
    10.0, 83, 64.0, 92,
    indicators(
      95, { aiAdoptionRate: 64.0, internetPenetration: 99, mobileConnectivity: 99, infrastructureQuality: 98 },
      88, { aiCostToIncome: 0.5, freeServiceAccess: 85, purchasingPower: 98 },
      85, { nativeLanguageSupport: 82, translationQuality: 88, localContentAvailability: 85 },
      82, { aiLiteracy: 72, stemEducation: 85, digitalSkills: 85 }
    ),
    'up', 4.5
  ),

  // 사우디아라비아 - Vision 2030 AI 투자
  createCountry(
    'SAU', 'SA', 'Saudi Arabia', '사우디아라비아', 'ME',
    36.4, 72, 26.2, 65,
    indicators(
      78, { aiAdoptionRate: 26.2, internetPenetration: 95, mobileConnectivity: 98, infrastructureQuality: 88 },
      75, { aiCostToIncome: 1.2, freeServiceAccess: 72, purchasingPower: 88 },
      78, { nativeLanguageSupport: 80, translationQuality: 82, localContentAvailability: 75 },
      70, { aiLiteracy: 55, stemEducation: 72, digitalSkills: 72 }
    ),
    'up', 3.0
  ),

  // 이스라엘 - 스타트업 국가, 높은 기술력
  createCountry(
    'ISR', 'IL', 'Israel', '이스라엘', 'ME',
    9.7, 62, 33.9, 86,
    indicators(
      88, { aiAdoptionRate: 33.9, internetPenetration: 92, mobileConnectivity: 95, infrastructureQuality: 90 },
      78, { aiCostToIncome: 1.5, freeServiceAccess: 80, purchasingPower: 85 },
      82, { nativeLanguageSupport: 78, translationQuality: 85, localContentAvailability: 82 },
      92, { aiLiteracy: 82, stemEducation: 95, digitalSkills: 92 }
    ),
    'up', 2.2
  ),

  // 이집트 - 아랍 최대 인구
  createCountry(
    'EGY', 'EG', 'Egypt', '이집트', 'ME',
    112.7, 62, 9.2, 20,
    indicators(
      35, { aiAdoptionRate: 9.2, internetPenetration: 58, mobileConnectivity: 72, infrastructureQuality: 45 },
      25, { aiCostToIncome: 15.0, freeServiceAccess: 40, purchasingPower: 22 },
      68, { nativeLanguageSupport: 75, translationQuality: 72, localContentAvailability: 60 },
      38, { aiLiteracy: 25, stemEducation: 42, digitalSkills: 38 }
    ),
    'up', 1.5
  ),

  // 이란 - 제재로 인한 제한
  createCountry(
    'IRN', 'IR', 'Iran', '이란', 'ME',
    89.2, 70, 6.0, 15,
    indicators(
      32, { aiAdoptionRate: 6.0, internetPenetration: 72, mobileConnectivity: 78, infrastructureQuality: 45 },
      28, { aiCostToIncome: 18.0, freeServiceAccess: 35, purchasingPower: 25 },
      55, { nativeLanguageSupport: 58, translationQuality: 60, localContentAvailability: 48 },
      52, { aiLiteracy: 38, stemEducation: 62, digitalSkills: 48 }
    ),
    'stable', 0.3
  ),

  // 모로코 - 아프리카 진출 거점
  createCountry(
    'MAR', 'MA', 'Morocco', '모로코', 'ME',
    37.8, 65, 8.8, 18,
    indicators(
      35, { aiAdoptionRate: 8.8, internetPenetration: 85, mobileConnectivity: 82, infrastructureQuality: 52 },
      28, { aiCostToIncome: 12.0, freeServiceAccess: 42, purchasingPower: 28 },
      68, { nativeLanguageSupport: 72, translationQuality: 70, localContentAvailability: 62 },
      42, { aiLiteracy: 28, stemEducation: 48, digitalSkills: 42 }
    ),
    'up', 1.3
  ),

  // ===== Sub-Saharan Africa (SSA) - 4개국 =====

  // 나이지리아 - 아프리카 최대 경제
  createCountry(
    'NGA', 'NG', 'Nigeria', '나이지리아', 'SSA',
    223.8, 54, 6.5, 12,
    indicators(
      28, { aiAdoptionRate: 6.5, internetPenetration: 42, mobileConnectivity: 65, infrastructureQuality: 32 },
      18, { aiCostToIncome: 20.0, freeServiceAccess: 32, purchasingPower: 15 },
      62, { nativeLanguageSupport: 75, translationQuality: 68, localContentAvailability: 48 },
      32, { aiLiteracy: 20, stemEducation: 35, digitalSkills: 35 }
    ),
    'up', 1.5
  ),

  // 남아프리카공화국 - 아프리카 기술 허브
  createCountry(
    'ZAF', 'ZA', 'South Africa', '남아프리카공화국', 'SSA',
    60.4, 65, 18.0, 42,
    indicators(
      52, { aiAdoptionRate: 18.0, internetPenetration: 72, mobileConnectivity: 82, infrastructureQuality: 58 },
      42, { aiCostToIncome: 8.0, freeServiceAccess: 52, purchasingPower: 42 },
      78, { nativeLanguageSupport: 85, translationQuality: 80, localContentAvailability: 72 },
      52, { aiLiteracy: 38, stemEducation: 52, digitalSkills: 55 }
    ),
    'up', 1.8
  ),

  // 케냐 - 동아프리카 테크 허브
  createCountry(
    'KEN', 'KE', 'Kenya', '케냐', 'SSA',
    55.1, 58, 6.2, 11,
    indicators(
      30, { aiAdoptionRate: 6.2, internetPenetration: 42, mobileConnectivity: 85, infrastructureQuality: 38 },
      22, { aiCostToIncome: 15.0, freeServiceAccess: 38, purchasingPower: 18 },
      65, { nativeLanguageSupport: 78, translationQuality: 70, localContentAvailability: 52 },
      38, { aiLiteracy: 25, stemEducation: 42, digitalSkills: 42 }
    ),
    'up', 1.2
  ),

  // 에티오피아 - 빠른 성장, 인프라 부족
  createCountry(
    'ETH', 'ET', 'Ethiopia', '에티오피아', 'SSA',
    126.5, 56, 3.0, 2,
    indicators(
      15, { aiAdoptionRate: 3.0, internetPenetration: 22, mobileConnectivity: 45, infrastructureQuality: 20 },
      10, { aiCostToIncome: 28.0, freeServiceAccess: 20, purchasingPower: 8 },
      28, { nativeLanguageSupport: 25, translationQuality: 35, localContentAvailability: 22 },
      25, { aiLiteracy: 12, stemEducation: 28, digitalSkills: 25 }
    ),
    'up', 0.8
  ),

  // ===== Oceania (OC) - 2개국 =====

  // 호주 - 높은 인프라, 영어권
  createCountry(
    'AUS', 'AU', 'Australia', '호주', 'OC',
    26.4, 65, 34.5, 81,
    indicators(
      85, { aiAdoptionRate: 34.5, internetPenetration: 92, mobileConnectivity: 95, infrastructureQuality: 88 },
      78, { aiCostToIncome: 1.5, freeServiceAccess: 82, purchasingPower: 90 },
      98, { nativeLanguageSupport: 100, translationQuality: 98, localContentAvailability: 98 },
      85, { aiLiteracy: 72, stemEducation: 82, digitalSkills: 88 }
    ),
    'up', 1.8
  ),

  // 뉴질랜드 - 높은 디지털 역량
  createCountry(
    'NZL', 'NZ', 'New Zealand', '뉴질랜드', 'OC',
    5.2, 65, 40.5, 79,
    indicators(
      82, { aiAdoptionRate: 40.5, internetPenetration: 95, mobileConnectivity: 94, infrastructureQuality: 85 },
      80, { aiCostToIncome: 1.8, freeServiceAccess: 85, purchasingPower: 85 },
      98, { nativeLanguageSupport: 100, translationQuality: 98, localContentAvailability: 98 },
      88, { aiLiteracy: 78, stemEducation: 85, digitalSkills: 90 }
    ),
    'up', 2.0
  ),
];

// 국가 코드로 빠른 조회
export const COUNTRY_MAP_V1 = new Map<string, CountryGAIIData>(
  COUNTRY_DATA_V1.map(country => [country.iso3, country])
);

// ISO2 코드로 조회
export const COUNTRY_MAP_V1_ISO2 = new Map<string, CountryGAIIData>(
  COUNTRY_DATA_V1.map(country => [country.iso2, country])
);

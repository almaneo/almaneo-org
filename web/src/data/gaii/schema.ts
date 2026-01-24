/**
 * GAII (Global AI Inequality Index) Data Schema
 *
 * 데이터 소스:
 * - Microsoft Global AI Adoption 2025 Report
 * - World Bank Development Indicators
 * - ITU ICT Statistics
 * - UNESCO Education Data
 *
 * 업데이트 주기: 초기 반기별, 향후 월별
 *
 * GAII Score 계산 공식 (v1.0):
 * GAII = 100 - (0.4×Access + 0.3×Affordability + 0.2×Language + 0.1×Skill)
 *
 * 4개 지표:
 * - Access (40%): AI 서비스 보급률, 인터넷 인프라 품질
 * - Affordability (30%): 구독료/소득 비율, 무료 서비스 가용성
 * - Language (20%): 현지 언어 AI 지원 수준
 * - Skill (10%): AI 리터러시, STEM 교육 수준
 *
 * 점수 해석:
 * - 0: 완전한 평등 (모든 인구가 AI 접근 가능)
 * - 100: 극심한 불평등 (AI 접근 불가)
 */

// 지역 코드 정의
export type RegionCode =
  | 'NA'   // North America (북미)
  | 'EU'   // Europe (유럽)
  | 'EA'   // East Asia (동아시아)
  | 'SA'   // South Asia (남아시아)
  | 'SEA'  // Southeast Asia (동남아시아)
  | 'LA'   // Latin America (중남미)
  | 'ME'   // Middle East & North Africa (중동/북아프리카)
  | 'SSA'  // Sub-Saharan Africa (사하라 이남 아프리카)
  | 'OC'   // Oceania (오세아니아)
  | 'CA';  // Central Asia (중앙아시아)

// 지역 메타데이터
export interface RegionMeta {
  code: RegionCode;
  name: string;
  nameKo: string;
}

// GAII 4개 세부 지표
export interface GAIIIndicators {
  // Access (40%): AI 서비스 보급률, 인터넷 인프라
  access: number;           // 0-100 (높을수록 좋음)
  accessDetails: {
    aiAdoptionRate: number; // AI 채택률 (%)
    internetPenetration: number; // 인터넷 보급률 (%)
    mobileConnectivity: number; // 모바일 연결성 (%)
    infrastructureQuality: number; // 인프라 품질 점수 (0-100)
  };

  // Affordability (30%): 구독료/소득 비율
  affordability: number;    // 0-100 (높을수록 좋음)
  affordabilityDetails: {
    aiCostToIncome: number; // AI 구독료/월소득 비율 (%)
    freeServiceAccess: number; // 무료 서비스 접근성 (0-100)
    purchasingPower: number; // 구매력 지수 (0-100)
  };

  // Language (20%): 현지 언어 AI 지원
  language: number;         // 0-100 (높을수록 좋음)
  languageDetails: {
    nativeLanguageSupport: number; // 현지 언어 지원 수준 (0-100)
    translationQuality: number; // 번역 품질 (0-100)
    localContentAvailability: number; // 현지 콘텐츠 가용성 (0-100)
  };

  // Skill (10%): AI 리터러시, 교육
  skill: number;            // 0-100 (높을수록 좋음)
  skillDetails: {
    aiLiteracy: number;     // AI 리터러시 (0-100)
    stemEducation: number;  // STEM 교육 수준 (0-100)
    digitalSkills: number;  // 디지털 역량 (0-100)
  };
}

// 국가별 GAII 데이터
export interface CountryGAIIData {
  // 기본 정보
  iso3: string;           // ISO 3166-1 alpha-3 코드
  iso2: string;           // ISO 3166-1 alpha-2 코드
  name: string;           // 영문 국가명
  nameKo: string;         // 한글 국가명
  region: RegionCode;     // 지역 코드

  // 인구 데이터
  population: number;     // 인구 (백만 명)
  workingAgePop: number;  // 생산가능인구 비율 (%)

  // AI 채택률 데이터 (레거시 호환)
  adoptionRate: number;   // AI 채택률 (%)
  paidUserIndex: number;  // 유료 사용자 지수 (0-100)

  // GAII v1.0 - 4개 지표
  indicators: GAIIIndicators;

  // GAII 점수
  gaii: number;           // GAII 점수 (0-100, 높을수록 불평등)
  gaiiGrade: 'Low' | 'Moderate' | 'High' | 'Critical';

  // 트렌드 데이터
  trend: 'up' | 'down' | 'stable';
  trendValue: number;     // 변화율 (%)

  // 메타데이터
  dataSource: string;     // 데이터 출처
  lastUpdated: string;    // 마지막 업데이트 (YYYY-MM)
}

// 지역별 집계 데이터
export interface RegionGAIIData {
  code: RegionCode;
  name: string;
  nameKo: string;

  // 집계 통계
  avgGaii: number;              // 평균 GAII
  weightedGaii: number;         // 인구 가중 GAII
  totalPopulation: number;      // 총 인구 (백만 명)
  avgAdoptionRate: number;      // 평균 채택률

  // 국가 수
  countryCount: number;         // 데이터 있는 국가 수
  countryWithoutData: number;   // 데이터 없는 국가 수

  // 등급 분포
  gradeDistribution: {
    Low: number;
    Moderate: number;
    High: number;
    Critical: number;
  };

  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

// 글로벌 집계 데이터
export interface GlobalGAIIData {
  // 전체 통계
  globalGaii: number;
  globalAdoptionRate: number;
  totalPopulation: number;

  // Global North vs South
  globalNorthAdoption: number;
  globalSouthAdoption: number;
  inequalityGap: number;

  // 지역별 데이터
  regions: RegionGAIIData[];

  // 국가별 데이터
  countries: CountryGAIIData[];

  // 메타데이터
  version: string;
  lastUpdated: string;
  nextUpdate: string;
  dataSources: string[];
}

// 지역 메타데이터 상수
export const REGIONS: RegionMeta[] = [
  { code: 'NA', name: 'North America', nameKo: '북미' },
  { code: 'EU', name: 'Europe', nameKo: '유럽' },
  { code: 'EA', name: 'East Asia', nameKo: '동아시아' },
  { code: 'SA', name: 'South Asia', nameKo: '남아시아' },
  { code: 'SEA', name: 'Southeast Asia', nameKo: '동남아시아' },
  { code: 'LA', name: 'Latin America', nameKo: '중남미' },
  { code: 'ME', name: 'Middle East & North Africa', nameKo: '중동/북아프리카' },
  { code: 'SSA', name: 'Sub-Saharan Africa', nameKo: '사하라 이남 아프리카' },
  { code: 'OC', name: 'Oceania', nameKo: '오세아니아' },
  { code: 'CA', name: 'Central Asia', nameKo: '중앙아시아' },
];

// GAII 등급 계산
export function calculateGaiiGrade(gaii: number): CountryGAIIData['gaiiGrade'] {
  if (gaii < 30) return 'Low';
  if (gaii < 50) return 'Moderate';
  if (gaii < 70) return 'High';
  return 'Critical';
}

// GAII v1.0 점수 계산 (4개 지표 기반)
// GAII = 100 - (0.4×Access + 0.3×Affordability + 0.2×Language + 0.1×Skill)
export function calculateGaiiV1(indicators: GAIIIndicators): number {
  const weightedScore =
    indicators.access * 0.4 +
    indicators.affordability * 0.3 +
    indicators.language * 0.2 +
    indicators.skill * 0.1;

  const gaii = Math.max(0, Math.min(100, 100 - weightedScore));
  return Math.round(gaii * 10) / 10;
}

// 레거시: 채택률 기반 GAII 계산 (하위 호환)
export function calculateGaii(adoptionRate: number): number {
  // 채택률이 높을수록 GAII는 낮음
  // 최대 채택률 66.7% (UAE 64% 기준 상한)를 0으로 매핑
  const maxAdoption = 66.7;
  const gaii = Math.max(0, Math.min(100, 100 - (adoptionRate / maxAdoption) * 100));
  return Math.round(gaii * 10) / 10;
}

// Access 점수 계산
export function calculateAccessScore(
  aiAdoptionRate: number,
  internetPenetration: number,
  mobileConnectivity: number,
  infrastructureQuality: number
): number {
  // 각 지표를 0-100으로 정규화하여 평균
  const normalizedAdoption = Math.min(100, (aiAdoptionRate / 65) * 100); // 65%를 100점으로
  const score = (
    normalizedAdoption * 0.4 +
    internetPenetration * 0.3 +
    mobileConnectivity * 0.15 +
    infrastructureQuality * 0.15
  );
  return Math.round(score * 10) / 10;
}

// Affordability 점수 계산
export function calculateAffordabilityScore(
  aiCostToIncome: number, // 낮을수록 좋음
  freeServiceAccess: number,
  purchasingPower: number
): number {
  // aiCostToIncome: 0%는 100점, 30%는 0점
  const costScore = Math.max(0, 100 - (aiCostToIncome / 30) * 100);
  const score = (
    costScore * 0.5 +
    freeServiceAccess * 0.25 +
    purchasingPower * 0.25
  );
  return Math.round(score * 10) / 10;
}

// Language 점수 계산
export function calculateLanguageScore(
  nativeLanguageSupport: number,
  translationQuality: number,
  localContentAvailability: number
): number {
  const score = (
    nativeLanguageSupport * 0.5 +
    translationQuality * 0.3 +
    localContentAvailability * 0.2
  );
  return Math.round(score * 10) / 10;
}

// Skill 점수 계산
export function calculateSkillScore(
  aiLiteracy: number,
  stemEducation: number,
  digitalSkills: number
): number {
  const score = (
    aiLiteracy * 0.4 +
    stemEducation * 0.3 +
    digitalSkills * 0.3
  );
  return Math.round(score * 10) / 10;
}

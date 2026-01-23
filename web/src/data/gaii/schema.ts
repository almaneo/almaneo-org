/**
 * GAII (Global AI Inequality Index) Data Schema
 *
 * 데이터 소스: Microsoft Global AI Adoption 2025 Report
 * 업데이트 주기: 초기 반기별, 향후 월별
 *
 * GAII Score 계산 공식 (v1.0):
 * GAII = 100 - (adoption_rate × 1.5)
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

  // AI 채택률 데이터
  adoptionRate: number;   // AI 채택률 (%)
  paidUserIndex: number;  // 유료 사용자 지수 (0-100)

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

// GAII 점수 계산 (채택률 기반)
export function calculateGaii(adoptionRate: number): number {
  // 채택률이 높을수록 GAII는 낮음
  // 최대 채택률 66.7% (UAE 64% 기준 상한)를 0으로 매핑
  const maxAdoption = 66.7;
  const gaii = Math.max(0, Math.min(100, 100 - (adoptionRate / maxAdoption) * 100));
  return Math.round(gaii * 10) / 10;
}

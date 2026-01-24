/**
 * GAII Data Module
 * Global AI Inequality Index 데이터 및 유틸리티
 *
 * AlmaNEO GAII Report v1.0 (2026-Q1)
 */

// Schema & Types
export {
  type RegionCode,
  type RegionMeta,
  type CountryGAIIData,
  type RegionGAIIData,
  type GlobalGAIIData,
  type GAIIIndicators,
  REGIONS,
  calculateGaiiGrade,
  calculateGaii,
  calculateGaiiV1,
  calculateAccessScore,
  calculateAffordabilityScore,
  calculateLanguageScore,
  calculateSkillScore,
} from './schema';

// Country Data (Legacy - 120+ 국가)
export {
  COUNTRY_DATA,
  COUNTRY_MAP,
  COUNTRY_MAP_ISO2,
} from './countries';

// Country Data v1.0 (50개국 핵심 데이터)
export {
  COUNTRY_DATA_V1,
  COUNTRY_MAP_V1,
  COUNTRY_MAP_V1_ISO2,
} from './countries-v1';

// Aggregation Functions
export {
  aggregateByRegion,
  aggregateGlobal,
  getTopCountries,
  getBottomCountries,
  getFastestImproving,
} from './aggregation';

// GAII Report v1.0
export {
  type GAIIReportMetadata,
  type DataSource,
  type MethodologySection,
  type ExecutiveSummary,
  type KeyFinding,
  type GlobalStats,
  type RegionalAnalysis,
  type RegionReport,
  type CountryRanking,
  type KeyInsight,
  type PolicyRecommendation,
  type GAIIReport,
  generateGAIIReport,
  GAII_REPORT_V1,
  getTopCountries as getTopCountriesV1,
  getBottomCountries as getBottomCountriesV1,
  getCountryByRank,
  getRegionReport,
} from './report';

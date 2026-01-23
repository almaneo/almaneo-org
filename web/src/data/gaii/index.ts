/**
 * GAII Data Module
 * Global AI Inequality Index 데이터 및 유틸리티
 */

// Schema & Types
export {
  type RegionCode,
  type RegionMeta,
  type CountryGAIIData,
  type RegionGAIIData,
  type GlobalGAIIData,
  REGIONS,
  calculateGaiiGrade,
  calculateGaii,
} from './schema';

// Country Data
export {
  COUNTRY_DATA,
  COUNTRY_MAP,
  COUNTRY_MAP_ISO2,
} from './countries';

// Aggregation Functions
export {
  aggregateByRegion,
  aggregateGlobal,
  getTopCountries,
  getBottomCountries,
  getFastestImproving,
} from './aggregation';

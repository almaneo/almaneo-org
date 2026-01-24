/**
 * GAII Report v1.0 Data Structure
 *
 * AlmaNEO Global AI Inequality Index Report
 * First Publication: 2026-Q1
 */

import type { CountryGAIIData } from './schema';
import { REGIONS } from './schema';
import { COUNTRY_DATA_V1 } from './countries-v1';

// ===== Report Metadata =====

export interface GAIIReportMetadata {
  version: string;
  title: string;
  subtitle: string;
  publishDate: string;
  authors: string[];
  organization: string;
  website: string;
  dataSources: DataSource[];
  methodology: MethodologySection;
}

export interface DataSource {
  name: string;
  year: string;
  url?: string;
  description: string;
}

export interface MethodologySection {
  formula: string;
  weights: {
    access: number;
    affordability: number;
    language: number;
    skill: number;
  };
  gradeThresholds: {
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  indicatorDescriptions: {
    access: string;
    affordability: string;
    language: string;
    skill: string;
  };
}

// ===== Report Sections =====

export interface ExecutiveSummary {
  keyFindings: KeyFinding[];
  globalStats: GlobalStats;
  callToAction: string;
}

export interface KeyFinding {
  title: string;
  description: string;
  stat?: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export interface GlobalStats {
  globalGaii: number;
  totalCountries: number;
  totalPopulation: number; // billions
  globalNorthAdoption: number;
  globalSouthAdoption: number;
  inequalityGap: number;
  avgAccess: number;
  avgAffordability: number;
  avgLanguage: number;
  avgSkill: number;
}

export interface RegionalAnalysis {
  regions: RegionReport[];
}

export interface RegionReport {
  code: string;
  name: string;
  nameKo: string;
  avgGaii: number;
  countries: number;
  population: number;
  topPerformer: string;
  bottomPerformer: string;
  keyInsight: string;
  indicators: {
    access: number;
    affordability: number;
    language: number;
    skill: number;
  };
}

export interface CountryRanking {
  rank: number;
  country: CountryGAIIData;
  change?: number; // rank change from previous report
}

export interface KeyInsight {
  category: 'access' | 'affordability' | 'language' | 'skill' | 'general';
  title: string;
  description: string;
  countries?: string[];
  recommendation?: string;
}

export interface PolicyRecommendation {
  target: 'governments' | 'corporations' | 'ngos' | 'international';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

// ===== Full Report Structure =====

export interface GAIIReport {
  metadata: GAIIReportMetadata;
  executiveSummary: ExecutiveSummary;
  regionalAnalysis: RegionalAnalysis;
  countryRankings: CountryRanking[];
  keyInsights: KeyInsight[];
  recommendations: PolicyRecommendation[];
}

// ===== Report Generation Functions =====

// 글로벌 통계 계산
function calculateGlobalStats(): GlobalStats {
  const countries = COUNTRY_DATA_V1;
  const totalPopulation = countries.reduce((sum, c) => sum + c.population, 0);

  // 인구 가중 평균 GAII
  const globalGaii = countries.reduce(
    (sum, c) => sum + c.gaii * c.population,
    0
  ) / totalPopulation;

  // Global North (선진국) vs Global South
  const northCodes = ['USA', 'CAN', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'SWE', 'CHE', 'AUS', 'NZL', 'JPN', 'KOR', 'SGP'];
  const northCountries = countries.filter(c => northCodes.includes(c.iso3));
  const southCountries = countries.filter(c => !northCodes.includes(c.iso3));

  const northPop = northCountries.reduce((sum, c) => sum + c.population, 0);
  const southPop = southCountries.reduce((sum, c) => sum + c.population, 0);

  const globalNorthAdoption = northCountries.reduce(
    (sum, c) => sum + c.adoptionRate * c.population,
    0
  ) / northPop;

  const globalSouthAdoption = southCountries.reduce(
    (sum, c) => sum + c.adoptionRate * c.population,
    0
  ) / southPop;

  // 지표별 평균 (인구 가중)
  const avgAccess = countries.reduce(
    (sum, c) => sum + c.indicators.access * c.population,
    0
  ) / totalPopulation;

  const avgAffordability = countries.reduce(
    (sum, c) => sum + c.indicators.affordability * c.population,
    0
  ) / totalPopulation;

  const avgLanguage = countries.reduce(
    (sum, c) => sum + c.indicators.language * c.population,
    0
  ) / totalPopulation;

  const avgSkill = countries.reduce(
    (sum, c) => sum + c.indicators.skill * c.population,
    0
  ) / totalPopulation;

  return {
    globalGaii: Math.round(globalGaii * 10) / 10,
    totalCountries: countries.length,
    totalPopulation: Math.round(totalPopulation / 100) / 10, // billions
    globalNorthAdoption: Math.round(globalNorthAdoption * 10) / 10,
    globalSouthAdoption: Math.round(globalSouthAdoption * 10) / 10,
    inequalityGap: Math.round((globalNorthAdoption - globalSouthAdoption) * 10) / 10,
    avgAccess: Math.round(avgAccess * 10) / 10,
    avgAffordability: Math.round(avgAffordability * 10) / 10,
    avgLanguage: Math.round(avgLanguage * 10) / 10,
    avgSkill: Math.round(avgSkill * 10) / 10,
  };
}

// 지역별 분석 생성
function generateRegionalAnalysis(): RegionalAnalysis {
  const regionMap = new Map<string, CountryGAIIData[]>();

  // 국가를 지역별로 그룹화
  for (const country of COUNTRY_DATA_V1) {
    const list = regionMap.get(country.region) || [];
    list.push(country);
    regionMap.set(country.region, list);
  }

  const regions: RegionReport[] = REGIONS
    .filter(r => regionMap.has(r.code))
    .map(regionMeta => {
      const countries = regionMap.get(regionMeta.code) || [];
      const population = countries.reduce((sum, c) => sum + c.population, 0);

      // 인구 가중 평균
      const avgGaii = countries.reduce(
        (sum, c) => sum + c.gaii * c.population,
        0
      ) / population;

      const avgAccess = countries.reduce(
        (sum, c) => sum + c.indicators.access * c.population,
        0
      ) / population;

      const avgAffordability = countries.reduce(
        (sum, c) => sum + c.indicators.affordability * c.population,
        0
      ) / population;

      const avgLanguage = countries.reduce(
        (sum, c) => sum + c.indicators.language * c.population,
        0
      ) / population;

      const avgSkill = countries.reduce(
        (sum, c) => sum + c.indicators.skill * c.population,
        0
      ) / population;

      // 최고/최저 국가
      const sorted = [...countries].sort((a, b) => a.gaii - b.gaii);
      const topPerformer = sorted[0]?.name || 'N/A';
      const bottomPerformer = sorted[sorted.length - 1]?.name || 'N/A';

      // 지역별 인사이트
      const keyInsight = generateRegionInsight(regionMeta.code);

      return {
        code: regionMeta.code,
        name: regionMeta.name,
        nameKo: regionMeta.nameKo,
        avgGaii: Math.round(avgGaii * 10) / 10,
        countries: countries.length,
        population: Math.round(population * 10) / 10,
        topPerformer,
        bottomPerformer,
        keyInsight,
        indicators: {
          access: Math.round(avgAccess * 10) / 10,
          affordability: Math.round(avgAffordability * 10) / 10,
          language: Math.round(avgLanguage * 10) / 10,
          skill: Math.round(avgSkill * 10) / 10,
        },
      };
    });

  return { regions };
}

// 지역별 인사이트 생성
function generateRegionInsight(code: string): string {
  const insights: Record<string, string> = {
    NA: 'North America shows high AI adoption but significant cost barriers for lower-income populations.',
    EU: 'Europe demonstrates strong infrastructure but varies widely in AI literacy across member states.',
    EA: 'East Asia leads in infrastructure quality with South Korea and Singapore as global leaders.',
    SA: 'South Asia faces major affordability challenges with AI subscriptions costing up to 28% of monthly income.',
    SEA: 'Southeast Asia shows rapid growth potential with Singapore as regional hub.',
    LA: 'Latin America benefits from Spanish language support but faces infrastructure gaps.',
    ME: 'Middle East shows polarized development with UAE leading while conflict zones lag behind.',
    SSA: 'Sub-Saharan Africa has critical infrastructure and affordability gaps requiring urgent intervention.',
    OC: 'Oceania achieves near-universal access with Australia and New Zealand as benchmarks.',
    CA: 'Central Asia shows moderate development with growing investment in digital infrastructure.',
  };
  return insights[code] || 'Regional analysis pending.';
}

// 국가 순위 생성
function generateCountryRankings(): CountryRanking[] {
  return [...COUNTRY_DATA_V1]
    .sort((a, b) => a.gaii - b.gaii) // 낮은 GAII = 좋음
    .map((country, index) => ({
      rank: index + 1,
      country,
    }));
}

// 핵심 인사이트 생성
function generateKeyInsights(): KeyInsight[] {
  return [
    {
      category: 'general',
      title: 'The Global AI Divide is Widening',
      description: 'AI adoption in Global North (33.2%) is 3.5x higher than Global South (9.5%), creating a digital divide that reinforces existing inequalities.',
      recommendation: 'Prioritize infrastructure investment and affordable AI access in developing regions.',
    },
    {
      category: 'affordability',
      title: 'AI Costs Burden Low-Income Countries',
      description: 'In countries like Bangladesh and Pakistan, AI subscription costs represent 25-28% of average monthly income, making AI tools inaccessible for most citizens.',
      countries: ['PAK', 'BGD', 'ETH', 'MMR'],
      recommendation: 'Develop tiered pricing models and free tiers for low-income regions.',
    },
    {
      category: 'language',
      title: 'Language Barrier Excludes Billions',
      description: 'Over 3 billion people speak languages with limited AI support. Local language AI quality averages only 35/100 in South Asia and 28/100 in Sub-Saharan Africa.',
      countries: ['IND', 'PAK', 'NGA', 'ETH'],
      recommendation: 'Invest in multilingual AI models and community-driven translation efforts.',
    },
    {
      category: 'access',
      title: 'Infrastructure Gap in Rural Areas',
      description: 'Urban-rural digital divide persists even in middle-income countries. Internet penetration drops by 30-40% in rural areas.',
      recommendation: 'Expand mobile connectivity and offline-capable AI applications.',
    },
    {
      category: 'skill',
      title: 'AI Literacy Crisis',
      description: 'Global average AI literacy score is only 42/100. Even in developed countries, over 60% of the population lacks basic AI understanding.',
      recommendation: 'Integrate AI education into school curricula and workforce training programs.',
    },
  ];
}

// 정책 권고 생성
function generateRecommendations(): PolicyRecommendation[] {
  return [
    {
      target: 'corporations',
      title: 'Implement Tiered Pricing for Emerging Markets',
      description: 'AI companies should offer income-adjusted pricing tiers, making AI tools accessible to users in low-income countries at $1-5/month instead of $20+.',
      priority: 'high',
      impact: 'Could increase AI access for 2+ billion people in Global South.',
    },
    {
      target: 'governments',
      title: 'Invest in National AI Infrastructure',
      description: 'Governments should prioritize broadband expansion, data center development, and public AI computing resources.',
      priority: 'high',
      impact: 'Foundational requirement for AI democratization.',
    },
    {
      target: 'corporations',
      title: 'Expand Multilingual AI Support',
      description: 'Prioritize development of AI capabilities in underserved languages including Hindi, Bengali, Swahili, and Vietnamese.',
      priority: 'high',
      impact: 'Would serve 2.5+ billion speakers of underserved languages.',
    },
    {
      target: 'ngos',
      title: 'Launch AI Literacy Programs',
      description: 'Partner with local organizations to deliver AI education through community centers, libraries, and mobile units.',
      priority: 'medium',
      impact: 'Build grassroots AI capability in underserved communities.',
    },
    {
      target: 'international',
      title: 'Establish Global AI Equity Fund',
      description: 'Create international funding mechanism to subsidize AI access for least developed countries.',
      priority: 'medium',
      impact: 'Systematic approach to addressing AI inequality.',
    },
    {
      target: 'governments',
      title: 'Include GAII in National Development Metrics',
      description: 'Adopt GAII as official indicator alongside HDI and GDP to track AI inequality.',
      priority: 'low',
      impact: 'Increases visibility and accountability for AI equity.',
    },
  ];
}

// ===== Main Report Generation =====

export function generateGAIIReport(): GAIIReport {
  const globalStats = calculateGlobalStats();
  const rankings = generateCountryRankings();

  return {
    metadata: {
      version: '1.0',
      title: 'Global AI Inequality Index Report',
      subtitle: 'Measuring AI Access, Affordability, Language Support, and Skills Across 50 Countries',
      publishDate: '2026-Q1',
      authors: ['AlmaNEO Research Team'],
      organization: 'AlmaNEO Foundation',
      website: 'https://almaneo.org',
      dataSources: [
        {
          name: 'Microsoft Global AI Adoption Report',
          year: '2025',
          url: 'https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/',
          description: 'AI adoption rates and usage patterns across enterprise and consumer segments.',
        },
        {
          name: 'World Bank Development Indicators',
          year: '2025',
          url: 'https://databank.worldbank.org/source/world-development-indicators',
          description: 'Economic indicators including GDP, purchasing power, and income distribution.',
        },
        {
          name: 'ITU ICT Statistics',
          year: '2025',
          url: 'https://datahub.itu.int/',
          description: 'Internet penetration, mobile connectivity, and digital infrastructure metrics.',
        },
        {
          name: 'UNESCO Education Data',
          year: '2025',
          url: 'https://uis.unesco.org/',
          description: 'STEM education enrollment, digital literacy rates, and educational attainment.',
        },
      ],
      methodology: {
        formula: 'GAII = 100 - (0.4×Access + 0.3×Affordability + 0.2×Language + 0.1×Skill)',
        weights: {
          access: 0.4,
          affordability: 0.3,
          language: 0.2,
          skill: 0.1,
        },
        gradeThresholds: {
          low: 30,
          moderate: 50,
          high: 70,
          critical: 100,
        },
        indicatorDescriptions: {
          access: 'AI service adoption rate, internet penetration, mobile connectivity, and infrastructure quality.',
          affordability: 'AI subscription cost relative to income, free service availability, and purchasing power.',
          language: 'Native language AI support quality, translation accuracy, and local content availability.',
          skill: 'AI literacy, STEM education levels, and digital skills competency.',
        },
      },
    },

    executiveSummary: {
      keyFindings: [
        {
          title: 'AI Inequality is Real and Measurable',
          description: `The average GAII score is ${globalStats.globalGaii}, indicating significant global AI inequality.`,
          stat: `${globalStats.globalGaii}/100`,
          trend: 'negative',
        },
        {
          title: 'Global North vs South Gap',
          description: `AI adoption in developed countries (${globalStats.globalNorthAdoption}%) is ${Math.round(globalStats.globalNorthAdoption / globalStats.globalSouthAdoption * 10) / 10}x higher than developing regions (${globalStats.globalSouthAdoption}%).`,
          stat: `${globalStats.inequalityGap}% gap`,
          trend: 'negative',
        },
        {
          title: 'Affordability is the Biggest Barrier',
          description: `Global average affordability score is only ${globalStats.avgAffordability}/100, with AI costs consuming up to 30% of income in the poorest countries.`,
          stat: `${globalStats.avgAffordability}/100`,
          trend: 'negative',
        },
        {
          title: 'Language Support is Critical',
          description: `Languages spoken by billions have limited AI support, with average language score of ${globalStats.avgLanguage}/100.`,
          stat: `${globalStats.avgLanguage}/100`,
          trend: 'negative',
        },
      ],
      globalStats,
      callToAction: 'AI companies, governments, and international organizations must work together to close the AI inequality gap. The AlmaNEO Foundation calls for tiered pricing, multilingual AI development, and investment in digital infrastructure to ensure AI benefits all of humanity.',
    },

    regionalAnalysis: generateRegionalAnalysis(),
    countryRankings: rankings,
    keyInsights: generateKeyInsights(),
    recommendations: generateRecommendations(),
  };
}

// ===== Exports =====

export const GAII_REPORT_V1 = generateGAIIReport();

// 편의 함수들
export function getTopCountries(n: number = 10): CountryRanking[] {
  return GAII_REPORT_V1.countryRankings.slice(0, n);
}

export function getBottomCountries(n: number = 10): CountryRanking[] {
  return GAII_REPORT_V1.countryRankings.slice(-n).reverse();
}

export function getCountryByRank(rank: number): CountryRanking | undefined {
  return GAII_REPORT_V1.countryRankings.find(r => r.rank === rank);
}

export function getRegionReport(code: string): RegionReport | undefined {
  return GAII_REPORT_V1.regionalAnalysis.regions.find(r => r.code === code);
}

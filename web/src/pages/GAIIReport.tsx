/**
 * GAII Report v1.0 Page
 *
 * AlmaNEO Global AI Inequality Index Report
 */

import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  FileText,
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  BarChart3,
  Users,
  DollarSign,
  Languages,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  Info,
  Building2,
  Landmark,
  Heart,
  Globe2,
} from 'lucide-react';
import {
  GAII_REPORT_V1,
  type CountryRanking,
  type RegionReport,
  type KeyInsight,
  type PolicyRecommendation,
} from '../data/gaii';

// Lazy load PDF component for better performance
const GAIIReportPDF = lazy(() => import('../components/pdf/GAIIReportPDF'));

// 등급별 색상
const gradeColors = {
  Low: 'text-green-400 bg-green-400/10',
  Moderate: 'text-yellow-400 bg-yellow-400/10',
  High: 'text-orange-400 bg-orange-400/10',
  Critical: 'text-red-400 bg-red-400/10',
};

// 트렌드 아이콘
function TrendIcon({ trend }: { trend: 'positive' | 'negative' | 'neutral' | 'up' | 'down' | 'stable' }) {
  if (trend === 'positive' || trend === 'down') {
    return <TrendingDown className="w-4 h-4 text-green-400" />;
  }
  if (trend === 'negative' || trend === 'up') {
    return <TrendingUp className="w-4 h-4 text-red-400" />;
  }
  return <Minus className="w-4 h-4 text-gray-400" />;
}

// 카테고리 아이콘
function CategoryIcon({ category }: { category: KeyInsight['category'] }) {
  const icons = {
    access: <Globe className="w-5 h-5" />,
    affordability: <DollarSign className="w-5 h-5" />,
    language: <Languages className="w-5 h-5" />,
    skill: <GraduationCap className="w-5 h-5" />,
    general: <BarChart3 className="w-5 h-5" />,
  };
  return icons[category] || icons.general;
}

// 타겟 아이콘
function TargetIcon({ target }: { target: PolicyRecommendation['target'] }) {
  const icons = {
    governments: <Landmark className="w-5 h-5" />,
    corporations: <Building2 className="w-5 h-5" />,
    ngos: <Heart className="w-5 h-5" />,
    international: <Globe2 className="w-5 h-5" />,
  };
  return icons[target] || icons.international;
}

// 섹션 헤더 컴포넌트
function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="w-6 h-6 text-[#FF6B00]" />}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-gray-400 ml-9">{subtitle}</p>
      )}
    </div>
  );
}

// 통계 카드
function StatCard({
  label,
  value,
  unit,
  trend,
  color = 'blue',
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'blue' | 'orange' | 'green' | 'red';
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    orange: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    red: 'from-red-500/20 to-orange-500/20 border-red-500/30',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-gray-400 text-sm mb-1">{unit}</span>}
        {trend && <TrendIcon trend={trend} />}
      </div>
    </div>
  );
}

// 국가 순위 테이블
function CountryRankingTable({ rankings, showAll = false }: { rankings: CountryRanking[]; showAll?: boolean }) {
  const { t, i18n } = useTranslation('platform');
  const isKo = i18n.language === 'ko';
  const [expanded, setExpanded] = useState(showAll);
  const displayRankings = expanded ? rankings : rankings.slice(0, 10);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('gaiiReport.table.rank')}</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('gaiiReport.table.country')}</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('gaiiReport.table.gaii')}</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('gaiiReport.table.grade')}</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">{t('gaiiReport.indicators.access')}</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">{t('gaiiReport.indicators.affordability')}</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium hidden md:table-cell">{t('gaiiReport.indicators.language')}</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium hidden md:table-cell">{t('gaiiReport.indicators.skill')}</th>
          </tr>
        </thead>
        <tbody>
          {displayRankings.map((item) => (
            <tr key={item.country.iso3} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4 text-white font-medium">#{item.rank}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-white">{isKo ? item.country.nameKo : item.country.name}</span>
                  <span className="text-gray-500 text-sm hidden sm:inline">({isKo ? item.country.name : item.country.nameKo})</span>
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="text-white font-medium">{item.country.gaii}</span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[item.country.gaiiGrade]}`}>
                  {item.country.gaiiGrade}
                </span>
              </td>
              <td className="py-3 px-4 text-center text-gray-300 hidden sm:table-cell">
                {item.country.indicators.access}
              </td>
              <td className="py-3 px-4 text-center text-gray-300 hidden sm:table-cell">
                {item.country.indicators.affordability}
              </td>
              <td className="py-3 px-4 text-center text-gray-300 hidden md:table-cell">
                {item.country.indicators.language}
              </td>
              <td className="py-3 px-4 text-center text-gray-300 hidden md:table-cell">
                {item.country.indicators.skill}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rankings.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 text-center text-[#FF6B00] hover:text-orange-400 transition-colors flex items-center justify-center gap-2"
        >
          {expanded ? (
            <>{t('gaiiReport.table.showLess')} <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>{t('gaiiReport.table.showAll', { count: rankings.length })} <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
}

// 지역 카드
function RegionCard({ region }: { region: RegionReport }) {
  const { t, i18n } = useTranslation('platform');
  const isKo = i18n.language === 'ko';
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass p-6 rounded-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-[#FF6B00]">{region.avgGaii}</div>
          <div>
            <h3 className="text-white font-semibold text-left">{isKo ? region.nameKo : region.name}</h3>
            <p className="text-gray-400 text-sm text-left">{isKo ? region.name : region.nameKo} • {region.countries} {t('gaiiReport.region.countries')}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-300 text-sm mb-4">{t(`gaiiReport.regionalInsights.${region.code}`)}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400">{t('gaiiReport.indicators.access')}</div>
              <div className="text-white font-medium">{region.indicators.access}</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400">{t('gaiiReport.indicators.affordability')}</div>
              <div className="text-white font-medium">{region.indicators.affordability}</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400">{t('gaiiReport.indicators.language')}</div>
              <div className="text-white font-medium">{region.indicators.language}</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400">{t('gaiiReport.indicators.skill')}</div>
              <div className="text-white font-medium">{region.indicators.skill}</div>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-400">{t('gaiiReport.region.top')}: </span>
              <span className="text-green-400">{region.topPerformer}</span>
            </div>
            <div>
              <span className="text-gray-400">{t('gaiiReport.region.bottom')}: </span>
              <span className="text-red-400">{region.bottomPerformer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 인사이트 키 매핑
const insightKeyMap: Record<string, string> = {
  'The Global AI Divide is Widening': 'globalDivide',
  'AI Costs Burden Low-Income Countries': 'affordabilityCosts',
  'Language Barrier Excludes Billions': 'languageBarrier',
  'Infrastructure Gap in Rural Areas': 'infrastructureGap',
  'AI Literacy Crisis': 'aiLiteracy',
};

// 인사이트 카드
function InsightCard({ insight, insightKey }: { insight: KeyInsight; insightKey?: string }) {
  const { t } = useTranslation('platform');
  const key = insightKey || insightKeyMap[insight.title] || '';

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-[#FF6B00]/20 text-[#FF6B00]">
          <CategoryIcon category={insight.category} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-2">
            {key ? t(`gaiiReport.insights.${key}.title`) : insight.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            {key ? t(`gaiiReport.insights.${key}.description`) : insight.description}
          </p>

          {insight.countries && insight.countries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {insight.countries.map(code => (
                <span key={code} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                  {code}
                </span>
              ))}
            </div>
          )}

          {(key || insight.recommendation) && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-green-300 text-sm">
                {key ? t(`gaiiReport.insights.${key}.recommendation`) : insight.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 권고 키 매핑
const recommendationKeyMap: Record<string, string> = {
  'Implement Tiered Pricing for Emerging Markets': 'tieredPricing',
  'Invest in National AI Infrastructure': 'nationalInfrastructure',
  'Expand Multilingual AI Support': 'multilingualSupport',
  'Launch AI Literacy Programs': 'aiLiteracyPrograms',
  'Establish Global AI Equity Fund': 'equityFund',
  'Include GAII in National Development Metrics': 'gaiiMetric',
};

// 권고 카드
function RecommendationCard({ rec, recKey }: { rec: PolicyRecommendation; recKey?: string }) {
  const { t } = useTranslation('platform');
  const key = recKey || recommendationKeyMap[rec.title] || '';

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-white/10 text-gray-300">
          <TargetIcon target={rec.target} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-semibold">
              {key ? t(`gaiiReport.recommendations.${key}.title`) : rec.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[rec.priority]}`}>
              {t(`gaiiReport.priority.${rec.priority}`)}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            {key ? t(`gaiiReport.recommendations.${key}.description`) : rec.description}
          </p>
          <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
            <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-sm">
              <strong>{t('gaiiReport.impact')}:</strong> {key ? t(`gaiiReport.recommendations.${key}.impact`) : rec.impact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 컴포넌트
export default function GAIIReport() {
  const { t } = useTranslation('platform');
  const report = GAII_REPORT_V1;
  const { metadata, executiveSummary, regionalAnalysis, countryRankings, keyInsights, recommendations } = report;

  return (
    <div className="min-h-screen bg-[#0A0F1A] py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-sm mb-4">
            <FileText className="w-4 h-4" />
            <span>{t('gaiiReport.version')} {metadata.version} • {metadata.publishDate}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('gaiiReport.reportTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
            {t('gaiiReport.reportSubtitle')}
          </p>
          <p className="text-gray-500">
            {t('gaiiReport.header.publishedBy')} {metadata.organization} • <a href={metadata.website} className="text-[#FF6B00] hover:underline">{metadata.website}</a>
          </p>
        </div>

        {/* Executive Summary */}
        <section className="mb-16">
          <SectionHeader
            title={t('gaiiReport.sections.executiveSummary.title')}
            subtitle={t('gaiiReport.sections.executiveSummary.subtitle')}
            icon={BarChart3}
          />

          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
            <StatCard
              label={t('gaiiReport.stats.globalGaii')}
              value={executiveSummary.globalStats.globalGaii}
              unit="/100"
              color="orange"
            />
            <StatCard
              label={t('gaiiReport.stats.countriesAnalyzed')}
              value={executiveSummary.globalStats.totalCountries}
              color="blue"
            />
            <StatCard
              label={t('gaiiReport.stats.populationCovered')}
              value={executiveSummary.globalStats.totalPopulation}
              unit="B"
              color="green"
            />
            <StatCard
              label={t('gaiiReport.stats.inequalityGap')}
              value={executiveSummary.globalStats.inequalityGap}
              unit="%"
              color="red"
            />
          </div>

          {/* Key Findings */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* AI Inequality Finding */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendIcon trend="negative" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{t('gaiiReport.keyFindings.aiInequality.title')}</h3>
                  <p className="text-gray-400 text-sm">{t('gaiiReport.keyFindings.aiInequality.description', { score: executiveSummary.globalStats.globalGaii })}</p>
                  <div className="mt-2 text-2xl font-bold text-[#FF6B00]">{executiveSummary.globalStats.globalGaii}/100</div>
                </div>
              </div>
            </div>
            {/* North vs South Gap */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendIcon trend="negative" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{t('gaiiReport.keyFindings.northSouthGap.title')}</h3>
                  <p className="text-gray-400 text-sm">{t('gaiiReport.keyFindings.northSouthGap.description', {
                    north: executiveSummary.globalStats.globalNorthAdoption,
                    south: executiveSummary.globalStats.globalSouthAdoption,
                    ratio: Math.round(executiveSummary.globalStats.globalNorthAdoption / executiveSummary.globalStats.globalSouthAdoption * 10) / 10
                  })}</p>
                  <div className="mt-2 text-2xl font-bold text-[#FF6B00]">{executiveSummary.globalStats.inequalityGap}% gap</div>
                </div>
              </div>
            </div>
            {/* Affordability */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendIcon trend="negative" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{t('gaiiReport.keyFindings.affordability.title')}</h3>
                  <p className="text-gray-400 text-sm">{t('gaiiReport.keyFindings.affordability.description', { score: executiveSummary.globalStats.avgAffordability })}</p>
                  <div className="mt-2 text-2xl font-bold text-[#FF6B00]">{executiveSummary.globalStats.avgAffordability}/100</div>
                </div>
              </div>
            </div>
            {/* Language Support */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendIcon trend="negative" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{t('gaiiReport.keyFindings.language.title')}</h3>
                  <p className="text-gray-400 text-sm">{t('gaiiReport.keyFindings.language.description', { score: executiveSummary.globalStats.avgLanguage })}</p>
                  <div className="mt-2 text-2xl font-bold text-[#FF6B00]">{executiveSummary.globalStats.avgLanguage}/100</div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicator Averages */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-white font-semibold mb-4">{t('gaiiReport.indicators.globalAverage')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400">{t('gaiiReport.indicators.access')}</span>
                </div>
                <div className="text-2xl font-bold text-white">{executiveSummary.globalStats.avgAccess}</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${executiveSummary.globalStats.avgAccess}%` }} />
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400">{t('gaiiReport.indicators.affordability')}</span>
                </div>
                <div className="text-2xl font-bold text-white">{executiveSummary.globalStats.avgAffordability}</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${executiveSummary.globalStats.avgAffordability}%` }} />
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Languages className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400">{t('gaiiReport.indicators.language')}</span>
                </div>
                <div className="text-2xl font-bold text-white">{executiveSummary.globalStats.avgLanguage}</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${executiveSummary.globalStats.avgLanguage}%` }} />
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400">{t('gaiiReport.indicators.skill')}</span>
                </div>
                <div className="text-2xl font-bold text-white">{executiveSummary.globalStats.avgSkill}</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${executiveSummary.globalStats.avgSkill}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country Rankings */}
        <section className="mb-16">
          <SectionHeader
            title={t('gaiiReport.sections.countryRankings.title')}
            subtitle={t('gaiiReport.sections.countryRankings.subtitle')}
            icon={Users}
          />
          <div className="glass rounded-xl overflow-hidden">
            <CountryRankingTable rankings={countryRankings} />
          </div>
        </section>

        {/* Regional Analysis */}
        <section className="mb-16">
          <SectionHeader
            title={t('gaiiReport.sections.regionalAnalysis.title')}
            subtitle={t('gaiiReport.sections.regionalAnalysis.subtitle')}
            icon={Globe}
          />
          <div className="grid md:grid-cols-2 gap-4">
            {regionalAnalysis.regions.map(region => (
              <RegionCard key={region.code} region={region} />
            ))}
          </div>
        </section>

        {/* Key Insights */}
        <section className="mb-16">
          <SectionHeader
            title={t('gaiiReport.sections.keyInsights.title')}
            subtitle={t('gaiiReport.sections.keyInsights.subtitle')}
            icon={AlertTriangle}
          />
          <div className="space-y-4">
            {keyInsights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        </section>

        {/* Policy Recommendations */}
        <section className="mb-16">
          <SectionHeader
            title={t('gaiiReport.sections.recommendations.title')}
            subtitle={t('gaiiReport.sections.recommendations.subtitle')}
            icon={CheckCircle}
          />
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} />
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-16">
          <SectionHeader
            title={t('gaiiReport.sections.methodology.title')}
            subtitle={t('gaiiReport.sections.methodology.subtitle')}
            icon={Info}
          />
          <div className="glass p-6 rounded-xl">
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">{t('gaiiReport.methodology.formula')}</h3>
              <code className="block p-4 bg-black/50 rounded-lg text-cyan-400 font-mono text-sm">
                {metadata.methodology.formula}
              </code>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">{t('gaiiReport.methodology.weights')}</h3>
                <div className="space-y-2">
                  {Object.entries(metadata.methodology.weights).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-24 text-gray-400">{t(`gaiiReport.indicators.${key}`)}</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#FF6B00] h-2 rounded-full"
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                      <div className="text-white font-medium">{value * 100}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">{t('gaiiReport.methodology.thresholds')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">{t('gaii.grades.low')}</span>
                    <span className="text-gray-400">0 - 30</span>
                    <span className="text-gray-500 text-sm">{t('gaiiReport.methodology.thresholdDesc.low')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400">{t('gaii.grades.moderate')}</span>
                    <span className="text-gray-400">30 - 50</span>
                    <span className="text-gray-500 text-sm">{t('gaiiReport.methodology.thresholdDesc.moderate')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400">{t('gaii.grades.high')}</span>
                    <span className="text-gray-400">50 - 70</span>
                    <span className="text-gray-500 text-sm">{t('gaiiReport.methodology.thresholdDesc.high')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-400/10 text-red-400">{t('gaii.grades.critical')}</span>
                    <span className="text-gray-400">70 - 100</span>
                    <span className="text-gray-500 text-sm">{t('gaiiReport.methodology.thresholdDesc.critical')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-16">
          <SectionHeader
            title={t('gaiiReport.sections.dataSources.title')}
            subtitle={t('gaiiReport.sections.dataSources.subtitle')}
            icon={FileText}
          />
          <div className="grid md:grid-cols-2 gap-4">
            {metadata.dataSources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-4 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-[#FF6B00] transition-colors">
                    {source.name}
                  </h3>
                  <svg
                    className="w-4 h-4 text-gray-500 group-hover:text-[#FF6B00] transition-colors flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm mb-2">{source.year}</p>
                <p className="text-gray-400 text-sm">{source.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="glass p-8 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-transparent">
            <h2 className="text-2xl font-bold text-white mb-4">{t('gaiiReport.cta.title')}</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('gaiiReport.callToAction')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://almaneo.org"
                className="px-6 py-3 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                {t('gaiiReport.cta.learnMore')}
              </a>
              <Suspense
                fallback={
                  <button
                    disabled
                    className="px-6 py-3 border border-gray-600 text-gray-500 rounded-lg font-medium flex items-center gap-2 cursor-wait"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('gaiiReport.cta.loadingPdf')}
                  </button>
                }
              >
                <PDFDownloadLink
                  document={<GAIIReportPDF />}
                  fileName="GAII-Report-v1.0.pdf"
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  {({ loading }) =>
                    loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('gaiiReport.cta.generatingPdf')}
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {t('gaiiReport.cta.downloadPdf')}
                      </>
                    )
                  }
                </PDFDownloadLink>
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

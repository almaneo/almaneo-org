/**
 * GAII Dashboard - Global AI Inequality Index
 * AI 불평등 지수 시각화 대시보드
 *
 * 데이터 소스: Microsoft Global AI Adoption 2025 Report
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Globe,
  TrendingDown,
  TrendingUp,
  Users,
  Cpu,
  DollarSign,
  RefreshCw,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  BarChart3,
  Activity,
  Map,
} from 'lucide-react';
import { WorldMap } from '../components/ui';
import {
  COUNTRY_MAP,
  aggregateByRegion,
  aggregateGlobal,
  getTopCountries,
  getBottomCountries,
  type CountryGAIIData,
  type RegionGAIIData,
} from '../data/gaii';

// GAII 점수 색상 (0-100 스케일 사용)
function getGAIIColor(gaii: number): string {
  if (gaii < 30) return 'text-green-400';
  if (gaii < 50) return 'text-yellow-400';
  if (gaii < 70) return 'text-orange-400';
  return 'text-red-400';
}

function getGAIIBgColor(gaii: number): string {
  if (gaii < 30) return 'bg-green-500';
  if (gaii < 50) return 'bg-yellow-500';
  if (gaii < 70) return 'bg-orange-500';
  return 'bg-red-500';
}

function getGAIIGradient(gaii: number): string {
  if (gaii < 30) return 'from-green-500 to-emerald-500';
  if (gaii < 50) return 'from-yellow-500 to-amber-500';
  if (gaii < 70) return 'from-orange-500 to-amber-500';
  return 'from-red-500 to-rose-500';
}

function getGAIILabel(gaii: number): string {
  if (gaii < 30) return 'Low Inequality';
  if (gaii < 50) return 'Moderate';
  if (gaii < 70) return 'High Inequality';
  return 'Critical';
}

// 트렌드 아이콘
function TrendIcon({ trend, value }: { trend: 'up' | 'down' | 'stable'; value: number }) {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-1 text-red-400 text-sm">
        <TrendingUp className="w-4 h-4" />
        +{value.toFixed(1)}%
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-1 text-green-400 text-sm">
        <TrendingDown className="w-4 h-4" />
        -{Math.abs(value).toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-slate-400 text-sm">
      <Activity className="w-4 h-4" />
      Stable
    </span>
  );
}

// 지역 카드 컴포넌트
function RegionCard({
  region,
  expanded,
  onToggle,
}: {
  region: RegionGAIIData;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${getGAIIBgColor(region.weightedGaii)}`}
          />
          <div className="text-left">
            <p className="text-white font-medium">{region.name}</p>
            <p className="text-slate-500 text-sm">{region.nameKo}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-lg font-bold ${getGAIIColor(region.weightedGaii)}`}>
              {region.weightedGaii.toFixed(0)}
            </p>
            <TrendIcon trend={region.trend} value={region.trendValue} />
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-neos-blue" />
                <span className="text-xs text-slate-400">Avg AI Adoption</span>
              </div>
              <p className="text-lg font-semibold text-white">{region.avgAdoptionRate.toFixed(1)}%</p>
              <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neos-blue rounded-full"
                  style={{ width: `${Math.min(region.avgAdoptionRate * 1.5, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Avg GAII</span>
              </div>
              <p className="text-lg font-semibold text-white">{region.avgGaii.toFixed(1)}</p>
              <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${region.avgGaii}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Object.entries(region.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="text-center p-2 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500">{grade}</p>
                <p className="text-sm font-semibold text-white">{count}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Users className="w-4 h-4" />
              <span>Population: {region.totalPopulation.toFixed(0)}M</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Globe className="w-4 h-4" />
              <span>{region.countryCount} countries</span>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                region.weightedGaii < 50
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {getGAIILabel(region.weightedGaii)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// 국가 카드 컴포넌트
function CountryCard({ country }: { country: CountryGAIIData }) {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getGAIIBgColor(country.gaii)}`} />
          <div>
            <p className="text-white text-sm font-medium">{country.name}</p>
            <p className="text-slate-500 text-xs">{country.nameKo}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${getGAIIColor(country.gaii)}`}>
            {country.gaii.toFixed(1)}
          </p>
          <p className="text-slate-500 text-xs">{country.adoptionRate}% adoption</p>
        </div>
      </div>
    </div>
  );
}

export default function GAIIDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'gaii' | 'population' | 'name'>('gaii');

  // 실제 GAII 데이터 사용
  const globalData = useMemo(() => aggregateGlobal(), []);
  const regionData = useMemo(() => aggregateByRegion(), []);
  const topCountries = useMemo(() => getTopCountries(5), []);
  const bottomCountries = useMemo(() => getBottomCountries(5), []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 시뮬레이션 로딩 (실제 API 연동 시 제거)
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      setError('Failed to load GAII data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedRegions = useMemo(() => {
    return [...regionData].sort((a, b) => {
      if (sortBy === 'gaii') return b.weightedGaii - a.weightedGaii;
      if (sortBy === 'population') return b.totalPopulation - a.totalPopulation;
      return a.name.localeCompare(b.name);
    });
  }, [regionData, sortBy]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-neos-blue border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-400">Loading GAII data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-neos-blue to-cyan-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">GAII Dashboard</h1>
            </div>
            <p className="text-slate-400">
              Global AI Inequality Index - AI 불평등 실시간 모니터링
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Global Index Hero */}
        <div className="card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getGAIIGradient(
              globalData.globalGaii
            )}`}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Score */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center">
              <p className="text-slate-400 text-sm mb-2">Global GAII Score</p>
              <div className="relative w-40 h-40">
                {/* Background circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gaiiGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(globalData.globalGaii / 100) * 283} 283`}
                  />
                  <defs>
                    <linearGradient id="gaiiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0052FF" />
                      <stop offset="100%" stopColor="#FF6B00" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getGAIIColor(globalData.globalGaii)}`}>
                    {globalData.globalGaii.toFixed(0)}
                  </span>
                  <span className="text-slate-500 text-sm">/ 100</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendIcon trend="down" value={2.1} />
                <span className="text-slate-500 text-sm">vs last month</span>
              </div>
              <span
                className={`mt-2 px-3 py-1 text-sm rounded-full ${
                  globalData.globalGaii < 50
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {getGAIILabel(globalData.globalGaii)}
              </span>
            </div>

            {/* Key Metrics */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-2 sm:gap-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-5 h-5 text-neos-blue" />
                  <span className="text-slate-400 text-sm">Global Adoption Rate</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {globalData.globalAdoptionRate.toFixed(1)}%
                </p>
                <p className="text-slate-500 text-xs">
                  average AI adoption across all countries
                </p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-slate-400 text-sm">Inequality Gap</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {globalData.inequalityGap.toFixed(1)}%
                </p>
                <p className="text-slate-500 text-xs">
                  Global North vs South adoption gap
                </p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-400 text-sm">Countries Tracked</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {globalData.countries.length}
                </p>
                <p className="text-slate-500 text-xs">
                  countries with GAII data
                </p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-jeong-orange" />
                  <span className="text-slate-400 text-sm">Total Population</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {(globalData.totalPopulation / 1000).toFixed(1)}B
                </p>
                <p className="text-slate-500 text-xs">
                  population covered
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-neos-blue/10 border border-neos-blue/30 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-neos-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-neos-blue font-medium mb-1">About GAII</p>
            <p className="text-slate-400 text-sm">
              GAII (Global AI Inequality Index)는 AI 접근성의 불평등을 측정하는 지표입니다.
              0은 완전한 평등, 100은 극심한 불평등을 의미합니다.
              데이터 소스: Microsoft Global AI Adoption 2025 Report
            </p>
          </div>
        </div>

        {/* World Map Section */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-semibold text-white">Global GAII Map</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            국가를 클릭하면 상세 정보를 확인할 수 있습니다. 색상이 빨간색에 가까울수록 AI 불평등이 심각합니다.
            회색 국가는 데이터가 없습니다.
          </p>
          <WorldMap
            selectedCountry={selectedCountry}
            onCountryClick={(iso3) => {
              setSelectedCountry(selectedCountry === iso3 ? null : iso3);
              const country = COUNTRY_MAP.get(iso3);
              if (country) {
                // 선택된 국가의 지역 카드로 스크롤
                const element = document.getElementById(`region-${country.region}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                setExpandedRegion(country.region);
              }
            }}
          />
        </div>

        {/* Top & Bottom Countries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top Countries (Lowest GAII - Best) */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Top 5 Countries</h3>
              <span className="text-xs text-slate-500">(Lowest GAII)</span>
            </div>
            <div className="space-y-3">
              {topCountries.map((country, idx) => (
                <div key={country.iso3} className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-6">{idx + 1}.</span>
                  <CountryCard country={country} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Countries (Highest GAII - Worst) */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Bottom 5 Countries</h3>
              <span className="text-xs text-slate-500">(Highest GAII)</span>
            </div>
            <div className="space-y-3">
              {bottomCountries.map((country, idx) => (
                <div key={country.iso3} className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-6">{idx + 1}.</span>
                  <CountryCard country={country} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <h2 className="text-xl font-semibold text-white">Regional Analysis</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neos-blue"
              >
                <option value="gaii">GAII Score</option>
                <option value="population">Population</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedRegions.map((region) => (
              <div key={region.code} id={`region-${region.code}`}>
                <RegionCard
                  region={region}
                  expanded={expandedRegion === region.code}
                  onToggle={() =>
                    setExpandedRegion(expandedRegion === region.code ? null : region.code)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-semibold text-white">Regional Comparison</h2>
          </div>
          <div className="space-y-4">
            {sortedRegions.map((region) => (
              <div key={region.code}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium w-28 sm:w-48 truncate">
                      {region.name}
                    </span>
                    <TrendIcon trend={region.trend} value={region.trendValue} />
                  </div>
                  <span className={`font-bold ${getGAIIColor(region.weightedGaii)}`}>
                    {region.weightedGaii.toFixed(0)}
                  </span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getGAIIGradient(
                      region.weightedGaii
                    )} transition-all duration-700`}
                    style={{ width: `${region.weightedGaii}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-500 text-sm">
          <p>
            Last updated: {globalData.lastUpdated}
          </p>
          <p className="mt-1">
            Data sources: {globalData.dataSources.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * WorldMap Component - 국가별 GAII 시각화
 * react-simple-maps를 사용한 인터랙티브 세계지도
 */

import { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { COUNTRY_MAP, type CountryGAIIData } from '../../../data/gaii';

// TopoJSON URL (Natural Earth 110m resolution)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// 숫자 ID를 ISO Alpha-3 코드로 매핑 (world-atlas에서 사용)
const ID_TO_ISO: Record<string, string> = {
  '4': 'AFG', '8': 'ALB', '12': 'DZA', '24': 'AGO', '32': 'ARG', '36': 'AUS',
  '40': 'AUT', '50': 'BGD', '56': 'BEL', '68': 'BOL', '76': 'BRA', '100': 'BGR',
  '104': 'MMR', '116': 'KHM', '120': 'CMR', '124': 'CAN', '140': 'CAF',
  '148': 'TCD', '152': 'CHL', '156': 'CHN', '170': 'COL', '178': 'COG',
  '180': 'COD', '188': 'CRI', '191': 'HRV', '192': 'CUB', '196': 'CYP',
  '203': 'CZE', '208': 'DNK', '214': 'DOM', '218': 'ECU', '818': 'EGY',
  '222': 'SLV', '231': 'ETH', '246': 'FIN', '250': 'FRA', '266': 'GAB',
  '276': 'DEU', '288': 'GHA', '300': 'GRC', '320': 'GTM', '324': 'GIN',
  '328': 'GUY', '332': 'HTI', '340': 'HND', '348': 'HUN', '356': 'IND',
  '360': 'IDN', '364': 'IRN', '368': 'IRQ', '372': 'IRL', '376': 'ISR',
  '380': 'ITA', '384': 'CIV', '388': 'JAM', '392': 'JPN', '400': 'JOR',
  '404': 'KEN', '408': 'PRK', '410': 'KOR', '414': 'KWT', '418': 'LAO',
  '422': 'LBN', '426': 'LSO', '430': 'LBR', '434': 'LBY', '450': 'MDG',
  '454': 'MWI', '458': 'MYS', '466': 'MLI', '478': 'MRT', '484': 'MEX',
  '496': 'MNG', '504': 'MAR', '508': 'MOZ', '516': 'NAM', '524': 'NPL',
  '528': 'NLD', '554': 'NZL', '558': 'NIC', '562': 'NER', '566': 'NGA',
  '578': 'NOR', '512': 'OMN', '586': 'PAK', '591': 'PAN', '598': 'PNG',
  '600': 'PRY', '604': 'PER', '608': 'PHL', '616': 'POL', '620': 'PRT',
  '634': 'QAT', '642': 'ROU', '643': 'RUS', '646': 'RWA', '682': 'SAU',
  '686': 'SEN', '688': 'SRB', '694': 'SLE', '702': 'SGP', '703': 'SVK',
  '704': 'VNM', '705': 'SVN', '706': 'SOM', '710': 'ZAF', '724': 'ESP',
  '144': 'LKA', '729': 'SDN', '740': 'SUR', '748': 'SWZ', '752': 'SWE',
  '756': 'CHE', '760': 'SYR', '764': 'THA', '768': 'TGO', '780': 'TTO',
  '788': 'TUN', '792': 'TUR', '800': 'UGA', '804': 'UKR', '784': 'ARE',
  '826': 'GBR', '834': 'TZA', '840': 'USA', '854': 'BFA', '858': 'URY',
  '860': 'UZB', '862': 'VEN', '887': 'YEM', '894': 'ZMB', '716': 'ZWE',
  '728': 'SSD', '112': 'BLR', '233': 'EST', '428': 'LVA', '440': 'LTU',
  '499': 'MNE', '807': 'MKD', '70': 'BIH', '344': 'HKG', '158': 'TWN',
  '398': 'KAZ', '417': 'KGZ', '762': 'TJK', '795': 'TKM', '51': 'ARM',
  '31': 'AZE', '268': 'GEO', '242': 'FJI', '64': 'BTN', '462': 'MDV',
  '96': 'BRN', '626': 'TLS',
};

interface WorldMapProps {
  onCountryClick?: (countryIso3: string) => void;
  selectedCountry?: string | null;
}

// GAII 점수에 따른 색상
function getGAIIFillColor(gaii: number): string {
  if (gaii < 30) return '#4ade80'; // green - Low
  if (gaii < 50) return '#facc15'; // yellow - Moderate
  if (gaii < 70) return '#fb923c'; // orange - High
  return '#f87171'; // red - Critical
}

// 호버 시 밝은 색상
function getGAIIHoverColor(gaii: number): string {
  if (gaii < 30) return '#86efac';
  if (gaii < 50) return '#fde047';
  if (gaii < 70) return '#fdba74';
  return '#fca5a5';
}

const WorldMap = memo(function WorldMap({
  onCountryClick,
  selectedCountry
}: WorldMapProps) {
  const { t, i18n } = useTranslation('platform');
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: CountryGAIIData;
  } | null>(null);

  // 국가 ID에서 ISO3 코드 가져오기
  const getIsoFromGeo = (geo: { id?: string; properties?: { ISO_A3?: string } }): string | null => {
    // properties에서 ISO_A3 코드 시도
    const isoCode = geo.properties?.ISO_A3;
    if (isoCode && isoCode !== '-99') {
      return isoCode;
    }
    // ID로 변환 시도
    if (geo.id) {
      return ID_TO_ISO[geo.id] || null;
    }
    return null;
  };

  const handleMouseEnter = (
    countryIso3: string,
    event: React.MouseEvent
  ) => {
    setHoveredCountry(countryIso3);
    const country = COUNTRY_MAP.get(countryIso3);
    if (country) {
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        country,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip) {
      setTooltip((prev) =>
        prev ? { ...prev, x: event.clientX, y: event.clientY } : null
      );
    }
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
    setTooltip(null);
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: '2/1' }}>
      {/* 범례 */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
        <p className="text-slate-400 text-xs font-medium mb-2">GAII Score</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#4ade80' }} />
            <span className="text-xs text-slate-300">0-29 (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#facc15' }} />
            <span className="text-xs text-slate-300">30-49 (Moderate)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#fb923c' }} />
            <span className="text-xs text-slate-300">50-69 (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#f87171' }} />
            <span className="text-xs text-slate-300">70+ (Critical)</span>
          </div>
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-slate-700">
            <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#1e293b' }} />
            <span className="text-xs text-slate-500">No Data</span>
          </div>
        </div>
      </div>

      {/* 툴팁 */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl pointer-events-none"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 10,
          }}
        >
          <p className="text-white font-medium text-sm">{tooltip.country.name}</p>
          {i18n.language !== 'en' && (
            <p className="text-slate-400 text-xs">{t(`gaii.countryNames.${tooltip.country.iso3}`, { defaultValue: tooltip.country.name })}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getGAIIFillColor(tooltip.country.gaii) }}
            />
            <span
              className="font-bold text-sm"
              style={{ color: getGAIIFillColor(tooltip.country.gaii) }}
            >
              GAII: {tooltip.country.gaii.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            AI Adoption: {tooltip.country.adoptionRate}%
          </div>
        </div>
      )}

      {/* 지도 */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 130,
          center: [10, 30],
        }}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
        }}
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isoCode = getIsoFromGeo(geo);
                const country = isoCode ? COUNTRY_MAP.get(isoCode) : null;
                const isHovered = hoveredCountry === isoCode;
                const isSelected = selectedCountry === isoCode;

                // 기본 색상 (데이터가 없는 국가)
                let fillColor = '#1e293b';
                if (country) {
                  fillColor = isHovered
                    ? getGAIIHoverColor(country.gaii)
                    : getGAIIFillColor(country.gaii);
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => {
                      if (isoCode) {
                        handleMouseEnter(isoCode, e);
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      if (isoCode && country) {
                        onCountryClick?.(isoCode);
                      }
                    }}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: isSelected ? '#0052FF' : '#334155',
                        strokeWidth: isSelected ? 1.5 : 0.3,
                        outline: 'none',
                        transition: 'fill 0.2s ease',
                      },
                      hover: {
                        fill: country ? getGAIIHoverColor(country.gaii) : '#334155',
                        stroke: country ? '#0052FF' : '#334155',
                        strokeWidth: country ? 1 : 0.3,
                        outline: 'none',
                        cursor: country ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: country ? getGAIIFillColor(country.gaii) : '#1e293b',
                        stroke: '#0052FF',
                        strokeWidth: 1.5,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
});

export default WorldMap;

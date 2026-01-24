/**
 * GAII Country Data
 * Source: Microsoft Global AI Adoption 2025 Report + Supplementary Data
 * Last Updated: 2026-Q1
 *
 * GAII v1.0 - 4개 지표 기반
 * - Access (40%): AI 서비스 보급률, 인터넷 인프라
 * - Affordability (30%): 구독료/소득 비율, 무료 서비스 가용성
 * - Language (20%): 현지 언어 AI 지원 수준
 * - Skill (10%): AI 리터러시, STEM 교육 수준
 */

import type { CountryGAIIData, GAIIIndicators } from './schema';
import { calculateGaiiGrade, calculateGaii } from './schema';

// 레거시: 채택률 기반 데이터 생성 (하위 호환)
function createCountryData(
  iso3: string,
  iso2: string,
  name: string,
  nameKo: string,
  region: CountryGAIIData['region'],
  population: number,
  workingAgePop: number,
  adoptionRate: number,
  paidUserIndex: number,
  trend: CountryGAIIData['trend'],
  trendValue: number
): CountryGAIIData {
  const gaii = calculateGaii(adoptionRate);
  // 레거시 데이터에는 추정 지표 생성
  const indicators: GAIIIndicators = estimateIndicators(adoptionRate, paidUserIndex);
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
    dataSource: 'Microsoft Global AI Adoption 2025',
    lastUpdated: '2025-H2',
  };
}

// 채택률/유료지수 기반 지표 추정 (레거시 데이터용)
function estimateIndicators(adoptionRate: number, paidUserIndex: number): GAIIIndicators {
  // 채택률과 유료지수를 기반으로 4개 지표 추정
  const accessScore = Math.min(100, (adoptionRate / 65) * 100);
  const affordabilityScore = Math.min(100, paidUserIndex * 0.8 + 20);
  const languageScore = Math.min(100, adoptionRate * 1.2 + 10);
  const skillScore = Math.min(100, (adoptionRate + paidUserIndex) / 2);

  return {
    access: Math.round(accessScore * 10) / 10,
    accessDetails: {
      aiAdoptionRate: adoptionRate,
      internetPenetration: Math.min(100, adoptionRate * 2),
      mobileConnectivity: Math.min(100, adoptionRate * 1.5),
      infrastructureQuality: Math.min(100, paidUserIndex),
    },
    affordability: Math.round(affordabilityScore * 10) / 10,
    affordabilityDetails: {
      aiCostToIncome: Math.max(0, 30 - adoptionRate * 0.4),
      freeServiceAccess: Math.min(100, adoptionRate * 1.2),
      purchasingPower: paidUserIndex,
    },
    language: Math.round(languageScore * 10) / 10,
    languageDetails: {
      nativeLanguageSupport: Math.min(100, adoptionRate * 1.5),
      translationQuality: Math.min(100, adoptionRate * 1.2),
      localContentAvailability: Math.min(100, adoptionRate),
    },
    skill: Math.round(skillScore * 10) / 10,
    skillDetails: {
      aiLiteracy: Math.min(100, adoptionRate * 1.3),
      stemEducation: Math.min(100, paidUserIndex * 0.9),
      digitalSkills: Math.min(100, (adoptionRate + paidUserIndex) / 2),
    },
  };
}

export const COUNTRY_DATA: CountryGAIIData[] = [
  // ===== North America (NA) =====
  createCountryData('USA', 'US', 'United States', '미국', 'NA', 334.9, 65, 28.3, 98, 'stable', 0.5),
  createCountryData('CAN', 'CA', 'Canada', '캐나다', 'NA', 40.1, 67, 33.5, 80, 'up', 1.2),
  createCountryData('MEX', 'MX', 'Mexico', '멕시코', 'NA', 130.2, 66, 12.8, 34, 'up', 2.1),

  // ===== Europe (EU) =====
  createCountryData('GBR', 'GB', 'United Kingdom', '영국', 'EU', 67.7, 63, 38.9, 88, 'up', 1.8),
  createCountryData('FRA', 'FR', 'France', '프랑스', 'EU', 68.1, 62, 44.0, 82, 'up', 2.3),
  createCountryData('DEU', 'DE', 'Germany', '독일', 'EU', 84.4, 64, 26.5, 82, 'up', 1.5),
  createCountryData('ITA', 'IT', 'Italy', '이탈리아', 'EU', 58.9, 63, 25.8, 68, 'up', 1.2),
  createCountryData('ESP', 'ES', 'Spain', '스페인', 'EU', 47.6, 66, 39.7, 75, 'up', 2.0),
  createCountryData('NLD', 'NL', 'Netherlands', '네덜란드', 'EU', 17.8, 65, 38.9, 84, 'up', 1.7),
  createCountryData('BEL', 'BE', 'Belgium', '벨기에', 'EU', 11.7, 64, 36.0, 74, 'up', 1.4),
  createCountryData('PRT', 'PT', 'Portugal', '포르투갈', 'EU', 10.4, 64, 21.8, 54, 'up', 1.8),
  createCountryData('POL', 'PL', 'Poland', '폴란드', 'EU', 37.7, 68, 26.4, 58, 'up', 2.2),
  createCountryData('ROU', 'RO', 'Romania', '루마니아', 'EU', 19.0, 65, 10.2, 38, 'up', 1.5),
  createCountryData('CZE', 'CZ', 'Czech Republic', '체코', 'EU', 10.5, 65, 26.0, 56, 'up', 1.3),
  createCountryData('HUN', 'HU', 'Hungary', '헝가리', 'EU', 9.6, 66, 27.9, 55, 'up', 1.8),
  createCountryData('GRC', 'GR', 'Greece', '그리스', 'EU', 10.4, 63, 20.5, 50, 'up', 1.2),
  createCountryData('SWE', 'SE', 'Sweden', '스웨덴', 'EU', 10.5, 62, 31.2, 83, 'up', 1.5),
  createCountryData('NOR', 'NO', 'Norway', '노르웨이', 'EU', 5.5, 66, 46.4, 88, 'up', 1.9),
  createCountryData('FIN', 'FI', 'Finland', '핀란드', 'EU', 5.5, 62, 25.4, 76, 'up', 1.3),
  createCountryData('DNK', 'DK', 'Denmark', '덴마크', 'EU', 5.9, 64, 26.6, 78, 'up', 1.4),
  createCountryData('IRL', 'IE', 'Ireland', '아일랜드', 'EU', 5.2, 66, 44.6, 85, 'up', 2.1),
  createCountryData('AUT', 'AT', 'Austria', '오스트리아', 'EU', 9.1, 66, 29.1, 72, 'up', 1.2),
  createCountryData('CHE', 'CH', 'Switzerland', '스위스', 'EU', 8.8, 67, 32.4, 89, 'up', 1.4),
  createCountryData('BGR', 'BG', 'Bulgaria', '불가리아', 'EU', 6.8, 65, 25.6, 48, 'up', 2.0),
  createCountryData('SVK', 'SK', 'Slovakia', '슬로바키아', 'EU', 5.4, 69, 9.8, 36, 'up', 1.1),
  createCountryData('HRV', 'HR', 'Croatia', '크로아티아', 'EU', 3.9, 65, 16.2, 44, 'up', 1.3),
  createCountryData('SVN', 'SI', 'Slovenia', '슬로베니아', 'EU', 2.1, 66, 17.5, 54, 'up', 1.2),
  createCountryData('EST', 'EE', 'Estonia', '에스토니아', 'EU', 1.4, 64, 21.0, 62, 'up', 1.5),
  createCountryData('LVA', 'LV', 'Latvia', '라트비아', 'EU', 1.8, 64, 8.5, 34, 'up', 0.9),
  createCountryData('LTU', 'LT', 'Lithuania', '리투아니아', 'EU', 2.8, 66, 8.2, 36, 'up', 1.0),
  createCountryData('LUX', 'LU', 'Luxembourg', '룩셈부르크', 'EU', 0.7, 70, 18.5, 80, 'up', 1.2),
  createCountryData('ISL', 'IS', 'Iceland', '아이슬란드', 'EU', 0.4, 67, 16.8, 75, 'up', 1.1),
  createCountryData('SRB', 'RS', 'Serbia', '세르비아', 'EU', 6.7, 65, 7.9, 24, 'up', 1.4),
  createCountryData('UKR', 'UA', 'Ukraine', '우크라이나', 'EU', 37.0, 68, 7.2, 20, 'down', -0.5),
  createCountryData('RUS', 'RU', 'Russia', '러시아', 'EU', 144.1, 68, 15.0, 45, 'stable', 0.2),
  createCountryData('BLR', 'BY', 'Belarus', '벨라루스', 'EU', 9.2, 68, 8.0, 22, 'stable', 0.3),

  // ===== East Asia (EA) =====
  createCountryData('CHN', 'CN', 'China', '중국', 'EA', 1412.0, 70, 18.5, 55, 'up', 3.2),
  createCountryData('JPN', 'JP', 'Japan', '일본', 'EA', 124.0, 59, 23.1, 74, 'up', 1.8),
  createCountryData('KOR', 'KR', 'South Korea', '대한민국', 'EA', 51.7, 72, 30.7, 94, 'up', 5.8),
  createCountryData('TWN', 'TW', 'Taiwan', '대만', 'EA', 23.9, 71, 26.4, 70, 'up', 2.5),
  createCountryData('HKG', 'HK', 'Hong Kong', '홍콩', 'EA', 7.5, 70, 22.5, 72, 'up', 1.8),
  createCountryData('MNG', 'MN', 'Mongolia', '몽골', 'EA', 3.4, 68, 6.5, 18, 'up', 1.2),
  createCountryData('PRK', 'KP', 'North Korea', '북한', 'EA', 26.1, 69, 0.1, 0, 'stable', 0.0),

  // ===== South Asia (SA) =====
  createCountryData('IND', 'IN', 'India', '인도', 'SA', 1428.6, 67, 13.0, 35, 'up', 2.8),
  createCountryData('PAK', 'PK', 'Pakistan', '파키스탄', 'SA', 240.5, 60, 4.5, 7, 'up', 0.8),
  createCountryData('BGD', 'BD', 'Bangladesh', '방글라데시', 'SA', 173.0, 66, 4.2, 6, 'up', 0.9),
  createCountryData('LKA', 'LK', 'Sri Lanka', '스리랑카', 'SA', 22.2, 65, 5.5, 9, 'up', 0.7),
  createCountryData('NPL', 'NP', 'Nepal', '네팔', 'SA', 30.9, 62, 2.3, 2, 'up', 0.5),
  createCountryData('AFG', 'AF', 'Afghanistan', '아프가니스탄', 'SA', 42.2, 52, 0.9, 0, 'down', -0.2),
  createCountryData('BTN', 'BT', 'Bhutan', '부탄', 'SA', 0.8, 65, 3.0, 4, 'up', 0.6),
  createCountryData('MDV', 'MV', 'Maldives', '몰디브', 'SA', 0.5, 70, 8.5, 15, 'up', 1.0),

  // ===== Southeast Asia (SEA) =====
  createCountryData('IDN', 'ID', 'Indonesia', '인도네시아', 'SEA', 277.5, 67, 12.2, 30, 'up', 2.2),
  createCountryData('THA', 'TH', 'Thailand', '태국', 'SEA', 71.8, 70, 12.5, 32, 'up', 1.8),
  createCountryData('VNM', 'VN', 'Vietnam', '베트남', 'SEA', 100.0, 69, 11.5, 27, 'up', 2.5),
  createCountryData('PHL', 'PH', 'Philippines', '필리핀', 'SEA', 117.3, 63, 11.8, 28, 'up', 2.0),
  createCountryData('MYS', 'MY', 'Malaysia', '말레이시아', 'SEA', 34.3, 69, 19.2, 46, 'up', 2.3),
  createCountryData('SGP', 'SG', 'Singapore', '싱가포르', 'SEA', 6.0, 74, 60.9, 95, 'up', 2.3),
  createCountryData('MMR', 'MM', 'Myanmar', '미얀마', 'SEA', 54.8, 66, 2.5, 3, 'down', -0.3),
  createCountryData('KHM', 'KH', 'Cambodia', '캄보디아', 'SEA', 17.0, 63, 2.1, 2, 'up', 0.5),
  createCountryData('LAO', 'LA', 'Laos', '라오스', 'SEA', 7.5, 62, 1.8, 2, 'up', 0.4),
  createCountryData('BRN', 'BN', 'Brunei', '브루나이', 'SEA', 0.4, 72, 15.0, 40, 'up', 1.2),
  createCountryData('TLS', 'TL', 'Timor-Leste', '동티모르', 'SEA', 1.4, 58, 1.0, 1, 'up', 0.2),

  // ===== Latin America (LA) =====
  createCountryData('BRA', 'BR', 'Brazil', '브라질', 'LA', 216.4, 69, 14.1, 40, 'up', 2.0),
  createCountryData('ARG', 'AR', 'Argentina', '아르헨티나', 'LA', 46.2, 64, 15.5, 38, 'up', 1.5),
  createCountryData('COL', 'CO', 'Colombia', '콜롬비아', 'LA', 52.2, 68, 11.2, 26, 'up', 1.8),
  createCountryData('PER', 'PE', 'Peru', '페루', 'LA', 34.0, 66, 10.8, 24, 'up', 1.5),
  createCountryData('VEN', 'VE', 'Venezuela', '베네수엘라', 'LA', 28.4, 65, 1.4, 1, 'down', -0.5),
  createCountryData('CHL', 'CL', 'Chile', '칠레', 'LA', 19.5, 68, 19.5, 48, 'up', 1.8),
  createCountryData('ECU', 'EC', 'Ecuador', '에콰도르', 'LA', 18.2, 65, 7.5, 16, 'up', 1.2),
  createCountryData('BOL', 'BO', 'Bolivia', '볼리비아', 'LA', 12.4, 62, 3.5, 4, 'up', 0.8),
  createCountryData('PRY', 'PY', 'Paraguay', '파라과이', 'LA', 6.8, 63, 3.3, 4, 'up', 0.7),
  createCountryData('URY', 'UY', 'Uruguay', '우루과이', 'LA', 3.4, 64, 18.8, 44, 'up', 1.5),
  createCountryData('CRI', 'CR', 'Costa Rica', '코스타리카', 'LA', 5.2, 68, 25.1, 45, 'up', 2.0),
  createCountryData('PAN', 'PA', 'Panama', '파나마', 'LA', 4.4, 65, 17.0, 40, 'up', 1.8),
  createCountryData('DOM', 'DO', 'Dominican Republic', '도미니카공화국', 'LA', 11.3, 65, 6.0, 15, 'up', 1.0),
  createCountryData('GTM', 'GT', 'Guatemala', '과테말라', 'LA', 18.1, 60, 4.8, 8, 'up', 0.9),
  createCountryData('HND', 'HN', 'Honduras', '온두라스', 'LA', 10.6, 62, 3.8, 6, 'up', 0.7),
  createCountryData('SLV', 'SV', 'El Salvador', '엘살바도르', 'LA', 6.3, 64, 5.2, 10, 'up', 1.0),
  createCountryData('NIC', 'NI', 'Nicaragua', '니카라과', 'LA', 7.0, 63, 3.0, 5, 'up', 0.6),
  createCountryData('CUB', 'CU', 'Cuba', '쿠바', 'LA', 11.1, 68, 1.5, 1, 'stable', 0.1),
  createCountryData('HTI', 'HT', 'Haiti', '아이티', 'LA', 11.7, 58, 1.1, 1, 'down', -0.2),
  createCountryData('JAM', 'JM', 'Jamaica', '자메이카', 'LA', 2.8, 66, 5.5, 12, 'up', 0.8),
  createCountryData('TTO', 'TT', 'Trinidad and Tobago', '트리니다드토바고', 'LA', 1.5, 68, 8.0, 18, 'up', 1.0),

  // ===== Middle East & North Africa (ME) =====
  createCountryData('ARE', 'AE', 'United Arab Emirates', '아랍에미리트', 'ME', 10.0, 83, 64.0, 92, 'up', 4.5),
  createCountryData('SAU', 'SA', 'Saudi Arabia', '사우디아라비아', 'ME', 36.4, 72, 26.2, 65, 'up', 3.0),
  createCountryData('QAT', 'QA', 'Qatar', '카타르', 'ME', 2.7, 85, 38.3, 78, 'up', 2.5),
  createCountryData('KWT', 'KW', 'Kuwait', '쿠웨이트', 'ME', 4.3, 73, 20.1, 58, 'up', 2.0),
  createCountryData('BHR', 'BH', 'Bahrain', '바레인', 'ME', 1.5, 79, 17.8, 52, 'up', 1.8),
  createCountryData('OMN', 'OM', 'Oman', '오만', 'ME', 4.6, 74, 18.2, 45, 'up', 1.5),
  createCountryData('ISR', 'IL', 'Israel', '이스라엘', 'ME', 9.7, 62, 33.9, 86, 'up', 2.2),
  createCountryData('JOR', 'JO', 'Jordan', '요르단', 'ME', 11.3, 62, 25.4, 42, 'up', 2.5),
  createCountryData('LBN', 'LB', 'Lebanon', '레바논', 'ME', 5.5, 65, 8.5, 20, 'down', -1.0),
  createCountryData('TUR', 'TR', 'Turkey', '터키', 'ME', 85.8, 67, 10.5, 35, 'up', 1.5),
  createCountryData('IRN', 'IR', 'Iran', '이란', 'ME', 89.2, 70, 6.0, 15, 'stable', 0.3),
  createCountryData('IRQ', 'IQ', 'Iraq', '이라크', 'ME', 44.5, 58, 4.5, 8, 'up', 0.8),
  createCountryData('SYR', 'SY', 'Syria', '시리아', 'ME', 23.2, 60, 1.5, 2, 'down', -0.5),
  createCountryData('YEM', 'YE', 'Yemen', '예멘', 'ME', 34.4, 57, 0.8, 1, 'down', -0.3),
  createCountryData('EGY', 'EG', 'Egypt', '이집트', 'ME', 112.7, 62, 9.2, 20, 'up', 1.5),
  createCountryData('MAR', 'MA', 'Morocco', '모로코', 'ME', 37.8, 65, 8.8, 18, 'up', 1.3),
  createCountryData('DZA', 'DZ', 'Algeria', '알제리', 'ME', 45.6, 63, 4.0, 5, 'up', 0.6),
  createCountryData('TUN', 'TN', 'Tunisia', '튀니지', 'ME', 12.5, 66, 6.8, 14, 'up', 1.0),
  createCountryData('LBY', 'LY', 'Libya', '리비아', 'ME', 7.0, 67, 3.5, 6, 'stable', 0.2),

  // ===== Sub-Saharan Africa (SSA) =====
  createCountryData('NGA', 'NG', 'Nigeria', '나이지리아', 'SSA', 223.8, 54, 6.5, 12, 'up', 1.5),
  createCountryData('ETH', 'ET', 'Ethiopia', '에티오피아', 'SSA', 126.5, 56, 3.0, 2, 'up', 0.8),
  createCountryData('ZAF', 'ZA', 'South Africa', '남아프리카공화국', 'SSA', 60.4, 65, 18.0, 42, 'up', 1.8),
  createCountryData('KEN', 'KE', 'Kenya', '케냐', 'SSA', 55.1, 58, 6.2, 11, 'up', 1.2),
  createCountryData('TZA', 'TZ', 'Tanzania', '탄자니아', 'SSA', 67.4, 55, 2.8, 2, 'up', 0.6),
  createCountryData('UGA', 'UG', 'Uganda', '우간다', 'SSA', 48.6, 52, 2.6, 2, 'up', 0.5),
  createCountryData('GHA', 'GH', 'Ghana', '가나', 'SSA', 34.1, 57, 3.8, 5, 'up', 0.8),
  createCountryData('CIV', 'CI', 'Ivory Coast', '코트디부아르', 'SSA', 28.2, 58, 1.8, 1, 'up', 0.4),
  createCountryData('CMR', 'CM', 'Cameroon', '카메룬', 'SSA', 28.6, 56, 1.9, 1, 'up', 0.4),
  createCountryData('AGO', 'AO', 'Angola', '앙골라', 'SSA', 36.7, 53, 1.7, 1, 'up', 0.3),
  createCountryData('SEN', 'SN', 'Senegal', '세네갈', 'SSA', 17.9, 56, 2.0, 2, 'up', 0.5),
  createCountryData('ZWE', 'ZW', 'Zimbabwe', '짐바브웨', 'SSA', 16.3, 58, 1.3, 1, 'stable', 0.1),
  createCountryData('ZMB', 'ZM', 'Zambia', '잠비아', 'SSA', 20.6, 54, 1.2, 1, 'up', 0.3),
  createCountryData('RWA', 'RW', 'Rwanda', '르완다', 'SSA', 14.1, 57, 2.2, 3, 'up', 0.6),
  createCountryData('SDN', 'SD', 'Sudan', '수단', 'SSA', 48.1, 56, 1.5, 1, 'down', -0.3),
  createCountryData('SSD', 'SS', 'South Sudan', '남수단', 'SSA', 11.4, 55, 0.3, 0, 'stable', 0.0),
  createCountryData('MOZ', 'MZ', 'Mozambique', '모잠비크', 'SSA', 33.9, 54, 1.0, 1, 'up', 0.2),
  createCountryData('MDG', 'MG', 'Madagascar', '마다가스카르', 'SSA', 30.3, 58, 0.8, 1, 'up', 0.2),
  createCountryData('MLI', 'ML', 'Mali', '말리', 'SSA', 23.3, 52, 0.8, 0, 'stable', 0.1),
  createCountryData('NER', 'NE', 'Niger', '니제르', 'SSA', 27.2, 49, 0.5, 0, 'up', 0.1),
  createCountryData('BFA', 'BF', 'Burkina Faso', '부르키나파소', 'SSA', 23.3, 52, 0.7, 0, 'stable', 0.1),
  createCountryData('TCD', 'TD', 'Chad', '차드', 'SSA', 18.5, 51, 0.4, 0, 'stable', 0.0),
  createCountryData('SOM', 'SO', 'Somalia', '소말리아', 'SSA', 18.1, 53, 0.5, 0, 'stable', 0.0),
  createCountryData('COD', 'CD', 'DR Congo', '콩고민주공화국', 'SSA', 102.3, 53, 0.6, 0, 'up', 0.1),
  createCountryData('COG', 'CG', 'Congo', '콩고공화국', 'SSA', 6.1, 55, 1.2, 1, 'up', 0.2),
  createCountryData('CAF', 'CF', 'Central African Republic', '중앙아프리카공화국', 'SSA', 5.6, 56, 0.3, 0, 'stable', 0.0),

  // ===== Oceania (OC) =====
  createCountryData('AUS', 'AU', 'Australia', '호주', 'OC', 26.4, 65, 34.5, 81, 'up', 1.8),
  createCountryData('NZL', 'NZ', 'New Zealand', '뉴질랜드', 'OC', 5.2, 65, 40.5, 79, 'up', 2.0),
  createCountryData('PNG', 'PG', 'Papua New Guinea', '파푸아뉴기니', 'OC', 10.3, 57, 1.2, 1, 'up', 0.3),
  createCountryData('FJI', 'FJ', 'Fiji', '피지', 'OC', 0.9, 63, 5.5, 12, 'up', 0.8),

  // ===== Central Asia (CA) =====
  createCountryData('KAZ', 'KZ', 'Kazakhstan', '카자흐스탄', 'CA', 19.6, 66, 9.5, 22, 'up', 1.5),
  createCountryData('UZB', 'UZ', 'Uzbekistan', '우즈베키스탄', 'CA', 35.3, 62, 5.8, 10, 'up', 1.2),
  createCountryData('TKM', 'TM', 'Turkmenistan', '투르크메니스탄', 'CA', 6.5, 64, 2.0, 3, 'stable', 0.2),
  createCountryData('TJK', 'TJ', 'Tajikistan', '타지키스탄', 'CA', 10.1, 59, 1.5, 2, 'up', 0.4),
  createCountryData('KGZ', 'KG', 'Kyrgyzstan', '키르기스스탄', 'CA', 7.0, 63, 3.2, 5, 'up', 0.6),
  createCountryData('AZE', 'AZ', 'Azerbaijan', '아제르바이잔', 'CA', 10.4, 67, 5.0, 16, 'up', 0.9),
  createCountryData('GEO', 'GE', 'Georgia', '조지아', 'CA', 3.7, 65, 5.2, 18, 'up', 1.0),
  createCountryData('ARM', 'AM', 'Armenia', '아르메니아', 'CA', 2.8, 66, 4.5, 12, 'up', 0.8),
];

// 국가 코드로 빠른 조회를 위한 맵
export const COUNTRY_MAP = new Map<string, CountryGAIIData>(
  COUNTRY_DATA.map(country => [country.iso3, country])
);

// ISO2 코드로도 조회 가능하도록
export const COUNTRY_MAP_ISO2 = new Map<string, CountryGAIIData>(
  COUNTRY_DATA.map(country => [country.iso2, country])
);

/**
 * Seed Script: Korean (ko) translations for quest content
 *
 * Usage: SUPABASE_SERVICE_KEY=your_key npx tsx game/scripts/seed-korean-translations.ts
 *
 * This script inserts Korean translations into the content_translations table.
 * Translation data should be prepared externally and added to the
 * regionTranslations, countryTranslations, and questTranslations arrays below.
 *
 * Table row structure (content_translations):
 *   content_type: 'region' | 'country' | 'quest'
 *   content_id:   e.g. 'east_asia', 'kr', 'kr-q1'
 *   language:     'ko'
 *   translations: JSONB object (see examples below)
 *   verified:     boolean
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://euchaicondbmdkomnilr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_KEY environment variable is required.');
  console.error('Usage: SUPABASE_SERVICE_KEY=your_key npx tsx game/scripts/seed-korean-translations.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// =============================================================================
// Region Translations (ko)
// Format: { name: '한국어 지역명' }
// =============================================================================

const regionTranslations = [
  { content_type: 'region', content_id: 'east_asia', language: 'ko', translations: { name: '동아시아' }, verified: true },
  { content_type: 'region', content_id: 'southeast_asia', language: 'ko', translations: { name: '동남아시아' }, verified: true },
  { content_type: 'region', content_id: 'south_asia', language: 'ko', translations: { name: '남아시아' }, verified: true },
  { content_type: 'region', content_id: 'middle_east', language: 'ko', translations: { name: '중동' }, verified: true },
  { content_type: 'region', content_id: 'europe', language: 'ko', translations: { name: '유럽' }, verified: true },
  { content_type: 'region', content_id: 'africa', language: 'ko', translations: { name: '아프리카' }, verified: true },
  { content_type: 'region', content_id: 'americas', language: 'ko', translations: { name: '아메리카' }, verified: true },
  { content_type: 'region', content_id: 'oceania', language: 'ko', translations: { name: '오세아니아' }, verified: true },
];

// =============================================================================
// Country Translations (ko)
// Format: { name, localName, greeting, culturalValue, description }
// =============================================================================

const countryTranslations = [
  {
    content_type: 'country', content_id: 'kr', language: 'ko', verified: true,
    translations: {
      name: '대한민국',
      localName: '대한민국',
      greeting: '안녕하세요 (Annyeonghaseyo)',
      culturalValue: '정(情) - 사람 사이의 깊은 정서적 유대',
      description: '고대 전통과 첨단 기술이 만나는 역동적인 나라. 한국은 정(情)으로 유명합니다 — 따뜻함, 애정, 깊은 인간적 유대로 공동체를 하나로 묶는 한국 고유의 문화적 개념입니다.',
    },
  },
  {
    content_type: 'country', content_id: 'jp', language: 'ko', verified: true,
    translations: {
      name: '일본',
      localName: '日本',
      greeting: 'こんにちは (Konnichiwa)',
      culturalValue: '오모테나시 (おもてなし) - 진심 어린 환대',
      description: '고대의 지혜와 현대의 혁신이 조화를 이루는 섬나라. 일본은 오모테나시 — 상대방이 말하기 전에 그 필요를 미리 헤아리는 진심 어린 환대의 예술로 유명합니다.',
    },
  },
  {
    content_type: 'country', content_id: 'cn', language: 'ko', verified: true,
    translations: {
      name: '중국',
      localName: '中国',
      greeting: '你好 (Nǐ hǎo)',
      culturalValue: '관시(关系) - 의미 있는 관계와 상호 신뢰',
      description: '세계에서 가장 오래된 문명 중 하나인 중국은 놀라운 다양성과 풍부한 문화 유산의 땅입니다. 깊은 신뢰 기반의 관계를 구축하는 관시 개념이 중국 사회 및 비즈니스 생활의 중심에 있습니다.',
    },
  },
  {
    content_type: 'country', content_id: 'th', language: 'ko', verified: true,
    translations: {
      name: '태국',
      localName: 'ประเทศไทย',
      greeting: 'Sawasdee krub/ka',
      culturalValue: '존경과 조화',
      description: '미소의 나라로 알려진 태국은 깊은 불교 전통과 따뜻한 환대, 어른과 왕실에 대한 경외를 조화롭게 이어가고 있습니다.',
    },
  },
  {
    content_type: 'country', content_id: 'vn', language: 'ko', verified: true,
    translations: {
      name: '베트남',
      localName: 'Việt Nam',
      greeting: 'Xin chao',
      culturalValue: '효(孝)와 가족',
      description: '풍부한 역사와 강인한 정신의 나라, 베트남은 가족 유대, 어른에 대한 존경, 그리고 수세기 전통으로 빚어진 활기찬 음식 문화를 소중히 여깁니다.',
    },
  },
  {
    content_type: 'country', content_id: 'id', language: 'ko', verified: true,
    translations: {
      name: '인도네시아',
      localName: 'Indonesia',
      greeting: 'Selamat pagi',
      culturalValue: '고통 로용 (상호 협력)',
      description: '세계 최대의 군도 국가 인도네시아는 17,000개 이상의 섬, 수백 개의 민족, 그리고 고통 로용으로 알려진 깊이 뿌리내린 공동체 화합의 정신이 있습니다.',
    },
  },
  {
    content_type: 'country', content_id: 'in', language: 'ko', verified: true,
    translations: {
      name: '인도',
      localName: 'भारत',
      greeting: 'Namaste',
      culturalValue: '나마스테 (존경)',
      description: '다양한 문화, 고대 전통, 따뜻한 환대의 나라.',
    },
  },
  {
    content_type: 'country', content_id: 'tr', language: 'ko', verified: true,
    translations: {
      name: '튀르키예',
      localName: 'Türkiye',
      greeting: 'Merhaba',
      culturalValue: '환대 (Misafirperverlik)',
      description: '동양과 서양이 만나는 곳, 전설적인 환대와 풍부한 유산으로 유명합니다.',
    },
  },
  {
    content_type: 'country', content_id: 'ae', language: 'ko', verified: true,
    translations: {
      name: 'UAE',
      localName: 'الإمارات',
      greeting: 'As-salamu alaykum',
      culturalValue: '관용 (카라마)',
      description: '고대 베두인 전통과 미래지향적 비전이 결합된 현대의 오아시스.',
    },
  },
  {
    content_type: 'country', content_id: 'fr', language: 'ko', verified: true,
    translations: {
      name: '프랑스',
      localName: 'France',
      greeting: 'Bonjour',
      culturalValue: '예의 (Politesse)',
      description: '예술, 요리, 세련된 사교 에티켓의 나라.',
    },
  },
  {
    content_type: 'country', content_id: 'gb', language: 'ko', verified: true,
    translations: {
      name: '영국',
      localName: 'United Kingdom',
      greeting: 'Hello',
      culturalValue: '페어 플레이',
      description: '전통, 예의, 줄서기의 기술을 가진 나라.',
    },
  },
  {
    content_type: 'country', content_id: 'de', language: 'ko', verified: true,
    translations: {
      name: '독일',
      localName: 'Deutschland',
      greeting: 'Hallo',
      culturalValue: '시간 엄수 (Pünktlichkeit)',
      description: '정밀함, 효율성, 질서와 공동체에 대한 깊은 존중으로 알려진 나라.',
    },
  },
  {
    content_type: 'country', content_id: 'za', language: 'ko', verified: true,
    translations: {
      name: '남아프리카 공화국',
      localName: 'South Africa',
      greeting: 'Sawubona',
      culturalValue: '우분투 (공동체 정신)',
      description: '우리 모두가 연결되어 있다는 믿음으로 하나 된 무지개 나라.',
    },
  },
  {
    content_type: 'country', content_id: 'ke', language: 'ko', verified: true,
    translations: {
      name: '케냐',
      localName: 'Kenya',
      greeting: 'Habari',
      culturalValue: '하람베 (함께 끌어당기기)',
      description: '숨 막히는 야생동물, 강인한 사람들, 하람베 정신의 땅.',
    },
  },
  {
    content_type: 'country', content_id: 'us', language: 'ko', verified: true,
    translations: {
      name: '미국',
      localName: 'United States',
      greeting: 'Hey there!',
      culturalValue: '스몰토크 (친근함)',
      description: '친근한 미소 하나로 누구의 하루든 밝힐 수 있는 문화의 용광로.',
    },
  },
  {
    content_type: 'country', content_id: 'ca', language: 'ko', verified: true,
    translations: {
      name: '캐나다',
      localName: 'Canada',
      greeting: 'Hello, eh!',
      culturalValue: '예의와 포용성',
      description: '친절, 다문화주의, 그리고 잘못이 없어도 미안하다고 말하는 것으로 전 세계에 알려진 나라.',
    },
  },
  {
    content_type: 'country', content_id: 'br', language: 'ko', verified: true,
    translations: {
      name: '브라질',
      localName: 'Brasil',
      greeting: 'Oi!',
      culturalValue: '아브라소 (따뜻한 포옹)',
      description: '삼바, 카니발, 그리고 팔을 활짝 벌려 삶과 서로를 껴안는 나라.',
    },
  },
  {
    content_type: 'country', content_id: 'mx', language: 'ko', verified: true,
    translations: {
      name: '멕시코',
      localName: 'México',
      greeting: '¡Hola!',
      culturalValue: '파밀리아 (가족)',
      description: '가족이 모든 것이고 모든 식사가 축제인 활기찬 문화.',
    },
  },
  {
    content_type: 'country', content_id: 'au', language: 'ko', verified: true,
    translations: {
      name: '호주',
      localName: 'Australia',
      greeting: "G'day",
      culturalValue: '메이트십',
      description: '메이트십과 공정한 기회가 국민 정신을 정의하는 저 아래 대륙의 나라.',
    },
  },
];

// =============================================================================
// Quest Translations (ko)
//
// Format varies by quest type:
//   cultural_scenario: { title, quest_data: { type, culturalValue, situation, options: { left: { text }, right: { text } }, explanation } }
//   trivia_quiz:       { title, quest_data: { type, question, choices[], correctIndex, explanation } }
//   cultural_practice: { title, quest_data: { type, instruction, steps[], tapsRequired, completionMessage } }
//   history_lesson:    { title, quest_data: { type, story, question, choices[], correctIndex, funFact } }
//
// NOTE: correctIndex, tapsRequired, and isKind are NOT translated (keep original values).
//
// TODO: Add Korean quest translations here. The translations array should follow
// the same structure as countryTranslations above but with quest_data JSONB.
// =============================================================================

const questTranslations: Array<{
  content_type: string;
  content_id: string;
  language: string;
  translations: Record<string, unknown>;
  verified: boolean;
}> = [
  // Quest translations will be generated externally and inserted here.
  // Example:
  // {
  //   content_type: 'quest', content_id: 'kr-q1', language: 'ko', verified: true,
  //   translations: {
  //     title: '정(情)의 정신',
  //     quest_data: {
  //       type: 'cultural_scenario',
  //       culturalValue: '정(情)',
  //       situation: '서울의 가파른 언덕을...',
  //       options: {
  //         left: { text: '따뜻하게 다가가...', isKind: true },
  //         right: { text: '빠르게 지나갑니다...', isKind: false },
  //       },
  //       explanation: '한국 문화에서 정(情)은...',
  //     },
  //   },
  // },
];

// =============================================================================
// Seed Functions
// =============================================================================

async function seedRegionTranslations(): Promise<number> {
  console.log('\n📍 Seeding region translations (ko)...');

  const { error } = await supabase
    .from('content_translations')
    .upsert(regionTranslations, { onConflict: 'content_type,content_id,language' });

  if (error) {
    console.error('  ❌ Region translations failed:', error.message);
    throw error;
  }

  console.log(`  ✅ ${regionTranslations.length} region translations seeded`);
  return regionTranslations.length;
}

async function seedCountryTranslations(): Promise<number> {
  console.log('\n🌍 Seeding country translations (ko)...');

  const { error } = await supabase
    .from('content_translations')
    .upsert(countryTranslations, { onConflict: 'content_type,content_id,language' });

  if (error) {
    console.error('  ❌ Country translations failed:', error.message);
    throw error;
  }

  console.log(`  ✅ ${countryTranslations.length} country translations seeded`);
  return countryTranslations.length;
}

async function seedQuestTranslations(): Promise<number> {
  console.log('\n🎯 Seeding quest translations (ko)...');

  if (questTranslations.length === 0) {
    console.log('  ⏭️  No quest translations to seed (add translations to questTranslations array)');
    return 0;
  }

  // Upsert in batches of 20 to avoid payload limits
  const BATCH_SIZE = 20;
  let total = 0;

  for (let i = 0; i < questTranslations.length; i += BATCH_SIZE) {
    const batch = questTranslations.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('content_translations')
      .upsert(batch, { onConflict: 'content_type,content_id,language' });

    if (error) {
      console.error(`  ❌ Quest batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
      throw error;
    }

    total += batch.length;
  }

  console.log(`  ✅ ${total} quest translations seeded`);
  return total;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log('🚀 AlmaNEO Korean Translation Seed Script');
  console.log('==========================================');
  console.log(`Supabase URL: ${SUPABASE_URL}`);

  try {
    const regionCount = await seedRegionTranslations();
    const countryCount = await seedCountryTranslations();
    const questCount = await seedQuestTranslations();

    const total = regionCount + countryCount + questCount;

    console.log('\n==========================================');
    console.log('✅ Korean translations seeded successfully!');
    console.log(`  - ${regionCount} region translations`);
    console.log(`  - ${countryCount} country translations`);
    console.log(`  - ${questCount} quest translations`);
    console.log(`  - ${total} total translations (ko)`);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();

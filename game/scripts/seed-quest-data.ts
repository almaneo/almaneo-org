/**
 * Seed Script: Migrate hardcoded quest data to Supabase
 *
 * Usage: npx tsx game/scripts/seed-quest-data.ts
 *
 * Reads existing TypeScript data files and inserts into:
 * - regions table
 * - countries table
 * - quests table
 * - content_translations table (language='en')
 */

import { createClient } from '@supabase/supabase-js';
import { REGIONS } from '../lib/worldTravel/regions';
import { ALL_COUNTRIES } from '../lib/worldTravel/countries';

// --- Supabase Config ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://euchaicondbmdkomnilr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_KEY environment variable is required.');
  console.error('Usage: SUPABASE_SERVICE_KEY=your_key npx tsx game/scripts/seed-quest-data.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- Seed Functions ---

async function seedRegions() {
  console.log('\n📍 Seeding regions...');

  const regionRows = REGIONS.map((r, idx) => ({
    id: r.id,
    emoji: r.emoji,
    color: r.color,
    unlock_requirement: r.unlockRequirement,
    sort_order: idx,
    is_active: true,
  }));

  const { error } = await supabase
    .from('regions')
    .upsert(regionRows, { onConflict: 'id' });

  if (error) {
    console.error('  ❌ Region seed failed:', error.message);
    throw error;
  }

  console.log(`  ✅ ${regionRows.length} regions seeded`);

  // Seed English translations for regions
  const regionTranslations = REGIONS.map(r => ({
    content_type: 'region',
    content_id: r.id,
    language: 'en',
    translations: { name: r.name },
    verified: true,
  }));

  const { error: transError } = await supabase
    .from('content_translations')
    .upsert(regionTranslations, {
      onConflict: 'content_type,content_id,language',
    });

  if (transError) {
    console.error('  ❌ Region translations failed:', transError.message);
    throw transError;
  }

  console.log(`  ✅ ${regionTranslations.length} region translations (en) seeded`);
}

async function seedCountries() {
  console.log('\n🌍 Seeding countries...');

  const countryRows = ALL_COUNTRIES.map((c, idx) => ({
    id: c.id,
    region_id: c.region,
    flag: c.flag,
    sort_order: idx,
    is_active: true,
  }));

  const { error } = await supabase
    .from('countries')
    .upsert(countryRows, { onConflict: 'id' });

  if (error) {
    console.error('  ❌ Country seed failed:', error.message);
    throw error;
  }

  console.log(`  ✅ ${countryRows.length} countries seeded`);

  // Seed English translations for countries
  const countryTranslations = ALL_COUNTRIES.map(c => ({
    content_type: 'country',
    content_id: c.id,
    language: 'en',
    translations: {
      name: c.name,
      localName: c.localName,
      greeting: c.greeting,
      culturalValue: c.culturalValue,
      description: c.description,
    },
    verified: true,
  }));

  const { error: transError } = await supabase
    .from('content_translations')
    .upsert(countryTranslations, {
      onConflict: 'content_type,content_id,language',
    });

  if (transError) {
    console.error('  ❌ Country translations failed:', transError.message);
    throw transError;
  }

  console.log(`  ✅ ${countryTranslations.length} country translations (en) seeded`);
}

async function seedQuests() {
  console.log('\n🎯 Seeding quests...');

  let totalQuests = 0;

  for (const country of ALL_COUNTRIES) {
    const questRows = country.quests.map((q, idx) => ({
      id: q.id,
      country_id: q.countryId,
      type: q.type,
      difficulty: q.difficulty,
      points: q.points,
      quest_data: q.data,
      sort_order: idx,
      is_active: true,
      version: 1,
    }));

    const { error } = await supabase
      .from('quests')
      .upsert(questRows, { onConflict: 'id' });

    if (error) {
      console.error(`  ❌ Quest seed failed for ${country.id}:`, error.message);
      throw error;
    }

    // Seed English translations for quests
    const questTranslations = country.quests.map(q => ({
      content_type: 'quest',
      content_id: q.id,
      language: 'en',
      translations: {
        title: q.title,
        quest_data: q.data,
      },
      verified: true,
    }));

    const { error: transError } = await supabase
      .from('content_translations')
      .upsert(questTranslations, {
        onConflict: 'content_type,content_id,language',
      });

    if (transError) {
      console.error(`  ❌ Quest translations failed for ${country.id}:`, transError.message);
      throw transError;
    }

    totalQuests += country.quests.length;
    console.log(`  ✅ ${country.name} (${country.id}): ${country.quests.length} quests`);
  }

  console.log(`  ✅ Total: ${totalQuests} quests seeded with translations`);
}

// --- Main ---

async function main() {
  console.log('🚀 AlmaNEO Quest Data Seed Script');
  console.log('==================================');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Countries: ${ALL_COUNTRIES.length}`);
  console.log(`Regions: ${REGIONS.length}`);

  const totalQuests = ALL_COUNTRIES.reduce((sum, c) => sum + c.quests.length, 0);
  console.log(`Total Quests: ${totalQuests}`);

  try {
    await seedRegions();
    await seedCountries();
    await seedQuests();

    console.log('\n==================================');
    console.log('✅ All data seeded successfully!');
    console.log(`  - ${REGIONS.length} regions`);
    console.log(`  - ${ALL_COUNTRIES.length} countries`);
    console.log(`  - ${totalQuests} quests`);
    console.log(`  - ${REGIONS.length + ALL_COUNTRIES.length + totalQuests} translations (en)`);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();

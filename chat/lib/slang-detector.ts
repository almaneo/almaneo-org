/**
 * AlmaChat Slang Detector
 *
 * Hybrid approach:
 * 1. Rule-based pattern matching (fast, no API call)
 * 2. Supabase slang dictionary lookup
 * 3. AI-based detection for unknown slang (future)
 *
 * When slang is detected, the translator upgrades to Claude Haiku
 * for better nuance and cultural expression handling.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface SlangEntry {
  term: string;
  lang: string;
  meaning: string;
  category: 'slang' | 'trend' | 'culture' | 'abbreviation';
  equivalent?: Record<string, string>; // { "en": "lol", "ja": "笑" }
}

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return null;
    supabase = createClient(url, key);
  }
  return supabase;
}

// ── Rule-based Slang Patterns ──
// Common internet slang / abbreviated expressions by language

const SLANG_PATTERNS: Record<string, RegExp[]> = {
  ko: [
    /ㅋ{2,}/, // ㅋㅋㅋ (laughter)
    /ㅎ{2,}/, // ㅎㅎㅎ (laughter)
    /ㅠ{2,}/, // ㅠㅠ (crying)
    /ㅜ{2,}/, // ㅜㅜ (crying)
    /ㄱㅅ/, // 감사 (thanks)
    /ㄴㄴ/, // 노노 (no no)
    /ㄹㅇ/, // 리얼 (real)
    /ㄷㄷ/, // 덜덜 (shaking)
    /ㅇㅇ/, // 응응 (yes)
    /ㅈㅂ/, // 존버 (hold)
    /ㅇㅋ/, // 오키 (ok)
    /갑분싸/, // 갑자기 분위기 싸해짐
    /꿀잼/, // 재미있다
    /노잼/, // 재미없다
    /TMI/, // too much information
    /JMT/, // 존맛탱
    /인싸/, /아싸/, // insider/outsider
    /존잘/, /존예/, // 존나 잘생김 / 존나 예쁨
    /혼코노/, // 혼자 코인 노래방
    /갑통알/, // 갑자기 통장을 알려주다
  ],
  en: [
    /\bbruh\b/i,
    /\bfr\b/i, // for real
    /\bno\s?cap\b/i,
    /\bslay(ed|ing)?\b/i,
    /\bbussin\b/i,
    /\bbet\b/i, // agreement
    /\bvibes?\b/i,
    /\bsus\b/i, // suspicious
    /\bgoat\b/i, // greatest of all time
    /\bimo\b/i, // in my opinion
    /\bsmh\b/i, // shaking my head
    /\btbh\b/i, // to be honest
    /\bfomo\b/i, // fear of missing out
    /\byeet\b/i,
    /\bdeadass\b/i,
    /\bsheesh\b/i,
    /\bw\b/i, // win (single letter, context-dependent)
    /\bL\b/, // loss
  ],
  ja: [
    /[wｗ]{2,}/, // www (laughter)
    /草/, // kusa (laughter)
    /ワロタ/, // warota (laughed)
    /おk/i, // ok
    /マジ/, // maji (really)
    /ヤバい|やばい/, // yabai (crazy/awesome)
    /エモい/, // emoi (emotional)
    /ぴえん/, // pien (sad)
    /推し/, // oshi (favorite person)
    /それな/, // sorena (exactly)
  ],
  zh: [
    /666+/, // liùliùliù (awesome)
    /233+/, // hahaha
    /yyds/i, // 永远的神 (GOAT)
    /绝绝子/, // absolutely
    /内卷/, // involution (rat race)
    /摆烂/, // giving up
    /xswl/i, // 笑死我了
    /awsl/i, // 啊我死了
    /emo/i, // emotional
  ],
  es: [
    /\bjaja+\b/i, // haha
    /\bwey\b/i, // dude (Mexico)
    /\bneta\b/i, // really (Mexico)
    /\btío\b/i, // dude (Spain)
    /\bmola\b/i, // cool (Spain)
    /\bguay\b/i, // cool
  ],
  vi: [
    /\bvl\b/i, // vãi lol
    /\bclgt\b/i, // cái lày gì thế
    /\bvkl\b/i, // vui kinh luôn
  ],
  th: [
    /555+/, // hahaha (ha ha ha in Thai)
    /\bมาก{2,}/, // very very
    /จ้า{2,}/, // yeah yeah
  ],
};

/**
 * Detect slang using rule-based patterns (fast, no API call)
 */
export function detectSlangByRules(text: string, lang: string): boolean {
  const patterns = SLANG_PATTERNS[lang];
  if (!patterns) return false;
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * Look up slang entries from Supabase dictionary
 */
export async function lookupSlangEntries(
  text: string,
  lang: string,
): Promise<SlangEntry[]> {
  const db = getSupabase();
  if (!db) return [];

  try {
    // Simple word-based lookup
    const words = text
      .toLowerCase()
      .split(/[\s,!?.]+/)
      .filter((w) => w.length > 1);

    if (words.length === 0) return [];

    const { data, error } = await db
      .from('slang_dictionary')
      .select('term, lang, meaning, category, equivalent')
      .eq('lang', lang)
      .in('term', words);

    if (error) {
      console.error('[SlangDetector] DB lookup error:', error.message);
      return [];
    }

    return (data || []) as SlangEntry[];
  } catch (err) {
    console.error('[SlangDetector] Error:', err);
    return [];
  }
}

/**
 * Main slang detection function
 * Returns true if slang is detected (triggers model upgrade)
 */
export async function detectSlang(text: string, lang: string): Promise<boolean> {
  // 1. Fast rule-based check
  if (detectSlangByRules(text, lang)) {
    return true;
  }

  // 2. Dictionary lookup (if DB available)
  const entries = await lookupSlangEntries(text, lang);
  return entries.length > 0;
}

/**
 * Get slang entries for a message (for translator context)
 */
export async function getSlangContext(
  text: string,
  lang: string,
): Promise<SlangEntry[]> {
  return lookupSlangEntries(text, lang);
}

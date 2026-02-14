/**
 * AlmaChat Language Detection
 *
 * Uses franc-min for lightweight language detection.
 * Falls back to heuristic detection for very short messages.
 */

import { franc } from 'franc-min';

// Unicode range-based quick detection for short text
const SCRIPT_RANGES: Array<{ lang: string; test: RegExp }> = [
  { lang: 'ko', test: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/ }, // Hangul
  { lang: 'ja', test: /[\u3040-\u309F\u30A0-\u30FF]/ }, // Hiragana/Katakana
  { lang: 'zh', test: /[\u4E00-\u9FFF]/ }, // CJK Unified (also matches some Japanese/Korean)
  { lang: 'th', test: /[\u0E00-\u0E7F]/ }, // Thai
  { lang: 'ar', test: /[\u0600-\u06FF\u0750-\u077F]/ }, // Arabic
  { lang: 'km', test: /[\u1780-\u17FF]/ }, // Khmer
  { lang: 'vi', test: /[ăâêôơưđĂÂÊÔƠƯĐ]/ }, // Vietnamese diacritics
  { lang: 'hi', test: /[\u0900-\u097F]/ }, // Devanagari (Hindi)
  { lang: 'bn', test: /[\u0980-\u09FF]/ }, // Bengali
];

// ISO 639-3 to ISO 639-1 mapping (franc uses ISO 639-3)
const ISO3_TO_ISO1: Record<string, string> = {
  kor: 'ko', eng: 'en', zho: 'zh', cmn: 'zh', jpn: 'ja',
  spa: 'es', fra: 'fr', arb: 'ar', ara: 'ar', por: 'pt',
  ind: 'id', msa: 'ms', tha: 'th', vie: 'vi', khm: 'km',
  swa: 'sw', hin: 'hi', ben: 'bn', deu: 'de', ita: 'it',
  rus: 'ru', tur: 'tr', nld: 'nl', pol: 'pl', ukr: 'uk',
};

/**
 * Detect the language of a text message
 * Returns ISO 639-1 code (e.g., 'ko', 'en', 'ja')
 */
export function detectLanguage(text: string): string {
  const trimmed = text.trim();

  // Very short text: use script-based detection
  if (trimmed.length < 10) {
    for (const { lang, test } of SCRIPT_RANGES) {
      if (test.test(trimmed)) return lang;
    }
    // Default to English for very short Latin-script text
    return 'en';
  }

  // Use franc for longer text
  const detected = franc(trimmed, { minLength: 3 });

  if (detected === 'und') {
    // Undetermined — try script-based fallback
    for (const { lang, test } of SCRIPT_RANGES) {
      if (test.test(trimmed)) return lang;
    }
    return 'en'; // Default
  }

  // Convert ISO 639-3 to ISO 639-1
  return ISO3_TO_ISO1[detected] || detected.substring(0, 2);
}

/**
 * Supported languages for translation
 */
export const SUPPORTED_LANGUAGES = [
  'ko', 'en', 'zh', 'ja', 'es', 'fr', 'ar', 'pt',
  'id', 'ms', 'th', 'vi', 'km', 'sw', 'hi', 'bn',
  'de', 'it', 'ru', 'tr',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

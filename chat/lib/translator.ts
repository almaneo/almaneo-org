/**
 * AlmaChat AI Translation Engine
 *
 * Translates chat messages using Vercel AI Gateway.
 * - Default: Gemini Flash Lite (~200ms, low cost)
 * - Slang detected: Groq Llama 3.3 70B (~300ms, better nuance)
 *
 * Supports Gateway mode (BYOK) and Direct provider mode.
 */

import { generateText, gateway } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { checkCache, saveCache } from './cache.js';
import { detectSlang, type SlangEntry } from './slang-detector.js';

// ── Gateway Detection ──
const GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY;
const USE_GATEWAY = !!GATEWAY_API_KEY;

// ── Direct Providers (fallback) ──
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// ── Model Selection ──
const MODELS = {
  default: USE_GATEWAY ? 'google/gemini-2.5-flash-lite' : 'gemini-2.5-flash-lite',
  slang: USE_GATEWAY ? 'groq/llama-3.3-70b-versatile' : 'llama-3.3-70b-versatile',
  fast: USE_GATEWAY ? 'groq/llama-3.3-70b-versatile' : 'llama-3.3-70b-versatile',
} as const;

// ── Language Names (for prompt context) ──
const LANGUAGE_NAMES: Record<string, string> = {
  ko: 'Korean', en: 'English', zh: 'Chinese', ja: 'Japanese',
  es: 'Spanish', fr: 'French', ar: 'Arabic', pt: 'Portuguese',
  id: 'Indonesian', ms: 'Malay', th: 'Thai', vi: 'Vietnamese',
  km: 'Khmer', sw: 'Swahili', hi: 'Hindi', bn: 'Bengali',
  de: 'German', it: 'Italian', ru: 'Russian', tr: 'Turkish',
};

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || code;
}

/**
 * Build the translation prompt
 */
function buildTranslationPrompt(
  text: string,
  sourceLang: string,
  targetLang: string,
  slangEntries?: SlangEntry[],
): string {
  const slangContext = slangEntries?.length
    ? `\nSlang Dictionary (use these for accurate translation):\n${slangEntries
        .map((s) => `- "${s.term}" (${getLanguageName(s.lang)}) = ${s.meaning}`)
        .join('\n')}`
    : '';

  return `You are AlmaChat's real-time translation engine.
Translate this chat message from ${getLanguageName(sourceLang)} to ${getLanguageName(targetLang)}.

Rules:
1. Preserve TONE and EMOTION, not just words
2. Translate slang to equivalent cultural expressions in the target language
3. Keep emojis, URLs, @mentions, and proper nouns as-is
4. Be concise — chat messages should feel natural, not formal
5. Output ONLY the translated text, nothing else (no quotes, no explanation)
${slangContext}

Message: "${text}"`;
}

/**
 * Get an AI model instance based on model ID
 */
function getModel(modelId: string) {
  if (USE_GATEWAY) {
    return gateway(modelId);
  }
  // Direct mode
  if (modelId.startsWith('gemini') || modelId.startsWith('google/')) {
    return google('gemini-2.5-flash-lite');
  }
  if (modelId.includes('llama') || modelId.startsWith('groq/')) {
    return groq('llama-3.3-70b-versatile');
  }
  // Default fallback
  return google('gemini-2.5-flash-lite');
}

/**
 * Messages that should skip translation
 */
const SKIP_PATTERNS = [
  /^[\s]*$/, // empty/whitespace only
  /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u, // emoji only
  /^https?:\/\/\S+$/, // URL only
  /^[.!?…]+$/, // punctuation only
  /^(ok|yes|no|lol|haha|wow|omg|brb|afk|gg|thx|ty|np)$/i, // universal expressions
];

/**
 * Check if a message should be skipped
 */
export function shouldSkipTranslation(text: string): boolean {
  if (text.length <= 2) return true;
  return SKIP_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Translate a single message
 */
export async function translateMessage(
  text: string,
  sourceLang: string,
  targetLang: string,
  slangEntries?: SlangEntry[],
): Promise<{ text: string; model: string; cached: boolean }> {
  // Skip trivial messages
  if (shouldSkipTranslation(text)) {
    return { text, model: 'skip', cached: false };
  }

  // Same language
  if (sourceLang === targetLang) {
    return { text, model: 'same', cached: false };
  }

  // Check cache
  const cached = await checkCache(text, sourceLang, targetLang);
  if (cached) {
    return { text: cached, model: 'cache', cached: true };
  }

  // Detect slang
  const hasSlang = slangEntries
    ? slangEntries.length > 0
    : await detectSlang(text, sourceLang);

  // Select model
  const modelId = hasSlang ? MODELS.slang : MODELS.default;

  // Build BYOK config for Gateway
  const byok: Record<string, Array<{ apiKey: string }>> = {};
  if (USE_GATEWAY) {
    if (process.env.GEMINI_API_KEY) {
      byok.google = [{ apiKey: process.env.GEMINI_API_KEY }];
    }
    if (process.env.GROQ_API_KEY) {
      byok.groq = [{ apiKey: process.env.GROQ_API_KEY }];
    }
    // Anthropic BYOK - enable when API key is available
    // if (process.env.ANTHROPIC_API_KEY) {
    //   byok.anthropic = [{ apiKey: process.env.ANTHROPIC_API_KEY }];
    // }
  }

  // Translate
  const { text: translated } = await generateText({
    model: getModel(modelId),
    prompt: buildTranslationPrompt(text, sourceLang, targetLang, slangEntries),
    maxOutputTokens: 500,
    temperature: 0.3,
    ...(USE_GATEWAY && Object.keys(byok).length > 0
      ? { providerOptions: { gateway: { byok, tags: ['almachat-translate'] } } }
      : {}),
  });

  // Clean up — remove surrounding quotes if AI added them
  const cleaned = translated.replace(/^["'"'「」『』]|["'"'「」『』]$/g, '').trim();

  // Save to cache (fire and forget)
  saveCache(text, sourceLang, targetLang, cleaned, modelId).catch((err) =>
    console.error('[Translator] Cache save error:', err),
  );

  return { text: cleaned, model: modelId, cached: false };
}

/**
 * Translate a message to multiple languages in parallel
 */
export async function translateParallel(
  text: string,
  sourceLang: string,
  targetLangs: string[],
  slangEntries?: SlangEntry[],
): Promise<Record<string, string>> {
  if (shouldSkipTranslation(text)) {
    // Return original text for all target languages
    const result: Record<string, string> = {};
    for (const lang of targetLangs) {
      result[lang] = text;
    }
    return result;
  }

  const filteredLangs = targetLangs.filter((lang) => lang !== sourceLang);

  const results = await Promise.allSettled(
    filteredLangs.map((lang) => translateMessage(text, sourceLang, lang, slangEntries)),
  );

  const translations: Record<string, string> = {};
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      translations[filteredLangs[i]] = result.value.text;
    } else {
      console.error(`[Translator] Failed for ${filteredLangs[i]}:`, result.reason);
    }
  });

  return translations;
}

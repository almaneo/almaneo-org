/**
 * Direct Translation API
 *
 * POST /api/translate
 * Request: { text, sourceLang?, targetLangs }
 * Response: { translations, sourceLang, model, cached }
 *
 * Can be used independently (without Stream Chat)
 * for testing or direct API integration.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { translateMessage, translateParallel } from '../lib/translator.js';
import { detectLanguage } from '../lib/language.js';
import { getSlangContext } from '../lib/slang-detector.js';

export const config = {
  maxDuration: 30,
};

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, sourceLang, targetLangs } = req.body as {
      text: string;
      sourceLang?: string;
      targetLangs: string | string[];
    };

    if (!text || !targetLangs) {
      return res.status(400).json({ error: 'text and targetLangs are required' });
    }

    // Detect source language if not provided
    const detectedLang = sourceLang || detectLanguage(text);

    // Normalize targetLangs to array
    const langs = Array.isArray(targetLangs) ? targetLangs : [targetLangs];

    // Get slang context
    const slangEntries = await getSlangContext(text, detectedLang);

    const startTime = Date.now();

    if (langs.length === 1) {
      // Single language translation
      const result = await translateMessage(text, detectedLang, langs[0], slangEntries);

      return res.status(200).json({
        translations: { [langs[0]]: result.text },
        sourceLang: detectedLang,
        model: result.model,
        cached: result.cached,
        slangDetected: slangEntries.length > 0,
        latencyMs: Date.now() - startTime,
      });
    }

    // Multi-language parallel translation
    const translations = await translateParallel(text, detectedLang, langs, slangEntries);

    return res.status(200).json({
      translations,
      sourceLang: detectedLang,
      targetLangs: langs,
      slangDetected: slangEntries.length > 0,
      latencyMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error('[Translate API] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

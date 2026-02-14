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

import { translateMessage, translateParallel } from '../lib/translator.js';
import { detectLanguage } from '../lib/language.js';
import { getSlangContext } from '../lib/slang-detector.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { text, sourceLang, targetLangs } = body as {
      text: string;
      sourceLang?: string;
      targetLangs: string | string[];
    };

    if (!text || !targetLangs) {
      return new Response(
        JSON.stringify({ error: 'text and targetLangs are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
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

      return new Response(
        JSON.stringify({
          translations: { [langs[0]]: result.text },
          sourceLang: detectedLang,
          model: result.model,
          cached: result.cached,
          slangDetected: slangEntries.length > 0,
          latencyMs: Date.now() - startTime,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Multi-language parallel translation
    const translations = await translateParallel(text, detectedLang, langs, slangEntries);

    return new Response(
      JSON.stringify({
        translations,
        sourceLang: detectedLang,
        targetLangs: langs,
        slangDetected: slangEntries.length > 0,
        latencyMs: Date.now() - startTime,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('[Translate API] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

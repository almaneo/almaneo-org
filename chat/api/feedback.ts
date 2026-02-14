/**
 * Translation Feedback API
 *
 * POST /api/feedback
 * Request: { userAddress, sourceLang, targetLang, originalText, machineTranslation, suggestedTranslation?, feedbackType }
 *
 * Collects user feedback on translation quality:
 * - 'good': Translation is accurate
 * - 'bad': Translation is poor
 * - 'correction': User provides a better translation
 *
 * Corrections can be used to improve the slang dictionary
 * and fine-tune translation prompts.
 */

import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

interface FeedbackRequest {
  userAddress: string;
  sourceLang: string;
  targetLang: string;
  originalText: string;
  machineTranslation: string;
  suggestedTranslation?: string;
  feedbackType: 'good' | 'bad' | 'correction';
}

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
    const body = (await request.json()) as FeedbackRequest;
    const {
      userAddress,
      sourceLang,
      targetLang,
      originalText,
      machineTranslation,
      suggestedTranslation,
      feedbackType,
    } = body;

    // Validate
    if (!userAddress || !sourceLang || !targetLang || !originalText || !machineTranslation || !feedbackType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    if (!['good', 'bad', 'correction'].includes(feedbackType)) {
      return new Response(
        JSON.stringify({ error: 'feedbackType must be good, bad, or correction' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    if (feedbackType === 'correction' && !suggestedTranslation) {
      return new Response(
        JSON.stringify({ error: 'suggestedTranslation is required for correction feedback' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Save to Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('translation_feedback').insert({
      user_address: userAddress,
      source_lang: sourceLang,
      target_lang: targetLang,
      original_text: originalText,
      machine_translation: machineTranslation,
      suggested_translation: suggestedTranslation || null,
      feedback_type: feedbackType,
    });

    if (error) {
      console.error('[Feedback] DB error:', error.message);
      return new Response(JSON.stringify({ error: 'Failed to save feedback' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If it's a correction, potentially update the cache with the better translation
    if (feedbackType === 'correction' && suggestedTranslation) {
      // TODO: Consider updating cache or adding to slang dictionary
      console.log(
        `[Feedback] Correction received: ${sourceLang}→${targetLang}, "${originalText}" → "${suggestedTranslation}"`,
      );
    }

    return new Response(
      JSON.stringify({ status: 'saved', feedbackType }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('[Feedback] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

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
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export const config = {
  maxDuration: 10,
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
    const {
      userAddress,
      sourceLang,
      targetLang,
      originalText,
      machineTranslation,
      suggestedTranslation,
      feedbackType,
    } = req.body as FeedbackRequest;

    // Validate
    if (!userAddress || !sourceLang || !targetLang || !originalText || !machineTranslation || !feedbackType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['good', 'bad', 'correction'].includes(feedbackType)) {
      return res.status(400).json({ error: 'feedbackType must be good, bad, or correction' });
    }

    if (feedbackType === 'correction' && !suggestedTranslation) {
      return res.status(400).json({ error: 'suggestedTranslation is required for correction feedback' });
    }

    // Save to Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Database not configured' });
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
      return res.status(500).json({ error: 'Failed to save feedback' });
    }

    // If it's a correction, log for future processing
    if (feedbackType === 'correction' && suggestedTranslation) {
      console.log(
        `[Feedback] Correction received: ${sourceLang}→${targetLang}, "${originalText}" → "${suggestedTranslation}"`,
      );
    }

    return res.status(200).json({ status: 'saved', feedbackType });
  } catch (error) {
    console.error('[Feedback] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

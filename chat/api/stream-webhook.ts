/**
 * Stream Chat Webhook Handler
 *
 * POST /api/stream-webhook
 *
 * Receives Stream Chat events and triggers translation.
 * Events handled:
 * - message.new: Translate new message to all active languages
 *
 * The webhook URL must be configured in Stream Chat dashboard:
 * https://dashboard.getstream.io → Chat → Webhooks
 */

import { translateParallel } from '../lib/translator.js';
import { detectLanguage } from '../lib/language.js';
import { getSlangContext } from '../lib/slang-detector.js';
import {
  isStreamConfigured,
  getChannelActiveLanguages,
  updateMessageTranslations,
} from '../lib/stream-client.js';

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

interface StreamWebhookEvent {
  type: string;
  message?: {
    id: string;
    text?: string;
    user?: {
      id: string;
      preferred_language?: string;
    };
  };
  channel?: {
    id: string;
    type: string;
  };
  cid?: string; // channel_type:channel_id
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Stream Chat is not configured yet — return OK to avoid errors
  if (!isStreamConfigured()) {
    console.log('[Webhook] Stream Chat not configured, skipping');
    return new Response(JSON.stringify({ status: 'skipped', reason: 'not_configured' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const event = (await request.json()) as StreamWebhookEvent;

    // Only handle new messages
    if (event.type !== 'message.new') {
      return new Response(JSON.stringify({ status: 'ignored', type: event.type }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { message, channel } = event;

    // Validate required fields
    if (!message?.text || !message?.id || !channel?.id) {
      return new Response(JSON.stringify({ status: 'skipped', reason: 'missing_fields' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const originalText = message.text;

    // Detect source language
    const sourceLang = detectLanguage(originalText);

    // Get active languages in the channel
    const channelType = channel.type || 'messaging';
    const activeLanguages = await getChannelActiveLanguages(channel.id, channelType);

    // Filter out source language
    const targetLangs = activeLanguages.filter((lang) => lang !== sourceLang);

    if (targetLangs.length === 0) {
      // All participants speak the same language
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'same_language', sourceLang }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Get slang context
    const slangEntries = await getSlangContext(originalText, sourceLang);
    const slangDetected = slangEntries.length > 0;

    // Translate in parallel
    const translations = await translateParallel(
      originalText,
      sourceLang,
      targetLangs,
      slangEntries,
    );

    // Determine model used
    const modelUsed = slangDetected ? 'claude-haiku' : 'gemini-flash-lite';

    // Update message metadata in Stream Chat
    await updateMessageTranslations(
      message.id,
      sourceLang,
      translations,
      modelUsed,
      slangDetected,
    );

    console.log(
      `[Webhook] Translated message ${message.id}: ${sourceLang} → ${targetLangs.join(',')}`,
    );

    return new Response(
      JSON.stringify({
        status: 'translated',
        messageId: message.id,
        sourceLang,
        targetLangs,
        slangDetected,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('[Webhook] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';

    // Return 200 to prevent Stream from retrying
    return new Response(JSON.stringify({ status: 'error', error: message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

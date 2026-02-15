/**
 * Test Translation Pipeline (temporary)
 *
 * POST /api/test-translate
 * Sends a test message in the channel and triggers translation.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isStreamConfigured } from '../lib/stream-client.js';
import { detectLanguage } from '../lib/language.js';
import { translateParallel } from '../lib/translator.js';
import { getSlangContext } from '../lib/slang-detector.js';

export const config = {
  maxDuration: 30,
};

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!isStreamConfigured()) {
    return res.status(503).json({ error: 'Stream Chat not configured' });
  }

  try {
    const {
      text = '안녕하세요! 번역 테스트입니다.',
      userId = 'guest_71509',
      channelId = 'alma-global',
    } = req.body as { text?: string; userId?: string; channelId?: string };

    const StreamChat = (await import('stream-chat')).StreamChat;
    const sc = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!,
    );

    // Step 1: Send a real message
    const channel = sc.channel('messaging', channelId);
    const msgResponse = await channel.sendMessage({
      text,
      user_id: userId,
    });

    const messageId = msgResponse.message.id;

    // Step 2: Detect language
    const sourceLang = detectLanguage(text);

    // Step 3: Get active languages
    const queryResponse = await channel.query({ members: { limit: 100 } });
    const languages = new Set<string>();
    for (const member of queryResponse.members || []) {
      const lang = (member.user?.preferred_language as string) || 'en';
      languages.add(lang);
    }
    const activeLanguages = Array.from(languages);
    const targetLangs = activeLanguages.filter((l) => l !== sourceLang);

    if (targetLangs.length === 0) {
      return res.status(200).json({
        status: 'no_translation_needed',
        messageId,
        sourceLang,
        activeLanguages,
      });
    }

    // Step 4: Translate
    const slangEntries = await getSlangContext(text, sourceLang);
    const translations = await translateParallel(text, sourceLang, targetLangs, slangEntries);

    // Step 5: Update message with translations
    await sc.partialUpdateMessage(
      messageId,
      {
        set: {
          original_lang: sourceLang,
          translations,
          translation_status: 'completed',
          translation_model: 'gemini-flash-lite',
          slang_detected: slangEntries.length > 0,
        },
      },
      userId,
    );

    return res.status(200).json({
      status: 'success',
      messageId,
      sourceLang,
      targetLangs,
      translations,
      activeLanguages,
    });
  } catch (error) {
    console.error('[TestTranslate] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

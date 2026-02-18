/**
 * Delete Channel API
 *
 * POST /api/delete-channel
 * Request: { channelId, channelType? }
 * Response: { success }
 *
 * Server-side channel deletion for meetup cleanup.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStreamClient, isStreamConfigured } from '../lib/stream-client.js';

export const config = {
  maxDuration: 10,
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

  if (!isStreamConfigured()) {
    return res.status(503).json({ error: 'Stream Chat not configured' });
  }

  try {
    const {
      channelId,
      channelType = 'messaging',
    } = req.body as {
      channelId: string;
      channelType?: string;
    };

    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }

    const sc = getStreamClient();
    const channel = sc.channel(channelType, channelId);
    await channel.delete();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[DeleteChannel] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

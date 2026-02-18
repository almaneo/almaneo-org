/**
 * Join Channel API
 *
 * POST /api/join-channel
 * Request: { userId, channelId?, channelType? }
 * Response: { success, channelId }
 *
 * Server-side channel join - adds user as a member to the channel.
 * This bypasses client-side permission restrictions for guest users.
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
      userId,
      channelId = 'alma-global',
      channelType = 'messaging',
    } = req.body as {
      userId: string;
      channelId?: string;
      channelType?: string;
    };

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const sc = getStreamClient();

    // Get existing channel without overwriting metadata
    const channel = sc.channel(channelType, channelId);

    // Ensure channel exists (no-op if already created)
    await channel.create();

    // Add user as member
    await channel.addMembers([userId]);

    return res.status(200).json({
      success: true,
      channelId,
    });
  } catch (error) {
    console.error('[JoinChannel] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

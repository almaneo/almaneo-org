/**
 * Leave Channel API
 *
 * POST /api/leave-channel
 * Request: { userId, channelId, channelType? }
 * Response: { success }
 *
 * Server-side channel leave - removes user from channel members.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isStreamConfigured } from '../lib/stream-client.js';

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
      channelId,
      channelType = 'messaging',
    } = req.body as {
      userId: string;
      channelId: string;
      channelType?: string;
    };

    if (!userId || !channelId) {
      return res.status(400).json({ error: 'userId and channelId are required' });
    }

    const StreamChat = (await import('stream-chat')).StreamChat;
    const sc = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!,
    );

    const channel = sc.channel(channelType, channelId);
    await channel.removeMembers([userId]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[LeaveChannel] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

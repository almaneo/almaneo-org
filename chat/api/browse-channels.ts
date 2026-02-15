/**
 * Browse Channels API
 *
 * GET /api/browse-channels?userId=xxx
 * Response: { channels: [{ id, name, description, memberCount, createdAt }] }
 *
 * Returns public messaging channels for browsing.
 * Indicates whether the requesting user is already a member.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isStreamConfigured } from '../lib/stream-client.js';

export const config = {
  maxDuration: 10,
};

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isStreamConfigured()) {
    return res.status(503).json({ error: 'Stream Chat not configured' });
  }

  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    const StreamChat = (await import('stream-chat')).StreamChat;
    const sc = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!,
    );

    // Query all messaging channels, sorted by last activity
    const result = await sc.queryChannels(
      { type: 'messaging' },
      { last_message_at: -1 },
      { limit: 50, state: true, member_count: true },
    );

    const channels = result.map((ch) => {
      const members = ch.state?.members
        ? Object.keys(ch.state.members)
        : [];

      return {
        id: ch.id,
        name: (ch.data?.name as string) || ch.id || 'Unnamed',
        description: (ch.data?.description as string) || '',
        memberCount: ch.data?.member_count ?? members.length,
        isMember: members.includes(userId),
        createdAt: ch.data?.created_at,
        lastMessageAt: ch.data?.last_message_at,
      };
    });

    return res.status(200).json({ channels });
  } catch (error) {
    console.error('[BrowseChannels] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

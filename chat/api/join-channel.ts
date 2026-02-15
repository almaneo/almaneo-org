/**
 * Join Channel API
 *
 * POST /api/join-channel
 * Request: { userId, channelId?, channelType? }
 * Response: { success, channelId, channelName }
 *
 * Server-side channel join - adds user as a member to the channel.
 * This bypasses client-side permission restrictions for guest users.
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

    // Dynamic import to avoid issues
    const StreamChat = (await import('stream-chat')).StreamChat;
    const sc = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!,
    );

    // 서버 사이드에서 채널 생성/가져오기 + 유저 추가
    const channel = sc.channel(channelType, channelId, {
      name: 'AlmaChat Global',
      description: 'Chat with kindness, across languages',
      created_by_id: 'admin',
    });

    // 채널이 없으면 생성, 있으면 가져오기
    await channel.create();

    // 유저를 멤버로 추가
    await channel.addMembers([userId]);

    return res.status(200).json({
      success: true,
      channelId,
      channelName: 'AlmaChat Global',
    });
  } catch (error) {
    console.error('[JoinChannel] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

/**
 * Create Channel API
 *
 * POST /api/create-channel
 * Request: { userId, name, description? }
 * Response: { success, channelId, channelName }
 *
 * Creates a new public messaging channel and adds the creator as member + admin.
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

/**
 * Generate a URL-safe channel ID from a name
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 40)
    .replace(/^-|-$/g, '');
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
    const { userId, name, description } = req.body as {
      userId: string;
      name: string;
      description?: string;
    };

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Channel name must be at least 2 characters' });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({ error: 'Channel name must be 50 characters or less' });
    }

    const trimmedName = name.trim();
    const trimmedDesc = description?.trim() || '';

    // Generate unique channel ID: slug + random suffix
    const slug = slugify(trimmedName) || 'channel';
    const suffix = Math.random().toString(36).substring(2, 7);
    const channelId = `${slug}-${suffix}`;

    const StreamChat = (await import('stream-chat')).StreamChat;
    const sc = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!,
    );

    // Create the channel with the creator as admin
    const channel = sc.channel('messaging', channelId, {
      name: trimmedName,
      description: trimmedDesc,
      created_by_id: userId,
      channel_type: 'community',
    });

    await channel.create();
    await channel.addMembers([userId]);

    return res.status(200).json({
      success: true,
      channelId,
      channelName: trimmedName,
    });
  } catch (error) {
    console.error('[CreateChannel] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

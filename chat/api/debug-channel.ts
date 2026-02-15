/**
 * Debug Channel API (temporary)
 *
 * GET /api/debug-channel?channelId=alma-global
 * Returns channel members and their preferred languages.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isStreamConfigured } from '../lib/stream-client.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!isStreamConfigured()) {
    return res.status(503).json({ error: 'Stream Chat not configured' });
  }

  try {
    const channelId = (req.query.channelId as string) || 'alma-global';
    const channelType = (req.query.channelType as string) || 'messaging';

    const StreamChat = (await import('stream-chat')).StreamChat;
    const sc = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!,
    );

    const channel = sc.channel(channelType, channelId);
    const response = await channel.query({ members: { limit: 100 } });

    const members = (response.members || []).map((m) => ({
      userId: m.user_id || m.user?.id,
      name: m.user?.name,
      preferred_language: m.user?.preferred_language || 'not_set',
      role: m.role,
      created_at: m.created_at,
    }));

    // Check webhook settings
    const appSettings = await sc.getAppSettings();
    const webhookUrl = appSettings.app?.webhook_url || 'not_configured';

    return res.status(200).json({
      channelId,
      channelType,
      memberCount: members.length,
      members,
      activeLanguages: [...new Set(members.map((m) => m.preferred_language))],
      webhookUrl,
    });
  } catch (error) {
    console.error('[DebugChannel] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

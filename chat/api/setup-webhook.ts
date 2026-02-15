/**
 * Setup Webhook API (admin only)
 *
 * POST /api/setup-webhook
 * Configures Stream Chat webhook URL programmatically.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isStreamConfigured } from '../lib/stream-client.js';

export const config = {
  maxDuration: 10,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isStreamConfigured()) {
    return res.status(503).json({ error: 'Stream Chat not configured' });
  }

  try {
    const StreamChat = (await import('stream-chat')).StreamChat;
    const sc = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!,
    );

    const webhookUrl = 'https://chat.almaneo.org/api/stream-webhook';

    await sc.updateAppSettings({
      webhook_url: webhookUrl,
    });

    // Verify
    const settings = await sc.getAppSettings();
    const configuredUrl = settings.app?.webhook_url;

    return res.status(200).json({
      success: true,
      webhookUrl: configuredUrl,
      message: 'Webhook configured successfully',
    });
  } catch (error) {
    console.error('[SetupWebhook] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

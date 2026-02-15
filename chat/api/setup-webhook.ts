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

    // Try v2 hook system first (event_hooks)
    try {
      await sc.updateAppSettings({
        event_hooks: [{
          url: webhookUrl,
          active: true,
          events: ['message.new'],
        }],
      } as Record<string, unknown>);
    } catch (v2Err) {
      // If v2 fails, try v1
      try {
        await sc.updateAppSettings({
          webhook_url: webhookUrl,
          webhook_events: { 'message.new': true },
        } as Record<string, unknown>);
      } catch (v1Err) {
        return res.status(500).json({
          error: 'Both v1 and v2 webhook config failed',
          v1Error: v1Err instanceof Error ? v1Err.message : String(v1Err),
          v2Error: v2Err instanceof Error ? v2Err.message : String(v2Err),
        });
      }
    }

    // Verify
    const settings = await sc.getAppSettings();
    const app = settings.app as Record<string, unknown> || {};

    return res.status(200).json({
      success: true,
      webhookUrl: app.webhook_url || 'check_v2',
      hooks: app.event_hooks || app.hooks || 'not_found',
      message: 'Webhook configured successfully',
    });
  } catch (error) {
    console.error('[SetupWebhook] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

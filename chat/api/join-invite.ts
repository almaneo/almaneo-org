/**
 * Join via Invite Code API
 *
 * POST /api/join-invite
 * Request: { userId, code }
 * Response: { success, channelId, channelType, channelName }
 *
 * Validates invite code, adds user to the channel via Stream Chat,
 * and increments the use count.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
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

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  try {
    const { userId, code } = req.body as {
      userId: string;
      code: string;
    };

    if (!userId || !code) {
      return res.status(400).json({ error: 'userId and code are required' });
    }

    const normalizedCode = code.trim().toUpperCase();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Look up invite code
    const { data: invite, error: lookupError } = await supabase
      .from('invite_links')
      .select('*')
      .eq('code', normalizedCode)
      .maybeSingle();

    if (lookupError) {
      console.error('[JoinInvite] Lookup error:', lookupError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!invite) {
      return res.status(404).json({ error: 'invalid_code', message: 'Invite code not found' });
    }

    // Check expiry
    if (new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({ error: 'expired_code', message: 'This invite code has expired' });
    }

    // Check max uses
    if (invite.max_uses > 0 && invite.use_count >= invite.max_uses) {
      return res.status(410).json({ error: 'max_uses_reached', message: 'This invite has reached its usage limit' });
    }

    // Add user to channel via Stream Chat
    const sc = getStreamClient();

    const channel = sc.channel(invite.channel_type, invite.channel_id);

    // Ensure channel exists
    await channel.create();

    // Add user as member
    await channel.addMembers([userId]);

    // Get channel name
    const channelState = await channel.query({});
    const channelName = (channelState.channel?.name as string) || invite.channel_id;

    // Increment use count
    await supabase
      .from('invite_links')
      .update({ use_count: invite.use_count + 1 })
      .eq('id', invite.id);

    return res.status(200).json({
      success: true,
      channelId: invite.channel_id,
      channelType: invite.channel_type,
      channelName,
    });
  } catch (error) {
    console.error('[JoinInvite] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

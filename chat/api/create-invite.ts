/**
 * Create Invite Link API
 *
 * POST /api/create-invite
 * Request: { userId, channelId, channelType? }
 * Response: { success, code, inviteUrl, expiresAt }
 *
 * Generates a 6-character invite code for a channel.
 * Code expires after 7 days. Stored in Supabase invite_links table.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export const config = {
  maxDuration: 10,
};

const INVITE_EXPIRY_DAYS = 7;
const CODE_LENGTH = 6;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1 to avoid confusion

function generateCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

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

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Supabase not configured' });
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

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if there's an existing valid invite for this channel by this user
    const now = new Date().toISOString();
    const { data: existing } = await supabase
      .from('invite_links')
      .select('code, expires_at')
      .eq('channel_id', channelId)
      .eq('created_by', userId)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Return existing valid invite
      return res.status(200).json({
        success: true,
        code: existing.code,
        inviteUrl: `https://chat.almaneo.org/invite/${existing.code}`,
        expiresAt: existing.expires_at,
        reused: true,
      });
    }

    // Generate unique code with retry
    let code = '';
    let attempts = 0;
    while (attempts < 5) {
      code = generateCode();
      const { data: dup } = await supabase
        .from('invite_links')
        .select('id')
        .eq('code', code)
        .maybeSingle();

      if (!dup) break;
      attempts++;
    }

    if (attempts >= 5) {
      return res.status(500).json({ error: 'Failed to generate unique code' });
    }

    // Set expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

    // Insert invite link
    const { error: insertError } = await supabase
      .from('invite_links')
      .insert({
        code,
        channel_id: channelId,
        channel_type: channelType,
        created_by: userId,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('[CreateInvite] Insert error:', insertError);
      return res.status(500).json({ error: 'Failed to create invite' });
    }

    return res.status(200).json({
      success: true,
      code,
      inviteUrl: `https://chat.almaneo.org/invite/${code}`,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('[CreateInvite] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

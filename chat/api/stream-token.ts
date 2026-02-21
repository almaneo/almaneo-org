/**
 * Stream Chat Token Generation API
 * Migrated to Asia Pacific (Singapore) cluster — 2026-02-18
 *
 * POST /api/stream-token
 * Request: { userId, name?, image?, preferredLanguage?, walletAddress? }
 * Response: { token, apiKey }
 *
 * Generates a user token for Stream Chat client connection.
 * Also upserts the user in Stream Chat with AlmaNEO metadata.
 * Also upserts the user in Supabase users table (for Admin panel & Kindness Protocol).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import {
  isStreamConfigured,
  generateUserToken,
  upsertStreamUser,
} from '../lib/stream-client.js';

export const config = {
  maxDuration: 30,
};

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Upsert user in Supabase users table.
 * This ensures AlmaChat users appear in the Admin panel and Kindness Protocol.
 */
async function upsertSupabaseUser(walletAddress: string, nickname?: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        wallet_address: walletAddress.toLowerCase(),
        nickname: nickname || 'AlmaChat User',
      },
      { onConflict: 'wallet_address', ignoreDuplicates: true }
    );

  if (error) {
    console.warn('[StreamToken] Supabase user upsert failed (non-fatal):', error.message);
  } else {
    console.log('[StreamToken] Supabase user upserted:', walletAddress.toLowerCase());
  }
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
    const { userId, name, image, preferredLanguage, walletAddress } = req.body as {
      userId: string;
      name?: string;
      image?: string;
      preferredLanguage?: string;
      walletAddress?: string;
    };

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Upsert user in Stream Chat (best-effort — token generation proceeds even if this fails)
    upsertStreamUser({
      id: userId,
      name,
      image,
      preferred_language: preferredLanguage || 'en',
      wallet_address: walletAddress,
    }).catch((err: unknown) => {
      console.warn('[StreamToken] upsertUser failed (non-fatal):', err);
    });

    // Upsert user in Supabase (best-effort — for Admin panel & Kindness Protocol)
    if (walletAddress) {
      upsertSupabaseUser(walletAddress, name).catch((err: unknown) => {
        console.warn('[StreamToken] Supabase upsert failed (non-fatal):', err);
      });
    }

    // Generate token (local JWT signing — does not require Stream API call)
    const token = generateUserToken(userId);

    return res.status(200).json({
      token,
      apiKey: process.env.STREAM_API_KEY,
    });
  } catch (error) {
    console.error('[StreamToken] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

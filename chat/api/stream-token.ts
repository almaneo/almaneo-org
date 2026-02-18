/**
 * Stream Chat Token Generation API
 *
 * POST /api/stream-token
 * Request: { userId, name?, image?, preferredLanguage?, walletAddress? }
 * Response: { token, apiKey }
 *
 * Generates a user token for Stream Chat client connection.
 * Also upserts the user in Stream Chat with AlmaNEO metadata.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
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

    // Upsert user in Stream Chat
    await upsertStreamUser({
      id: userId,
      name,
      image,
      preferred_language: preferredLanguage || 'en',
      wallet_address: walletAddress,
    });

    // Generate token
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

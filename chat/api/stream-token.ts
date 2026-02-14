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

import {
  isStreamConfigured,
  generateUserToken,
  upsertStreamUser,
} from '../lib/stream-client.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!isStreamConfigured()) {
    return new Response(
      JSON.stringify({ error: 'Stream Chat not configured' }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const body = await request.json();
    const { userId, name, image, preferredLanguage, walletAddress } = body as {
      userId: string;
      name?: string;
      image?: string;
      preferredLanguage?: string;
      walletAddress?: string;
    };

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    return new Response(
      JSON.stringify({
        token,
        apiKey: process.env.STREAM_API_KEY,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('[StreamToken] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

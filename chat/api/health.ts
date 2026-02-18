/**
 * Health Check API
 *
 * GET /api/health
 * Returns system status and configuration check.
 * Also tests actual Stream Chat API connectivity.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isStreamConfigured, getStreamClient } from '../lib/stream-client.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // Test Stream Chat connectivity with a real API call
  let streamConnected = false;
  let streamError = '';

  // First, test via raw HTTP (bypasses SDK) to rule out SDK issues
  let rawHttpStatus = 0;
  let rawHttpBody = '';
  const apiKey = process.env.STREAM_API_KEY || '';
  if (apiKey) {
    try {
      const baseUrl = process.env.STREAM_BASE_URL || 'https://chat.stream-io-api.com';
      const r = await fetch(`${baseUrl}/app?api_key=${apiKey}`);
      rawHttpStatus = r.status;
      rawHttpBody = await r.text();
    } catch (e) {
      rawHttpBody = e instanceof Error ? e.message : String(e);
    }
  }

  if (isStreamConfigured()) {
    try {
      const sc = getStreamClient();
      // Lightweight API call to verify key validity and regional endpoint
      await sc.getAppSettings();
      streamConnected = true;
    } catch (err) {
      streamError = err instanceof Error ? err.message : String(err);
    }
  }

  const status = {
    service: 'almachat-api',
    version: '1.1.1',
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      streamChat: !!(process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET),
      streamKeyPrefix: process.env.STREAM_API_KEY?.substring(0, 8) || 'not-set',
      streamBaseURL: process.env.STREAM_BASE_URL || 'https://chat.stream-io-api.com (default)',
      streamConnected,
      streamError: streamError || undefined,
      streamRawHttpStatus: rawHttpStatus || undefined,
      streamRawHttpBody: rawHttpBody ? rawHttpBody.substring(0, 200) : undefined,
      supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
      aiGateway: !!process.env.AI_GATEWAY_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
    },
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(status);
}

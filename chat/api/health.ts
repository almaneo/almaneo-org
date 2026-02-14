/**
 * Health Check API
 *
 * GET /api/health
 * Returns system status and configuration check.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const status = {
    service: 'almachat-api',
    version: '1.0.0',
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      streamChat: !!(process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET),
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

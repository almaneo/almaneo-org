/**
 * Health Check API
 *
 * GET /api/health
 * Returns system status and configuration check.
 */

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
};

export default async function handler(request: Request): Promise<Response> {
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

  return new Response(JSON.stringify(status, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

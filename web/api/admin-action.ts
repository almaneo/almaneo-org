/**
 * Admin Action API Proxy
 * Vercel Serverless Function that adds ADMIN_API_SECRET header
 * and forwards requests to partner-sbt or ambassador API
 *
 * POST /api/admin-action
 * Body: { target: 'partner-sbt' | 'ambassador', action: string, params: object }
 *
 * Security: ADMIN_API_SECRET is kept server-side, never exposed to frontend
 */

const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

interface AdminActionRequest {
  target: 'partner-sbt' | 'ambassador';
  action: string;
  params: Record<string, unknown>;
}

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405, corsHeaders);
  }

  if (!ADMIN_API_SECRET) {
    return jsonResponse({ success: false, error: 'Server configuration error: ADMIN_API_SECRET not set' }, 500, corsHeaders);
  }

  try {
    const body = (await request.json()) as AdminActionRequest;
    const { target, action, params } = body;

    if (!target || !action) {
      return jsonResponse({ success: false, error: 'Missing required fields: target, action' }, 400, corsHeaders);
    }

    if (target !== 'partner-sbt' && target !== 'ambassador') {
      return jsonResponse({ success: false, error: 'Invalid target. Must be "partner-sbt" or "ambassador"' }, 400, corsHeaders);
    }

    // Build internal API URL
    const baseUrl = getBaseUrl(request);
    const apiPath = target === 'partner-sbt' ? '/api/partner-sbt' : '/api/ambassador';
    const internalUrl = `${baseUrl}${apiPath}`;

    console.log(`[Admin Action] Proxying to ${apiPath}: action=${action}`);

    // Forward request with ADMIN_API_SECRET header
    const response = await fetch(internalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': ADMIN_API_SECRET,
      },
      body: JSON.stringify({ action, ...params }),
    });

    const data = await response.json();

    return jsonResponse(data, response.status, corsHeaders);
  } catch (error) {
    console.error('[Admin Action] Error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      500,
      corsHeaders
    );
  }
}

function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  headers: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

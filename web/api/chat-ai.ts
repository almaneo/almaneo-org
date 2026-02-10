/**
 * AI Hub Chat API — Vercel AI SDK + AI Gateway
 *
 * POST /api/chat-ai
 * Request: { messages, model? }
 * Response: Plain text stream (toTextStreamResponse)
 *
 * Mode Selection:
 * - AI_GATEWAY_API_KEY set → Gateway mode (any provider/model, caching, fallback, BYOK)
 * - AI_GATEWAY_API_KEY not set → Direct provider mode (Gemini + Groq only)
 *
 * Gateway Models (provider/model format):
 *   google/*, anthropic/*, openai/*, meta/*, deepseek/*, mistral/*, xai/*
 *
 * Direct Models (legacy):
 *   gemini-2.5-flash-lite, llama-3.3-70b-versatile
 */

import { streamText, gateway } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';

// ── Gateway Detection ──
const GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY;
const USE_GATEWAY = !!GATEWAY_API_KEY;

// ── Direct Provider (when gateway not configured) ──
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const DIRECT_MODEL_MAP: Record<string, () => ReturnType<typeof google> | ReturnType<typeof groq>> = {
  'gemini-2.5-flash-lite': () => google('gemini-2.5-flash-lite'),
  'llama-3.3-70b-versatile': () => groq('llama-3.3-70b-versatile'),
};

const DEFAULT_DIRECT_MODEL = 'gemini-2.5-flash-lite';
const DEFAULT_GATEWAY_MODEL = 'google/gemini-2.5-flash-lite';

const SYSTEM_PROMPT = `You are AlmaNEO AI Hub assistant, helping users with various tasks.
You are part of the AlmaNEO project that aims to democratize AI access globally.
Be helpful, concise, and friendly. Support multiple languages based on user's input.
If the user writes in Korean, respond in Korean. If in English, respond in English.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

export default async function handler(request: Request): Promise<Response> {
  // Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { messages, model } = body as {
      messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
      model?: string;
    };

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (USE_GATEWAY) {
      // ── Gateway Mode ──
      // Accept any provider/model ID and route through Vercel AI Gateway
      const gatewayModelId = (model && model.includes('/'))
        ? model
        : DEFAULT_GATEWAY_MODEL;

      // Build BYOK config (use existing API keys for zero markup)
      const byok: Record<string, Array<{ apiKey: string }>> = {};
      if (process.env.GEMINI_API_KEY) {
        byok.google = [{ apiKey: process.env.GEMINI_API_KEY }];
      }
      if (process.env.GROQ_API_KEY) {
        byok.groq = [{ apiKey: process.env.GROQ_API_KEY }];
      }

      console.log(`[Chat AI Gateway] model=${gatewayModelId}, byok=${Object.keys(byok).join(',')}`);

      const result = streamText({
        model: gateway(gatewayModelId),
        system: SYSTEM_PROMPT,
        messages,
        temperature: 0.7,
        maxOutputTokens: 2048,
        providerOptions: {
          gateway: {
            ...(Object.keys(byok).length > 0 ? { byok } : {}),
            tags: ['aihub'],
          },
        },
      });

      return result.toTextStreamResponse({
        headers: {
          ...corsHeaders,
          'X-AI-Gateway': 'true',
          'X-AI-Model': gatewayModelId,
        },
      });
    } else {
      // ── Direct Provider Mode (Gemini + Groq only) ──
      const directModel = model || DEFAULT_DIRECT_MODEL;
      const isGemini = directModel.startsWith('gemini');

      if (isGemini && !process.env.GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (!isGemini && !process.env.GROQ_API_KEY) {
        return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const getModel = DIRECT_MODEL_MAP[directModel] || DIRECT_MODEL_MAP[DEFAULT_DIRECT_MODEL];

      console.log(`[Chat AI Direct] model=${directModel}`);

      const result = streamText({
        model: getModel(),
        system: SYSTEM_PROMPT,
        messages,
        temperature: 0.7,
        maxOutputTokens: 2048,
      });

      return result.toTextStreamResponse({
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.error('[Chat AI] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const status = errorMessage.includes('rate') || errorMessage.includes('quota') ? 429 : 500;

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

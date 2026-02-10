/**
 * AI Hub Chat API — Vercel AI SDK Edition
 * 기존 /api/chat (커스텀 SSE) 와 별개로 작동하는 Vercel AI Gateway 엔드포인트
 *
 * POST /api/chat-ai
 * Request: { messages, model? }
 * Response: Vercel AI Data Stream (0:"text"\n 형식, @ai-sdk/react useChat 호환)
 *
 * Supported Models:
 * - gemini-2.5-flash-lite (Google Gemini via @ai-sdk/google)
 * - llama-3.3-70b-versatile (Groq Llama via @ai-sdk/groq)
 */

import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';

// Provider 초기화
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// 모델 → Provider 매핑
const MODEL_MAP: Record<string, () => ReturnType<typeof google> | ReturnType<typeof groq>> = {
  'gemini-2.5-flash-lite': () => google('gemini-2.5-flash-lite'),
  'llama-3.3-70b-versatile': () => groq('llama-3.3-70b-versatile'),
};

const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

// 시스템 프롬프트 (기존 chat.ts와 동일)
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
    const { messages, model = DEFAULT_MODEL } = body as {
      messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
      model?: string;
    };

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // API 키 확인
    const isGemini = model.startsWith('gemini');
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

    // Provider 모델 가져오기
    const getModel = MODEL_MAP[model] || MODEL_MAP[DEFAULT_MODEL];

    // Vercel AI SDK streamText → Data Stream Response
    const result = streamText({
      model: getModel(),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxTokens: 2048,
    });

    return result.toDataStreamResponse({
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('[Chat AI SDK] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const status = errorMessage.includes('rate') || errorMessage.includes('quota') ? 429 : 500;

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

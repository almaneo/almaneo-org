/**
 * AI Hub Chat API
 * Vercel Edge Function for Gemini API integration
 *
 * POST /api/chat
 * Request: { conversationId, message, history }
 * Response: Streaming text (SSE)
 */

// Gemini API 설정
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent`;

// 시스템 프롬프트
const SYSTEM_PROMPT = `You are AlmaNEO AI Hub assistant, helping users with various tasks.
You are part of the AlmaNEO project that aims to democratize AI access globally.
Be helpful, concise, and friendly. Support multiple languages based on user's input.
If the user writes in Korean, respond in Korean. If in English, respond in English.`;

// 메시지 타입
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Gemini API 요청 형식
interface GeminiContent {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export const config = {
  runtime: 'edge',
  regions: ['icn1'], // Seoul region for low latency
};

export default async function handler(request: Request): Promise<Response> {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // POST만 허용
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // API 키 확인
  if (!GEMINI_API_KEY) {
    console.error('[Chat API] GEMINI_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { message, history = [] } = body as {
      conversationId?: string;
      message: string;
      history?: Message[];
    };

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 대화 기록을 Gemini 형식으로 변환
    const contents: GeminiContent[] = [];

    // 시스템 프롬프트를 첫 번째 user 메시지로 추가 (Gemini는 system role 미지원)
    if (history.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: `[System Instruction]\n${SYSTEM_PROMPT}\n\n[User Message]\n${message}` }],
      });
    } else {
      // 기존 대화 기록 추가
      for (const msg of history) {
        if (msg.role === 'system') continue;
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
      // 새 메시지 추가
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });
    }

    // Gemini API 호출 (스트리밍)
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}&alt=sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('[Chat API] Gemini API error:', geminiResponse.status, errorText);

      // 쿼터 초과 에러 처리
      if (geminiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'API quota exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: `AI model error: ${geminiResponse.statusText}` }), {
        status: geminiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 스트리밍 응답 - TransformStream 사용
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // 비동기로 스트리밍 처리
    (async () => {
      try {
        if (!geminiResponse.body) {
          // Non-streaming fallback
          const data = await geminiResponse.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text, done: true })}\n\n`));
          await writer.close();
          return;
        }

        const reader = geminiResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // SSE 이벤트 파싱
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr.trim() === '[DONE]') {
                await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                continue;
              }

              try {
                const data = JSON.parse(jsonStr);
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (text) {
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                }
              } catch {
                // JSON 파싱 실패는 무시
              }
            }
          }
        }

        reader.releaseLock();
      } catch (error) {
        console.error('[Chat API] Streaming error:', error);
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming error' })}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

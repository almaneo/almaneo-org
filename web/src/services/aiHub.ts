/**
 * AI Hub Service
 * 대화 관리, 메시지 처리, 쿼터 관리
 */

import { supabase, type DbConversation, type DbMessage, type DbQuota, type QuotaCheckResult } from '../supabase';

// 상수
export const DAILY_QUOTA_LIMIT = 50;

// ── 모델 타입 정의 ──
export interface AIModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: string;
  tier: 'free' | 'standard' | 'premium';
}

// ── Direct 모델 (Gateway 없이 사용, 자체 API 키 필요) ──
export const DIRECT_MODELS: Record<string, AIModelInfo> = {
  'gemini-2.5-flash-lite': {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    description: 'Fast and efficient for everyday tasks',
    icon: '✨',
    tier: 'free',
  },
  'llama-3.3-70b-versatile': {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    provider: 'Groq',
    description: 'Powerful open-source model with excellent multilingual support',
    icon: '🦙',
    tier: 'free',
  },
};

// ── Gateway 모델 (Vercel AI Gateway 경유, 단일 API 키로 모든 모델 접근) ──
export const GATEWAY_MODELS: Record<string, AIModelInfo> = {
  // Google
  'google/gemini-2.5-flash-lite': {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    description: 'Ultra-fast, most cost-effective',
    icon: '✨',
    tier: 'free',
  },
  'google/gemini-3-flash': {
    id: 'google/gemini-3-flash',
    name: 'Gemini 3 Flash',
    provider: 'Google',
    description: 'Latest Gemini, strong multilingual',
    icon: '⚡',
    tier: 'free',
  },
  'google/gemini-2.5-pro': {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: '1M context, deep reasoning',
    icon: '💎',
    tier: 'standard',
  },
  // Anthropic
  'anthropic/claude-sonnet-4-5-20250929': {
    id: 'anthropic/claude-sonnet-4-5-20250929',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    description: '#1 most popular, excellent quality',
    icon: '🟠',
    tier: 'premium',
  },
  'anthropic/claude-haiku-4-5-20251001': {
    id: 'anthropic/claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    description: 'Fast & affordable Claude',
    icon: '🟡',
    tier: 'standard',
  },
  // OpenAI
  'openai/gpt-4o-mini': {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Most cost-effective GPT',
    icon: '🟢',
    tier: 'free',
  },
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Powerful multimodal GPT',
    icon: '🔵',
    tier: 'premium',
  },
  // Meta
  'meta/llama-3.3-70b': {
    id: 'meta/llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Open-source, great multilingual',
    icon: '🦙',
    tier: 'free',
  },
  // DeepSeek
  'deepseek/deepseek-v3.2': {
    id: 'deepseek/deepseek-v3.2',
    name: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    description: 'Cheapest, strong bilingual EN/ZH',
    icon: '🐋',
    tier: 'free',
  },
  // Mistral
  'mistral/mistral-large-3': {
    id: 'mistral/mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'Mistral',
    description: 'European AI, 256K context',
    icon: '🔷',
    tier: 'standard',
  },
  // xAI
  'xai/grok-3': {
    id: 'xai/grok-3',
    name: 'Grok 3',
    provider: 'xAI',
    description: '131K context, versatile',
    icon: '🤖',
    tier: 'standard',
  },
};

// ── 하위 호환성 (기존 코드에서 AI_MODELS 사용) ──
export const AI_MODELS = DIRECT_MODELS;
export type AIModelId = string;
export const AI_MODEL_LIST = Object.values(DIRECT_MODELS);

// Default 모델
export const DEFAULT_DIRECT_MODEL = 'gemini-2.5-flash-lite';
export const DEFAULT_GATEWAY_MODEL = 'google/gemini-2.5-flash-lite';

// Vercel AI SDK 엔드포인트 (기존 /api/chat 와 별도)
export const API_ENDPOINT_LEGACY = '/api/chat';
export const API_ENDPOINT_AI_SDK = '/api/chat-ai';

// ============================================
// 사용자 관리
// ============================================

/**
 * 사용자가 users 테이블에 존재하는지 확인하고, 없으면 생성
 * (ai_hub_conversations, ai_hub_quota 테이블이 users를 참조하므로 필수)
 */
export async function ensureUserExists(userAddress: string): Promise<void> {
  // 먼저 사용자 존재 여부 확인 (maybeSingle: 행이 없어도 에러 없음)
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('wallet_address')
    .eq('wallet_address', userAddress)
    .maybeSingle();

  if (selectError) {
    console.error('[AI Hub] Failed to check user:', selectError);
    // 에러가 있어도 계속 진행 (insert 시도)
  }

  if (existingUser) {
    // 이미 존재함
    return;
  }

  // 사용자가 없으므로 생성
  const { error: insertError } = await supabase
    .from('users')
    .insert({
      wallet_address: userAddress,
      nickname: `User_${userAddress.slice(0, 6)}`,
      kindness_score: 0,
      total_points: 0,
      level: 1,
    });

  if (insertError && insertError.code !== '23505') { // 23505: unique violation (이미 존재)
    console.error('[AI Hub] Failed to create user:', insertError);
    throw new Error('사용자 정보를 생성하는데 실패했습니다.');
  }
}
export const DEFAULT_MODEL = DEFAULT_DIRECT_MODEL;
export const CONVERSATION_RETENTION_DAYS = 30;

// ============================================
// 대화 관리
// ============================================

/**
 * 사용자의 대화 목록 조회
 */
export async function getConversations(userAddress: string): Promise<DbConversation[]> {
  const { data, error } = await supabase
    .from('ai_hub_conversations')
    .select('*')
    .eq('user_address', userAddress)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[AI Hub] Failed to get conversations:', error);
    throw new Error('대화 목록을 불러오는데 실패했습니다.');
  }

  return data || [];
}

/**
 * 대화 상세 조회 (메시지 포함)
 */
export async function getConversation(conversationId: string): Promise<{
  conversation: DbConversation | null;
  messages: DbMessage[];
}> {
  // 대화 조회
  const { data: conversation, error: convError } = await supabase
    .from('ai_hub_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError) {
    console.error('[AI Hub] Failed to get conversation:', convError);
    return { conversation: null, messages: [] };
  }

  // 메시지 조회
  const { data: messages, error: msgError } = await supabase
    .from('ai_hub_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (msgError) {
    console.error('[AI Hub] Failed to get messages:', msgError);
    return { conversation, messages: [] };
  }

  return { conversation, messages: messages || [] };
}

/**
 * 새 대화 생성
 */
export async function createConversation(
  userAddress: string,
  title?: string,
  model?: string
): Promise<DbConversation> {
  // 먼저 사용자가 존재하는지 확인 (외래키 제약)
  await ensureUserExists(userAddress);

  const { data, error } = await supabase
    .from('ai_hub_conversations')
    .insert({
      user_address: userAddress,
      title: title || 'New Chat',
      model: model || DEFAULT_MODEL,
    })
    .select()
    .single();

  if (error) {
    console.error('[AI Hub] Failed to create conversation:', error);
    throw new Error('대화를 생성하는데 실패했습니다.');
  }

  return data;
}

/**
 * 대화 제목 업데이트
 */
export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<void> {
  const { error } = await supabase
    .from('ai_hub_conversations')
    .update({ title })
    .eq('id', conversationId);

  if (error) {
    console.error('[AI Hub] Failed to update conversation title:', error);
    throw new Error('대화 제목을 업데이트하는데 실패했습니다.');
  }
}

/**
 * 대화 삭제
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from('ai_hub_conversations')
    .delete()
    .eq('id', conversationId);

  if (error) {
    console.error('[AI Hub] Failed to delete conversation:', error);
    throw new Error('대화를 삭제하는데 실패했습니다.');
  }
}

// ============================================
// 메시지 관리
// ============================================

/**
 * 메시지 추가
 */
export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<DbMessage> {
  const { data, error } = await supabase
    .from('ai_hub_messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('[AI Hub] Failed to add message:', error);
    throw new Error('메시지를 저장하는데 실패했습니다.');
  }

  // 대화 updated_at 갱신
  await supabase
    .from('ai_hub_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

/**
 * 대화의 메시지 목록 조회
 */
export async function getMessages(conversationId: string): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from('ai_hub_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[AI Hub] Failed to get messages:', error);
    throw new Error('메시지를 불러오는데 실패했습니다.');
  }

  return data || [];
}

// ============================================
// 쿼터 관리
// ============================================

/**
 * 쿼터 조회
 */
export async function getQuota(userAddress: string): Promise<DbQuota | null> {
  const { data, error } = await supabase
    .from('ai_hub_quota')
    .select('*')
    .eq('user_address', userAddress)
    .maybeSingle(); // 행이 없어도 에러 없이 null 반환

  if (error) {
    console.error('[AI Hub] Failed to get quota:', error);
    return null;
  }

  return data;
}

/**
 * 쿼터 체크 및 증가 (RPC 함수 사용)
 */
export async function checkAndIncrementQuota(
  userAddress: string,
  dailyLimit: number = DAILY_QUOTA_LIMIT
): Promise<QuotaCheckResult> {
  const { data, error } = await supabase
    .rpc('check_and_increment_quota', {
      p_user_address: userAddress,
      p_daily_limit: dailyLimit,
    });

  if (error) {
    console.error('[AI Hub] Failed to check quota:', error);
    // 에러 시에도 진행 허용 (관대한 처리)
    return { can_proceed: true, current_used: 0, daily_limit: dailyLimit };
  }

  // 결과가 배열로 반환됨
  const result = Array.isArray(data) ? data[0] : data;
  return result || { can_proceed: true, current_used: 0, daily_limit: dailyLimit };
}

/**
 * 쿼터 수동 증가 (RPC 사용 불가 시 fallback)
 */
export async function incrementQuotaManually(userAddress: string): Promise<{
  success: boolean;
  quotaUsed: number;
  quotaLimit: number;
}> {
  // 먼저 사용자가 존재하는지 확인 (외래키 제약)
  await ensureUserExists(userAddress);

  const today = new Date().toISOString().split('T')[0];

  // 기존 쿼터 조회
  const quota = await getQuota(userAddress);

  if (!quota) {
    // 새 사용자: 쿼터 생성
    const { error } = await supabase
      .from('ai_hub_quota')
      .insert({
        user_address: userAddress,
        queries_used: 1,
        quota_date: today,
      });

    if (error) {
      console.error('[AI Hub] Failed to create quota:', error);
      return { success: true, quotaUsed: 1, quotaLimit: DAILY_QUOTA_LIMIT };
    }

    return { success: true, quotaUsed: 1, quotaLimit: DAILY_QUOTA_LIMIT };
  }

  // 날짜가 다르면 리셋
  if (quota.quota_date !== today) {
    const { error } = await supabase
      .from('ai_hub_quota')
      .update({ queries_used: 1, quota_date: today })
      .eq('user_address', userAddress);

    if (error) {
      console.error('[AI Hub] Failed to reset quota:', error);
    }

    return { success: true, quotaUsed: 1, quotaLimit: DAILY_QUOTA_LIMIT };
  }

  // 쿼터 체크
  if (quota.queries_used >= DAILY_QUOTA_LIMIT) {
    return { success: false, quotaUsed: quota.queries_used, quotaLimit: DAILY_QUOTA_LIMIT };
  }

  // 쿼터 증가
  const { error } = await supabase
    .from('ai_hub_quota')
    .update({ queries_used: quota.queries_used + 1 })
    .eq('user_address', userAddress);

  if (error) {
    console.error('[AI Hub] Failed to increment quota:', error);
  }

  return { success: true, quotaUsed: quota.queries_used + 1, quotaLimit: DAILY_QUOTA_LIMIT };
}

/**
 * 현재 쿼터 상태 조회
 */
export async function getQuotaStatus(userAddress: string): Promise<{
  used: number;
  limit: number;
  remainingToday: number;
  resetTime: Date;
}> {
  const quota = await getQuota(userAddress);
  const today = new Date().toISOString().split('T')[0];

  // 쿼터가 없거나 날짜가 다르면 사용량 0
  const used = quota && quota.quota_date === today ? quota.queries_used : 0;

  // 다음 날 자정까지 남은 시간
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return {
    used,
    limit: DAILY_QUOTA_LIMIT,
    remainingToday: Math.max(0, DAILY_QUOTA_LIMIT - used),
    resetTime: tomorrow,
  };
}

// ============================================
// 유틸리티
// ============================================

/**
 * 첫 메시지로 대화 제목 자동 생성
 */
export function generateTitleFromMessage(message: string): string {
  // 첫 30자 또는 첫 줄을 제목으로 사용
  const firstLine = message.split('\n')[0];
  const title = firstLine.length > 30 ? firstLine.slice(0, 30) + '...' : firstLine;
  return title || 'New Chat';
}

/**
 * 대화 기록을 Gemini API 형식으로 변환
 */
export function formatMessagesForGemini(messages: DbMessage[]): Array<{
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}> {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
}

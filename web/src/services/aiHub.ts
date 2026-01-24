/**
 * AI Hub Service
 * 대화 관리, 메시지 처리, 쿼터 관리
 */

import { supabase, type DbConversation, type DbMessage, type DbQuota, type QuotaCheckResult } from '../supabase';

// 상수
export const DAILY_QUOTA_LIMIT = 50;

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

  if (existingUser) {
    // 이미 존재함
    return;
  }

  // PGRST116: no rows returned - 사용자가 없으므로 생성
  if (selectError && selectError.code === 'PGRST116') {
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
  } else if (selectError) {
    console.error('[AI Hub] Failed to check user:', selectError);
  }
}
export const DEFAULT_MODEL = 'gemini-2.5-flash-lite';
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

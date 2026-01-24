/**
 * useAIHub Hook
 * AI Hub 상태 관리 및 API 통신
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useWallet } from '../components/wallet';
import {
  getConversations,
  getConversation,
  createConversation,
  deleteConversation,
  updateConversationTitle,
  addMessage,
  getQuotaStatus,
  incrementQuotaManually,
  generateTitleFromMessage,
  DAILY_QUOTA_LIMIT,
} from '../services/aiHub';
import type { DbConversation, DbMessage } from '../supabase';

// 타입 정의
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  resetTime: Date;
}

export interface UseAIHubReturn {
  // 대화 목록
  conversations: Conversation[];
  currentConversation: Conversation | null;

  // 메시지
  messages: Message[];

  // 쿼터
  quota: QuotaInfo;

  // 상태
  isLoading: boolean;
  isSending: boolean;
  isStreaming: boolean;
  error: string | null;

  // 액션
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createNewConversation: () => Promise<string | null>;
  deleteCurrentConversation: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  clearError: () => void;
  refreshQuota: () => Promise<void>;
}

// API URL
const API_URL = '/api/chat';

/**
 * DB 형식을 클라이언트 형식으로 변환
 */
function dbConversationToClient(conv: DbConversation): Conversation {
  return {
    id: conv.id,
    title: conv.title,
    model: conv.model,
    createdAt: conv.created_at,
    updatedAt: conv.updated_at,
  };
}

function dbMessageToClient(msg: DbMessage): Message {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    createdAt: msg.created_at,
  };
}

export function useAIHub(): UseAIHubReturn {
  const { address, isConnected } = useWallet();

  // 대화 상태
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // 쿼터 상태
  const [quota, setQuota] = useState<QuotaInfo>({
    used: 0,
    limit: DAILY_QUOTA_LIMIT,
    remaining: DAILY_QUOTA_LIMIT,
    resetTime: new Date(),
  });

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 스트리밍 중단을 위한 ref
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 대화 목록 로드
   */
  const loadConversations = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getConversations(address);
      setConversations(data.map(dbConversationToClient));
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * 대화 선택
   */
  const selectConversation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { conversation, messages: dbMessages } = await getConversation(id);

      if (conversation) {
        setCurrentConversation(dbConversationToClient(conversation));
        setMessages(dbMessages.map(dbMessageToClient));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 새 대화 생성
   */
  const createNewConversation = useCallback(async (): Promise<string | null> => {
    if (!address) return null;

    setIsLoading(true);
    setError(null);

    try {
      const newConv = await createConversation(address);
      const clientConv = dbConversationToClient(newConv);

      setConversations((prev) => [clientConv, ...prev]);
      setCurrentConversation(clientConv);
      setMessages([]);

      return clientConv.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화를 생성하는데 실패했습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * 현재 대화 삭제
   */
  const deleteCurrentConversation = useCallback(async () => {
    if (!currentConversation) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteConversation(currentConversation.id);

      setConversations((prev) => prev.filter((c) => c.id !== currentConversation.id));
      setCurrentConversation(null);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화를 삭제하는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation]);

  /**
   * 메시지 전송
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!address || !content.trim()) return;

      // 쿼터 체크
      if (quota.remaining <= 0) {
        setError('일일 쿼터를 초과했습니다. 내일 다시 시도해주세요.');
        return;
      }

      setIsSending(true);
      setIsStreaming(true);
      setError(null);

      let conversationId = currentConversation?.id;

      try {
        // 대화가 없으면 새로 생성
        if (!conversationId) {
          const newConv = await createConversation(address, generateTitleFromMessage(content));
          conversationId = newConv.id;
          const clientConv = dbConversationToClient(newConv);
          setConversations((prev) => [clientConv, ...prev]);
          setCurrentConversation(clientConv);
        }

        // 사용자 메시지 저장
        const userMsg = await addMessage(conversationId, 'user', content);
        const clientUserMsg = dbMessageToClient(userMsg);
        setMessages((prev) => [...prev, clientUserMsg]);

        // 쿼터 증가
        const quotaResult = await incrementQuotaManually(address);
        if (!quotaResult.success) {
          setError('일일 쿼터를 초과했습니다.');
          setIsSending(false);
          setIsStreaming(false);
          return;
        }

        // 쿼터 업데이트
        setQuota((prev) => ({
          ...prev,
          used: quotaResult.quotaUsed,
          remaining: quotaResult.quotaLimit - quotaResult.quotaUsed,
        }));

        // AI 응답 플레이스홀더 추가
        const assistantMsgId = `temp-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: 'assistant',
            content: '',
            createdAt: new Date().toISOString(),
          },
        ]);

        // API 호출 (스트리밍)
        abortControllerRef.current = new AbortController();

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            message: content,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'AI 응답을 받는데 실패했습니다.');
        }

        // 스트리밍 응답 처리
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.done) continue;

                  if (data.text) {
                    fullContent += data.text;

                    // 메시지 업데이트
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: fullContent } : m
                      )
                    );
                  }

                  if (data.error) {
                    throw new Error(data.error);
                  }
                } catch {
                  // JSON 파싱 실패는 무시
                }
              }
            }
          }

          reader.releaseLock();
        }

        // DB에 AI 응답 저장
        if (fullContent) {
          const savedMsg = await addMessage(conversationId, 'assistant', fullContent);

          // 임시 ID를 실제 ID로 교체
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? dbMessageToClient(savedMsg) : m))
          );

          // 첫 메시지면 제목 업데이트
          if (messages.length === 0) {
            const title = generateTitleFromMessage(content);
            await updateConversationTitle(conversationId, title);

            setCurrentConversation((prev) => (prev ? { ...prev, title } : null));
            setConversations((prev) =>
              prev.map((c) => (c.id === conversationId ? { ...c, title } : c))
            );
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // 사용자가 중단함
          return;
        }
        setError(err instanceof Error ? err.message : 'AI 응답을 받는데 실패했습니다.');
      } finally {
        setIsSending(false);
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [address, currentConversation, messages, quota.remaining]
  );

  /**
   * 스트리밍 중단
   */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 쿼터 새로고침
   */
  const refreshQuota = useCallback(async () => {
    if (!address) return;

    try {
      const status = await getQuotaStatus(address);
      setQuota({
        used: status.used,
        limit: status.limit,
        remaining: status.remainingToday,
        resetTime: status.resetTime,
      });
    } catch (err) {
      console.error('[useAIHub] Failed to refresh quota:', err);
    }
  }, [address]);

  // 초기 로드
  useEffect(() => {
    if (isConnected && address) {
      loadConversations();
      refreshQuota();
    } else {
      // 로그아웃 시 상태 초기화
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [isConnected, address, loadConversations, refreshQuota]);

  return {
    conversations,
    currentConversation,
    messages,
    quota,
    isLoading,
    isSending,
    isStreaming,
    error,
    loadConversations,
    selectConversation,
    createNewConversation,
    deleteCurrentConversation,
    sendMessage,
    stopStreaming,
    clearError,
    refreshQuota,
  };
}

export default useAIHub;

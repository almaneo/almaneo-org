/**
 * AIHub Page
 * AlmaNEO AI Hub 채팅 인터페이스
 */

import { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Menu, X, Wallet, ChevronDown, Check, Zap } from 'lucide-react';
import { useWallet } from '../components/wallet';
import { useAIHub } from '../hooks/useAIHub';
import type { AIModelInfo } from '../services/aiHub';
import {
  ChatMessage,
  ChatInput,
  ConversationList,
  QuotaBar,
  WelcomeScreen,
} from '../components/aihub';
import { useState } from 'react';

export function AIHub() {
  const { t } = useTranslation('landing');
  const { isConnected, connect, isLoading: walletLoading } = useWallet();
  const {
    conversations,
    currentConversation,
    messages,
    quota,
    currentModel,
    availableModels,
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
    setModel,
    useVercelAI,
    setUseVercelAI,
  } = useAIHub();

  // 모바일 사이드바 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 모델 선택 드롭다운 상태
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // 메시지 스크롤 참조
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 모델을 프로바이더별로 그룹화
  const groupedModels = useMemo(() => {
    const groups: Record<string, AIModelInfo[]> = {};
    for (const model of Object.values(availableModels)) {
      if (!groups[model.provider]) groups[model.provider] = [];
      groups[model.provider].push(model);
    }
    return groups;
  }, [availableModels]);

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 지갑 미연결 상태
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neos-blue to-cyan-500 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            {t('aiHub.connectWallet.title', '지갑을 연결해주세요')}
          </h1>
          <p className="text-slate-400 mb-6">
            {t(
              'aiHub.connectWallet.description',
              'AI Hub를 사용하려면 지갑을 연결해야 합니다. 소셜 로그인으로 간편하게 시작하세요.'
            )}
          </p>
          <button
            onClick={connect}
            disabled={walletLoading}
            className="px-6 py-3 bg-neos-blue hover:bg-neos-blue/90 disabled:bg-slate-600 rounded-lg font-medium text-white transition-colors"
          >
            {walletLoading
              ? t('aiHub.connectWallet.connecting', '연결 중...')
              : t('aiHub.connectWallet.button', '지갑 연결')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex">
      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-700 transform transition-transform lg:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 모바일 닫기 버튼 */}
        <div className="lg:hidden flex justify-end p-2">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 대화 목록 */}
        <ConversationList
          conversations={conversations}
          currentId={currentConversation?.id || null}
          onSelect={(id) => {
            selectConversation(id);
            setIsSidebarOpen(false);
          }}
          onCreate={() => {
            createNewConversation();
            setIsSidebarOpen(false);
          }}
          onDelete={deleteCurrentConversation}
          isLoading={isLoading}
        />
      </aside>

      {/* 메인 영역 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 헤더 */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-700 bg-slate-900/50">
          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* 대화 제목 */}
          <h1 className="text-lg font-medium text-white truncate">
            {currentConversation?.title || t('aiHub.title', 'AlmaNEO AI Hub')}
          </h1>

          {/* 모델 선택 드롭다운 */}
          <div className="relative ml-auto">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm text-slate-200 transition-colors"
            >
              <span>{availableModels[currentModel]?.icon ?? '🤖'}</span>
              <span className="hidden sm:inline">{availableModels[currentModel]?.name ?? currentModel}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 드롭다운 메뉴 */}
            {isModelDropdownOpen && (
              <>
                {/* 배경 오버레이 */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsModelDropdownOpen(false)}
                />
                {/* 메뉴 */}
                <div className="absolute right-0 mt-2 w-80 max-h-[70vh] rounded-lg bg-slate-800 border border-slate-600 shadow-xl z-20 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-slate-700">
                    <p className="text-xs text-slate-400 px-2">
                      {t('aiHub.selectModel', 'AI 모델 선택')}
                      {useVercelAI && (
                        <span className="ml-2 text-emerald-400">
                          — Gateway ({Object.keys(availableModels).length} models)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="p-1 overflow-y-auto">
                    {Object.entries(groupedModels).map(([provider, models]) => (
                      <div key={provider}>
                        {/* 프로바이더 그룹 헤더 (Gateway 모드에서만 표시) */}
                        {useVercelAI && (
                          <div className="px-3 pt-2 pb-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                              {provider}
                            </span>
                          </div>
                        )}
                        {models.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setModel(model.id);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors ${
                              currentModel === model.id
                                ? 'bg-neos-blue/20 text-white'
                                : 'hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="text-lg mt-0.5">{model.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{model.name}</span>
                                {model.tier === 'premium' && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                                    PRO
                                  </span>
                                )}
                                {model.tier === 'standard' && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                                    STD
                                  </span>
                                )}
                                {currentModel === model.id && (
                                  <Check className="w-3.5 h-3.5 text-neos-blue ml-auto flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{model.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Vercel AI Gateway 토글 */}
          <button
            onClick={() => setUseVercelAI(!useVercelAI)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              useVercelAI
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-600 hover:text-slate-200'
            }`}
            title={useVercelAI ? 'AI Gateway ON — Access 11+ models from 7 providers' : 'Direct Mode — Gemini + Groq only'}
          >
            <Zap className={`w-3.5 h-3.5 ${useVercelAI ? 'fill-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Gateway</span>
          </button>

          {/* 새로고침 버튼 */}
          <button
            onClick={loadConversations}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-50"
            title={t('aiHub.refresh', '새로고침')}
          >
            <svg
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </header>

        {/* 에러 메시지 */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm flex-1">{error}</p>
              <button
                onClick={clearError}
                className="text-xs underline hover:no-underline"
              >
                {t('aiHub.dismiss', '닫기')}
              </button>
            </div>
          </div>
        )}

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !currentConversation ? (
            <WelcomeScreen onStartChat={createNewConversation} />
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={isStreaming && index === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <div className="border-t border-slate-700 bg-slate-900/50">
          <div className="max-w-3xl mx-auto p-4">
            <ChatInput
              onSend={sendMessage}
              onStop={stopStreaming}
              isSending={isSending}
              isStreaming={isStreaming}
              disabled={quota.remaining <= 0}
              placeholder={
                quota.remaining <= 0
                  ? t('aiHub.quota.exceeded', '일일 쿼터 초과')
                  : undefined
              }
            />
          </div>

          {/* 쿼터 바 */}
          <QuotaBar quota={quota} onRefresh={refreshQuota} />
        </div>
      </main>
    </div>
  );
}

export default AIHub;

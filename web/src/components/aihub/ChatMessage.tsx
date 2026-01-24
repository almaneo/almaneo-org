/**
 * ChatMessage Component
 * 개별 채팅 메시지 표시
 */

import { Bot, User } from 'lucide-react';
import type { Message } from '../../hooks/useAIHub';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 p-4 ${
        isUser ? 'bg-transparent' : 'bg-slate-800/30'
      }`}
    >
      {/* 아바타 */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-jeong-orange to-amber-500'
            : 'bg-gradient-to-br from-neos-blue to-cyan-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* 메시지 내용 */}
      <div className="flex-1 min-w-0">
        {/* 역할 라벨 */}
        <div className="text-xs text-slate-400 mb-1">
          {isUser ? 'You' : 'AlmaNEO AI'}
        </div>

        {/* 메시지 텍스트 */}
        <div className="text-slate-200 whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && !isUser && (
            <span className="inline-block w-2 h-4 ml-1 bg-neos-blue animate-pulse" />
          )}
        </div>

        {/* 빈 메시지 (스트리밍 시작) */}
        {!message.content && isStreaming && !isUser && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-neos-blue rounded-full animate-bounce" />
            <span
              className="w-2 h-2 bg-neos-blue rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            />
            <span
              className="w-2 h-2 bg-neos-blue rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;

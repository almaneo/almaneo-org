/**
 * ChatMessage Component
 * 마크다운 렌더링 + 코드 하이라이팅 + 피드백 버튼
 */

import { useState, useCallback, memo } from 'react';
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslation } from 'react-i18next';
import type { Message } from '../../hooks/useAIHub';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void;
}

// 코드블록 복사 버튼 컴포넌트
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
      title="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// 마크다운 렌더러 커스텀 컴포넌트
const markdownComponents = {
  // 코드 블록
  code({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { className?: string }) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (match) {
      return (
        <div className="relative group my-3">
          {/* 언어 태그 */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 border-b border-slate-700 rounded-t-lg">
            <span className="text-[10px] font-mono text-slate-400 uppercase">{match[1]}</span>
          </div>
          <CopyButton text={codeString} />
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: '0 0 0.5rem 0.5rem',
              fontSize: '0.8125rem',
              lineHeight: '1.5',
              padding: '1rem',
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }

    // 인라인 코드
    return (
      <code
        className="px-1.5 py-0.5 mx-0.5 bg-slate-700/80 text-cyan-300 rounded text-[0.85em] font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },

  // 링크
  a({ href, children, ...props }: React.ComponentPropsWithoutRef<'a'>) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neos-blue hover:text-cyan-400 underline underline-offset-2 transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },

  // 테이블
  table({ children }: React.ComponentPropsWithoutRef<'table'>) {
    return (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full text-sm border border-slate-700 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }: React.ComponentPropsWithoutRef<'thead'>) {
    return <thead className="bg-slate-800/80">{children}</thead>;
  },
  th({ children }: React.ComponentPropsWithoutRef<'th'>) {
    return (
      <th className="px-3 py-2 text-left text-xs font-medium text-slate-300 border-b border-slate-700">
        {children}
      </th>
    );
  },
  td({ children }: React.ComponentPropsWithoutRef<'td'>) {
    return (
      <td className="px-3 py-2 text-slate-300 border-b border-slate-700/50">
        {children}
      </td>
    );
  },

  // 리스트
  ul({ children }: React.ComponentPropsWithoutRef<'ul'>) {
    return <ul className="list-disc list-inside space-y-1 my-2 pl-1">{children}</ul>;
  },
  ol({ children }: React.ComponentPropsWithoutRef<'ol'>) {
    return <ol className="list-decimal list-inside space-y-1 my-2 pl-1">{children}</ol>;
  },
  li({ children }: React.ComponentPropsWithoutRef<'li'>) {
    return <li className="text-slate-200 leading-relaxed">{children}</li>;
  },

  // 블록인용
  blockquote({ children }: React.ComponentPropsWithoutRef<'blockquote'>) {
    return (
      <blockquote className="border-l-3 border-neos-blue/50 pl-4 my-3 text-slate-400 italic">
        {children}
      </blockquote>
    );
  },

  // 헤딩
  h1({ children }: React.ComponentPropsWithoutRef<'h1'>) {
    return <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>;
  },
  h2({ children }: React.ComponentPropsWithoutRef<'h2'>) {
    return <h2 className="text-lg font-bold text-white mt-3 mb-2">{children}</h2>;
  },
  h3({ children }: React.ComponentPropsWithoutRef<'h3'>) {
    return <h3 className="text-base font-semibold text-white mt-3 mb-1">{children}</h3>;
  },

  // 단락
  p({ children }: React.ComponentPropsWithoutRef<'p'>) {
    return <p className="my-2 leading-relaxed">{children}</p>;
  },

  // 수평선
  hr() {
    return <hr className="my-4 border-slate-700" />;
  },

  // 강조
  strong({ children }: React.ComponentPropsWithoutRef<'strong'>) {
    return <strong className="font-semibold text-white">{children}</strong>;
  },
};

export const ChatMessage = memo(function ChatMessage({
  message,
  isStreaming,
  onFeedback,
}: ChatMessageProps) {
  const { t } = useTranslation('landing');
  const isUser = message.role === 'user';
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = useCallback(
    (type: 'up' | 'down') => {
      const newFeedback = feedback === type ? null : type;
      setFeedback(newFeedback);
      if (newFeedback && onFeedback) {
        onFeedback(message.id, newFeedback);
      }
    },
    [feedback, message.id, onFeedback]
  );

  return (
    <div
      className={`flex gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 ${
        isUser ? 'bg-transparent' : 'bg-slate-800/20'
      }`}
    >
      {/* 아바타 */}
      <div
        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-jeong-orange to-amber-500'
            : 'bg-gradient-to-br from-neos-blue to-cyan-500'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        ) : (
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        )}
      </div>

      {/* 메시지 내용 */}
      <div className="flex-1 min-w-0">
        {/* 역할 라벨 */}
        <div className="text-xs text-slate-400 mb-1.5 font-medium">
          {isUser
            ? t('aiHub.you', 'You')
            : t('aiHub.aiName', 'AlmaNEO AI')}
        </div>

        {/* 메시지 텍스트 */}
        {isUser ? (
          // 사용자 메시지: plain text
          <div className="text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        ) : (
          // AI 메시지: 마크다운 렌더링
          <div className="text-slate-200 break-words chat-markdown">
            {message.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            ) : null}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-neos-blue animate-pulse rounded-sm" />
            )}
          </div>
        )}

        {/* 빈 메시지 (스트리밍 시작) */}
        {!message.content && isStreaming && !isUser && (
          <div className="flex items-center gap-1.5 py-1">
            <span className="w-2 h-2 bg-neos-blue rounded-full animate-bounce" />
            <span
              className="w-2 h-2 bg-neos-blue rounded-full animate-bounce"
              style={{ animationDelay: '0.15s' }}
            />
            <span
              className="w-2 h-2 bg-neos-blue rounded-full animate-bounce"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        )}

        {/* 피드백 버튼 (AI 메시지, 스트리밍 완료 시) */}
        {!isUser && message.content && !isStreaming && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleFeedback('up')}
              className={`p-1.5 rounded-md transition-colors ${
                feedback === 'up'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
              title={t('aiHub.feedback.helpful', 'Helpful')}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleFeedback('down')}
              className={`p-1.5 rounded-md transition-colors ${
                feedback === 'down'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
              title={t('aiHub.feedback.notHelpful', 'Not helpful')}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;

/**
 * ChatInput Component
 * 메시지 입력 및 전송
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isSending: boolean;
  isStreaming: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  isSending,
  isStreaming,
  disabled,
  placeholder,
}: ChatInputProps) {
  const { t } = useTranslation('landing');
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSending && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter로 전송, Shift+Enter로 줄바꿈
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
        {/* 텍스트 입력 */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('aiHub.placeholder', '메시지를 입력하세요...')}
          disabled={isSending || disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-white placeholder-slate-400 max-h-[200px]"
        />

        {/* 전송/중지 버튼 */}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            title={t('aiHub.stop', '중지')}
          >
            <Square className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || isSending || disabled}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-neos-blue hover:bg-neos-blue/90 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            title={t('aiHub.send', '전송')}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        )}
      </div>

      {/* 힌트 */}
      <div className="mt-2 text-xs text-slate-500 text-center">
        Enter: {t('aiHub.send', '전송')} | Shift+Enter: {t('aiHub.newLine', '줄바꿈')}
      </div>
    </form>
  );
}

export default ChatInput;

/**
 * ConversationList Component
 * 대화 목록 사이드바
 */

import { MessageSquarePlus, Trash2, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Conversation } from '../../hooks/useAIHub';

interface ConversationListProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  currentId,
  onSelect,
  onCreate,
  onDelete,
  isLoading,
}: ConversationListProps) {
  const { t } = useTranslation('landing');

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return t('aiHub.today', '오늘');
    } else if (days === 1) {
      return t('aiHub.yesterday', '어제');
    } else if (days < 7) {
      return t('aiHub.daysAgo', '{{days}}일 전', { days });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 새 대화 버튼 */}
      <button
        onClick={onCreate}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-3 m-2 bg-neos-blue hover:bg-neos-blue/90 disabled:bg-slate-600 rounded-lg transition-colors"
      >
        <MessageSquarePlus className="w-5 h-5" />
        <span>{t('aiHub.newChat', '새 대화')}</span>
      </button>

      {/* 대화 목록 */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('aiHub.noConversations', '대화가 없습니다')}</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors group ${
                currentId === conv.id
                  ? 'bg-neos-blue/20 border border-neos-blue/50'
                  : 'hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{conv.title}</p>
                  <p className="text-xs text-slate-400">{formatDate(conv.updatedAt)}</p>
                </div>

                {/* 삭제 버튼 - 현재 선택된 대화만 표시 */}
                {currentId === conv.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    title={t('aiHub.deleteChat', '대화 삭제')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationList;

/**
 * QuotaBar Component
 * 일일 쿼터 표시
 */

import { Zap, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { QuotaInfo } from '../../hooks/useAIHub';

interface QuotaBarProps {
  quota: QuotaInfo;
  onRefresh?: () => void;
}

export function QuotaBar({ quota, onRefresh }: QuotaBarProps) {
  const { t } = useTranslation('landing');

  const percentage = (quota.used / quota.limit) * 100;
  const isLow = quota.remaining <= 10;
  const isExhausted = quota.remaining <= 0;

  // 리셋까지 남은 시간
  const getResetTimeText = () => {
    const now = new Date();
    const diff = quota.resetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours <= 0) {
      return t('aiHub.quota.resettingSoon', '곧 리셋');
    }
    return t('aiHub.quota.resetTime', '{{hours}}시간 후 리셋', { hours });
  };

  return (
    <div className="px-4 py-2 border-t border-slate-700 bg-slate-800/50">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Zap
            className={`w-4 h-4 ${
              isExhausted
                ? 'text-red-400'
                : isLow
                ? 'text-yellow-400'
                : 'text-neos-blue'
            }`}
          />
          <span className="text-sm text-slate-300">
            {t('aiHub.quota.used', '{{used}}/{{limit}} 사용', {
              used: quota.used,
              limit: quota.limit,
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{getResetTimeText()}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title={t('aiHub.quota.refresh', '새로고침')}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isExhausted
              ? 'bg-red-500'
              : isLow
              ? 'bg-yellow-500'
              : 'bg-gradient-to-r from-neos-blue to-cyan-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* 경고 메시지 */}
      {isExhausted && (
        <p className="mt-1 text-xs text-red-400">
          {t('aiHub.quota.exceeded', '일일 쿼터 초과')}
        </p>
      )}
      {isLow && !isExhausted && (
        <p className="mt-1 text-xs text-yellow-400">
          {t('aiHub.quota.low', '쿼터가 {{remaining}}회 남았습니다', {
            remaining: quota.remaining,
          })}
        </p>
      )}
    </div>
  );
}

export default QuotaBar;

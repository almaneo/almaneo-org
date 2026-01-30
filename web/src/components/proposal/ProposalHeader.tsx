/**
 * ProposalHeader - 제안서 상단 정보 바
 * 상태 배지, 타겟 정보, 언어 선택, 음성 토글
 */

import { X, Download, Globe, Volume2, VolumeX } from 'lucide-react';
import type { ProposalMeta, ProposalLanguage } from '../../data/proposals/types';
import {
  statusColors,
  statusLabelsByLanguage,
  supportedLanguages,
} from '../../data/proposals/types';

interface ProposalHeaderProps {
  meta: ProposalMeta;
  currentLanguage: ProposalLanguage;
  availableLanguages: ProposalLanguage[];
  isAudioEnabled: boolean;
  onLanguageChange: (lang: ProposalLanguage) => void;
  onAudioToggle: () => void;
  onClose?: () => void;
}

export default function ProposalHeader({
  meta,
  currentLanguage,
  availableLanguages,
  isAudioEnabled,
  onLanguageChange,
  onAudioToggle,
  onClose,
}: ProposalHeaderProps) {
  const statusLabels = statusLabelsByLanguage[currentLanguage];

  return (
    <div className="proposal-header">
      {/* 왼쪽: 제안서 정보 */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* 상태 배지 */}
        <span
          className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white
            ${statusColors[meta.status]}
          `}
        >
          {statusLabels[meta.status]}
        </span>

        {/* 타겟 정보 */}
        <div className="hidden sm:block text-sm text-slate-400 truncate">
          <span className="text-white font-medium">{meta.targetOrg}</span>
          {meta.targetProgram && (
            <span className="text-slate-500"> | {meta.targetProgram}</span>
          )}
        </div>

        {/* 요청 금액 */}
        {meta.requestedAmount && (
          <span className="hidden md:inline-block text-sm text-jeong-orange font-medium">
            {meta.requestedAmount}
          </span>
        )}
      </div>

      {/* 오른쪽: 액션 버튼들 */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* 언어 선택 */}
        {availableLanguages.length > 1 && (
          <div className="flex items-center gap-1 px-1 sm:px-2 py-1 rounded-lg bg-slate-800/50">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as ProposalLanguage)}
              className="bg-transparent text-xs sm:text-sm text-white border-none outline-none cursor-pointer"
            >
              {availableLanguages.map((langCode) => {
                const lang = supportedLanguages.find((l) => l.code === langCode);
                return (
                  <option key={langCode} value={langCode} className="bg-slate-900">
                    {lang?.nativeLabel || langCode}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* 음성 토글 */}
        <button
          onClick={onAudioToggle}
          className={`
            flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors
            ${isAudioEnabled
              ? 'bg-neos-blue/20 text-neos-blue'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }
          `}
          title={isAudioEnabled ? 'Mute' : 'Enable Voice'}
        >
          {isAudioEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isAudioEnabled ? (currentLanguage === 'ko' ? '음성' : 'Voice') : (currentLanguage === 'ko' ? '음소거' : 'Muted')}
          </span>
        </button>

        {/* PDF 다운로드 */}
        {meta.pdfUrl && (
          <a
            href={meta.pdfUrl}
            download
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </a>
        )}

        {/* 닫기 버튼 */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            aria-label={currentLanguage === 'ko' ? '닫기' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

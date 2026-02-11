/**
 * WelcomeScreen Component
 * 대화가 없을 때 표시되는 환영 화면 (리디자인)
 */

import { Bot, Sparkles, Globe, Heart, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onStartChat: () => void;
  onSuggestionClick?: (text: string) => void;
}

export function WelcomeScreen({ onStartChat, onSuggestionClick }: WelcomeScreenProps) {
  const { t } = useTranslation('landing');

  const features = [
    {
      icon: Globe,
      title: t('aiHub.features.multilingual.title', '다국어 지원'),
      description: t(
        'aiHub.features.multilingual.description',
        '한국어, 영어 등 다양한 언어로 대화할 수 있습니다.'
      ),
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      icon: Sparkles,
      title: t('aiHub.features.free.title', '무료 사용'),
      description: t(
        'aiHub.features.free.description',
        '일일 50회까지 무료로 AI와 대화할 수 있습니다.'
      ),
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      icon: Heart,
      title: t('aiHub.features.kindness.title', 'Kindness Protocol'),
      description: t(
        'aiHub.features.kindness.description',
        '친절한 AI로 세상의 모든 사람을 연결합니다.'
      ),
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
      iconColor: 'text-rose-400',
    },
  ];

  const suggestions = [
    {
      text: t('aiHub.suggestions.coding', '코드 작성을 도와주세요'),
      icon: '💻',
    },
    {
      text: t('aiHub.suggestions.explain', '이 개념을 쉽게 설명해주세요'),
      icon: '📖',
    },
    {
      text: t('aiHub.suggestions.translate', '이 문장을 번역해주세요'),
      icon: '🌐',
    },
    {
      text: t('aiHub.suggestions.brainstorm', '아이디어를 브레인스토밍 해주세요'),
      icon: '💡',
    },
  ];

  const handleSuggestion = (text: string) => {
    onStartChat();
    if (onSuggestionClick) {
      // 약간의 딜레이로 대화 생성 후 텍스트 삽입
      setTimeout(() => onSuggestionClick(text), 100);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6 sm:py-8 text-center">
      {/* 로고 + 파티클 */}
      <div className="relative mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-neos-blue to-cyan-500 flex items-center justify-center shadow-lg shadow-neos-blue/20">
          <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
      </div>

      {/* 제목 */}
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
        {t('aiHub.welcome.title', '무엇을 도와드릴까요?')}
      </h1>
      <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 max-w-md leading-relaxed">
        {t(
          'aiHub.welcome.description',
          'AlmaNEO AI Hub에 오신 것을 환영합니다. 일일 50회까지 무료로 AI와 대화할 수 있습니다.'
        )}
      </p>

      {/* 기능 소개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-3xl w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-4 bg-gradient-to-br ${feature.color} border rounded-xl transition-transform hover:scale-[1.02]`}
          >
            <feature.icon className={`w-6 h-6 ${feature.iconColor} mx-auto mb-2`} />
            <h3 className="text-sm font-medium text-white mb-1">{feature.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* 추천 질문 */}
      <div className="max-w-2xl w-full">
        <p className="text-xs sm:text-sm text-slate-500 mb-3 font-medium">
          {t('aiHub.suggestions.title', '이런 질문을 해보세요')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestion(suggestion.text)}
              className="flex items-center gap-3 p-3 sm:p-3.5 text-left text-sm text-slate-300 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all group/suggestion"
            >
              <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
              <span className="flex-1 leading-snug">{suggestion.text}</span>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover/suggestion:text-slate-400 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;

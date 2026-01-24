/**
 * WelcomeScreen Component
 * 대화가 없을 때 표시되는 환영 화면
 */

import { Bot, Sparkles, Globe, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const { t } = useTranslation('landing');

  const features = [
    {
      icon: Globe,
      title: t('aiHub.features.multilingual.title', '다국어 지원'),
      description: t(
        'aiHub.features.multilingual.description',
        '한국어, 영어 등 다양한 언어로 대화할 수 있습니다.'
      ),
    },
    {
      icon: Sparkles,
      title: t('aiHub.features.free.title', '무료 사용'),
      description: t(
        'aiHub.features.free.description',
        '일일 50회까지 무료로 AI와 대화할 수 있습니다.'
      ),
    },
    {
      icon: Heart,
      title: t('aiHub.features.kindness.title', 'Kindness Protocol'),
      description: t(
        'aiHub.features.kindness.description',
        '친절한 AI로 세상의 모든 사람을 연결합니다.'
      ),
    },
  ];

  const suggestions = [
    t('aiHub.suggestions.coding', '코드 작성을 도와주세요'),
    t('aiHub.suggestions.explain', '이 개념을 쉽게 설명해주세요'),
    t('aiHub.suggestions.translate', '이 문장을 번역해주세요'),
    t('aiHub.suggestions.brainstorm', '아이디어를 브레인스토밍 해주세요'),
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      {/* 로고 */}
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-neos-blue to-cyan-500 flex items-center justify-center">
        <Bot className="w-10 h-10 text-white" />
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-white mb-2">
        {t('aiHub.welcome.title', '무엇을 도와드릴까요?')}
      </h1>
      <p className="text-slate-400 mb-8 max-w-md">
        {t(
          'aiHub.welcome.description',
          'AlmaNEO AI Hub에 오신 것을 환영합니다. 일일 50회까지 무료로 AI와 대화할 수 있습니다.'
        )}
      </p>

      {/* 기능 소개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl"
          >
            <feature.icon className="w-6 h-6 text-neos-blue mx-auto mb-2" />
            <h3 className="text-sm font-medium text-white mb-1">{feature.title}</h3>
            <p className="text-xs text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* 추천 질문 */}
      <div className="max-w-2xl w-full">
        <p className="text-sm text-slate-500 mb-3">
          {t('aiHub.suggestions.title', '이런 질문을 해보세요')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={onStartChat}
              className="p-3 text-left text-sm text-slate-300 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;

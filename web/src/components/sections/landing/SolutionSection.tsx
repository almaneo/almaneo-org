import { BarChart3, Bot, Heart, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText, KindnessTerm } from '../../ui';
import solutionBackground from '../../../assets/images/04.webp';

interface SolutionData {
  id: string;
  icon: LucideIcon;
  titleKey?: string;
  subtitleKey?: string;
  itemKeys: Array<{ key: string; termKey?: string }>;
  color: string;
  heartbeat?: boolean;
}

const solutionsData: SolutionData[] = [
  {
    id: 'gaii',
    icon: BarChart3,
    titleKey: 'gaii',
    itemKeys: [
      { key: 'item1' },
      { key: 'item2' },
      { key: 'item3', termKey: 'blockchain' },
    ],
    color: '#60a5fa',
  },
  {
    id: 'aiHub',
    icon: Bot,
    subtitleKey: 'depin',
    itemKeys: [
      { key: 'item1' },
      { key: 'item2' },
      { key: 'item3' },
    ],
    color: '#4ade80',
  },
  {
    id: 'kindness',
    icon: Heart,
    titleKey: 'kindnessProtocol',
    itemKeys: [
      { key: 'item1', termKey: 'kindnessScore' },
      { key: 'item2', termKey: 'jeongSbt' },
      { key: 'item3' },
    ],
    color: '#FB923C',
    heartbeat: true,
  },
];

export function SolutionSection() {
  const { t } = useTranslation('landing');

  return (
    <Section id="solution" className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={solutionBackground}
          alt="Solution Background"
          className="w-full h-full object-cover"
        />
        {/* Cool teal/blue overlay for solution theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-teal-950/70 to-slate-950/90" />
      </div>

      <Container className="relative z-10">
        <SectionHeader
          tag={t('solution.title')}
          tagColor="cold"
          title={
            <>
              {t('solution.subtitle').split(' ')[0]} <GradientText>{t('solution.subtitle').split(' ').slice(1).join(' ')}</GradientText>
            </>
          }
          subtitle={t('solution.description')}
        />

        <div className="grid md:grid-cols-3 gap-6">
          {solutionsData.map((s) => {
            const Icon = s.icon;
            return (
              <GlassCard
                key={s.id}
                hover
                className="group"
                style={{ borderColor: `${s.color}30` }}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${s.heartbeat ? 'animate-heartbeat' : ''}`}
                  style={{ background: `${s.color}15` }}
                >
                  <Icon
                    className="w-6 h-6 opacity-80"
                    style={{ color: s.color }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-1" style={{ color: s.color }}>
                  {s.titleKey ? (
                    <KindnessTerm termKey={s.titleKey}>{t(`solution.solutions.${s.id}.title`)}</KindnessTerm>
                  ) : (
                    t(`solution.solutions.${s.id}.title`)
                  )}
                </h3>
                <p className="text-sm mb-4 text-text-subtle">
                  {s.subtitleKey ? (
                    <KindnessTerm termKey={s.subtitleKey}>{t(`solution.solutions.${s.id}.subtitle`)}</KindnessTerm>
                  ) : (
                    t(`solution.solutions.${s.id}.subtitle`)
                  )}
                </p>
                <p className="mb-5 text-text-secondary">{t(`solution.solutions.${s.id}.description`)}</p>

                {/* Features List */}
                <ul className="space-y-2">
                  {s.itemKeys.map((item) => (
                    <li key={item.key} className="flex items-center gap-2 text-sm text-text-muted">
                      <Check className="w-4 h-4 opacity-60 flex-shrink-0" style={{ color: s.color }} strokeWidth={2} />
                      {item.termKey ? (
                        <KindnessTerm termKey={item.termKey}>{t(`solution.solutions.${s.id}.items.${item.key}`)}</KindnessTerm>
                      ) : (
                        t(`solution.solutions.${s.id}.items.${item.key}`)
                      )}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default SolutionSection;

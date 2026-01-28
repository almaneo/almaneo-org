import { useTranslation } from 'react-i18next';
import { Check, Clock, Circle } from 'lucide-react';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText } from '../../ui';

type PhaseStatus = 'completed' | 'in-progress' | 'upcoming';

interface PhaseData {
  id: string;
  status: PhaseStatus;
  color: string;
  itemKeys: string[];
  itemStatuses: PhaseStatus[];
}

const phasesData: PhaseData[] = [
  {
    id: 'foundation',
    status: 'completed',
    color: '#4ade80',
    itemKeys: ['whitepaper', 'contracts', 'legal', 'community'],
    itemStatuses: ['completed', 'completed', 'completed', 'completed'],
  },
  {
    id: 'testnet',
    status: 'completed',
    color: '#60a5fa',
    itemKeys: ['deployment', 'audit', 'aiHub', 'kindness'],
    itemStatuses: ['completed', 'completed', 'completed', 'completed'],
  },
  {
    id: 'tge',
    status: 'in-progress',
    color: '#FB923C',
    itemKeys: ['tge', 'mainnet', 'dex', 'aiHubLaunch'],
    itemStatuses: ['in-progress', 'in-progress', 'upcoming', 'upcoming'],
  },
  {
    id: 'expansion',
    status: 'upcoming',
    color: '#a78bfa',
    itemKeys: ['mining', 'depin', 'gaii', 'airdrop'],
    itemStatuses: ['upcoming', 'upcoming', 'upcoming', 'upcoming'],
  },
  {
    id: 'expo',
    status: 'upcoming',
    color: '#f472b6',
    itemKeys: ['event', 'university', 'partners', 'report'],
    itemStatuses: ['upcoming', 'upcoming', 'upcoming', 'upcoming'],
  },
  {
    id: 'global',
    status: 'upcoming',
    color: '#06b6d4',
    itemKeys: ['dao', 'users', 'kinfri', 'decentralized'],
    itemStatuses: ['upcoming', 'upcoming', 'upcoming', 'upcoming'],
  },
];

function StatusIcon({ status }: { status: PhaseStatus }) {
  if (status === 'completed') {
    return <Check className="w-4 h-4 text-green-400" strokeWidth={2} />;
  }
  if (status === 'in-progress') {
    return <Clock className="w-4 h-4 text-jeong-orange animate-pulse" strokeWidth={2} />;
  }
  return <Circle className="w-4 h-4 text-text-subtle" strokeWidth={2} />;
}

export function RoadmapSection() {
  const { t } = useTranslation('landing');

  return (
    <Section id="roadmap">
      <Container>
        <SectionHeader
          tag={t('roadmap.tag')}
          tagColor="warm"
          title={
            <>
              <GradientText variant="warm">{t('roadmap.titleHighlight')}</GradientText>{t('roadmap.titleSuffix')}
            </>
          }
          subtitle={t('roadmap.subtitleFull')}
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-400 via-jeong-orange to-purple-400 opacity-30" />

          <div className="space-y-4 sm:space-y-8 lg:space-y-0">
            {phasesData.map((phase, i) => (
              <div
                key={i}
                className={`lg:grid lg:grid-cols-2 lg:gap-8 ${
                  i % 2 === 0 ? '' : 'lg:direction-rtl'
                }`}
              >
                {/* Content Side */}
                <div
                  className={`${
                    i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:col-start-2 lg:pl-12'
                  }`}
                >
                  <GlassCard
                    padding="lg"
                    className={`relative ${
                      phase.status === 'in-progress'
                        ? 'border-jeong-orange/50'
                        : ''
                    }`}
                  >
                    {/* Phase Indicator (Desktop) */}
                    <div
                      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full items-center justify-center"
                      style={{
                        background: phase.color,
                        [i % 2 === 0 ? 'right' : 'left']: '-2.5rem',
                      }}
                    >
                      {phase.status === 'in-progress' && (
                        <span className="absolute w-8 h-8 rounded-full animate-ping opacity-30" style={{ background: phase.color }} />
                      )}
                    </div>

                    {/* Header */}
                    <div className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: `${phase.color}20`, color: phase.color }}
                      >
                        {t(`roadmap.phases.${phase.id}.period`)}
                      </span>
                      <h3 className="text-xl font-bold">{t(`roadmap.phases.${phase.id}.title`)}</h3>
                    </div>

                    {/* Items */}
                    <ul className={`space-y-2 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                      {phase.itemKeys.map((itemKey, j) => (
                        <li
                          key={j}
                          className={`flex items-center gap-2 text-sm ${
                            i % 2 === 0 ? 'lg:flex-row-reverse' : ''
                          } ${
                            phase.itemStatuses[j] === 'completed'
                              ? 'text-text-secondary'
                              : phase.itemStatuses[j] === 'in-progress'
                              ? 'text-jeong-orange'
                              : 'text-text-muted'
                          }`}
                        >
                          <StatusIcon status={phase.itemStatuses[j]} />
                          <span>{t(`roadmap.phases.${phase.id}.items.${itemKey}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>

                {/* Empty Side (for layout) */}
                {i % 2 === 0 ? (
                  <div className="hidden lg:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-8 sm:mt-12">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400" strokeWidth={2} />
            <span className="text-text-muted">{t('roadmap.legend.completed')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-jeong-orange" strokeWidth={2} />
            <span className="text-text-muted">{t('roadmap.legend.inProgress')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Circle className="w-4 h-4 text-text-subtle" strokeWidth={2} />
            <span className="text-text-muted">{t('roadmap.legend.upcoming')}</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default RoadmapSection;

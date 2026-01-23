import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText } from '../../ui';
import problemBackground from '../../../assets/images/02.webp';

export function ProblemSection() {
  const { t } = useTranslation('landing');

  const timeKeys = ['morning', 'afternoon', 'evening'] as const;

  return (
    <Section id="problem" className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={problemBackground}
          alt="Problem Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for problem theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90" />
      </div>

      <Container className="relative z-10">
        <SectionHeader
          tag={t('problem.title')}
          tagColor="warm"
          title={
            <>
              {t('problem.subtitle').split(' ')[0]} <GradientText>{t('problem.subtitle').split(' ').slice(1).join(' ')}</GradientText>
            </>
          }
          subtitle={t('problem.description')}
        />

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Developed Country Card */}
          <GlassCard border="cold" className="border-cold-blue-300/30">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🇺🇸</span>
              <div>
                <h3 className="text-xl font-bold text-cold-blue-300">{t('problem.cards.developed.title')}</h3>
                <p className="text-sm text-text-subtle">{t('problem.cards.developed.subtitle')}</p>
              </div>
            </div>
            <div className="space-y-3">
              {timeKeys.map((timeKey) => (
                <div key={timeKey} className="flex items-center gap-3 text-text-secondary">
                  <span className="text-semantic-success">✓</span>
                  <span>{t(`problem.timeLabels.${timeKey}`)}: {t(`problem.activities.developed.${timeKey}`)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="text-xl font-bold text-semantic-success">{t('problem.cards.developed.result')}</div>
            </div>
          </GlassCard>

          {/* Global South Card */}
          <GlassCard border="warm" className="border-warm-orange-300/30">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🌍</span>
              <div>
                <h3 className="text-xl font-bold text-warm-orange-300">{t('problem.cards.globalSouth.title')}</h3>
                <p className="text-sm text-text-subtle">{t('problem.cards.globalSouth.subtitle')}</p>
              </div>
            </div>
            <div className="space-y-3">
              {timeKeys.map((timeKey) => (
                <div key={timeKey} className="flex items-center gap-3 text-text-secondary">
                  <span className="text-semantic-error">✗</span>
                  <span>{t(`problem.timeLabels.${timeKey}`)}: {t(`problem.activities.globalSouth.${timeKey}`)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="text-xl font-bold text-semantic-error">{t('problem.cards.globalSouth.result')}</div>
            </div>
          </GlassCard>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['stat1', 'stat2', 'stat3', 'stat4'] as const).map((statKey, i) => {
            const colors = ['#f87171', '#FB923C', '#facc15', '#60a5fa'];
            return (
              <div key={statKey} className="stat-card">
                <div className="stat-value" style={{ color: colors[i] }}>
                  {t(`problem.statistics.${statKey}.value`)}
                </div>
                <div className="stat-label">{t(`problem.statistics.${statKey}.label`)}</div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default ProblemSection;

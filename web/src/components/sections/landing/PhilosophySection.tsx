import { Globe, User, Cpu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard } from '../../ui';
import philosophyBackground from '../../../assets/images/03.webp';

interface Principle {
  id: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

const principlesData: Principle[] = [
  {
    id: 'people',
    icon: Globe,
    color: '#60a5fa',
    gradient: 'blue',
  },
  {
    id: 'individual',
    icon: User,
    color: '#FB923C',
    gradient: 'orange',
  },
  {
    id: 'human',
    icon: Cpu,
    color: '#4ade80',
    gradient: 'green',
  },
];

const gradientStyles = {
  blue: 'rgba(96,165,250,0.1)',
  orange: 'rgba(251,146,60,0.1)',
  green: 'rgba(74,222,128,0.1)',
};

export function PhilosophySection() {
  const { t } = useTranslation('landing');

  return (
    <Section
      id="philosophy"
      overlay="warm"
      className="relative"
      background={
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={philosophyBackground}
            alt="Philosophy Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-orange-950/75 to-slate-950/85" />
        </div>
      }
    >
      <Container>
        <SectionHeader
          tag={t('philosophy.title')}
          tagColor="warm"
          title={
            <>
              <span className="text-jeong-orange">{t('philosophy.jeong')}</span> {t('philosophy.subtitle')}
            </>
          }
          subtitle={t('philosophy.description')}
        />

        {/* Main Jeong Card */}
        <GlassCard padding="xl" className="mb-12 relative overflow-hidden">
          {/* Background Glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FF6B00, transparent)' }}
          />
          <div className="relative z-10">
            <div className="text-6xl mb-5 text-jeong-orange font-serif">情</div>
            <p className="text-xl leading-relaxed mb-5 text-text-primary">
              <span className="text-jeong-orange font-semibold">{t('philosophy.jeongCard.title')}</span>
              {t('philosophy.jeongCard.description1')}
              <br />
              {t('philosophy.jeongCard.description2')}
            </p>
            <p className="text-lg text-text-muted">
              {t('philosophy.jeongCard.footer')}
              <span className="text-cold-blue-300">{t('philosophy.jeongCard.footerHighlight')}</span>
              {t('philosophy.jeongCard.footerEnd')}
            </p>
          </div>
        </GlassCard>

        {/* Principles */}
        <div className="grid md:grid-cols-3 gap-6">
          {principlesData.map((p) => {
            const Icon = p.icon;
            return (
              <GlassCard
                key={p.id}
                padding="md"
                hover
                className="rounded-3xl"
                style={{
                  background: `linear-gradient(180deg, ${gradientStyles[p.gradient as keyof typeof gradientStyles]}, transparent)`,
                }}
              >
                <Icon
                  className="w-8 h-8 mb-4 opacity-70"
                  style={{ color: p.color }}
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-bold mb-2">{t(`philosophy.principles.${p.id}.title`)}</h3>
                <p className="text-sm text-text-muted">{t(`philosophy.principles.${p.id}.description`)}</p>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default PhilosophySection;

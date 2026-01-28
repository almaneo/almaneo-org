import { Link } from 'react-router-dom';
import { Coins, Gift, Image, Gamepad2, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText, KindnessTerm } from '../../ui';
import ecosystemBackground from '../../../assets/images/06.webp';

interface EcosystemFeature {
  key: string;
  termKey?: string;
}

interface EcosystemItemData {
  id: string;
  icon: LucideIcon;
  features: EcosystemFeature[];
  link: string;
  color: string;
  gradient: string;
  external?: boolean;
}

const ecosystemItemsData: EcosystemItemData[] = [
  {
    id: 'staking',
    icon: Coins,
    features: [
      { key: 'apy', termKey: 'apy' },
      { key: 'tier' },
      { key: 'bonus', termKey: 'kindnessScore' },
    ],
    link: '/staking',
    color: '#4ade80',
    gradient: 'from-green-500/20 to-transparent',
  },
  {
    id: 'airdrop',
    icon: Gift,
    features: [
      { key: 'task' },
      { key: 'community' },
      { key: 'protocol', termKey: 'kindnessProtocol' },
    ],
    link: '/airdrop',
    color: '#FB923C',
    gradient: 'from-orange-500/20 to-transparent',
  },
  {
    id: 'nft',
    icon: Image,
    features: [
      { key: 'gasless', termKey: 'gasless' },
      { key: 'auction' },
      { key: 'royalty', termKey: 'royalty' },
    ],
    link: 'https://nft.almaneo.org',
    color: '#a78bfa',
    gradient: 'from-purple-500/20 to-transparent',
    external: true,
  },
  {
    id: 'game',
    icon: Gamepad2,
    features: [
      { key: 'pool' },
      { key: 'quest' },
      { key: 'leaderboard' },
    ],
    link: 'https://game.almaneo.org',
    color: '#60a5fa',
    gradient: 'from-blue-500/20 to-transparent',
    external: true,
  },
];

export function EcosystemSection() {
  const { t } = useTranslation('landing');

  return (
    <Section
      id="ecosystem"
      className="relative"
      background={
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={ecosystemBackground}
            alt="Ecosystem Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-blue-950/80 to-slate-950/90" />
        </div>
      }
    >
      <Container>
        <SectionHeader
          tag={t('ecosystem.title')}
          tagColor="cold"
          title={
            <>
              AlmaNEO <GradientText>{t('ecosystem.title')}</GradientText>
            </>
          }
          subtitle={t('ecosystem.subtitle')}
        />

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {ecosystemItemsData.map((item, i) => {
            const Icon = item.icon;
            const title = t(`ecosystem.${item.id}.title`);
            const description = t(`ecosystem.${item.id}.description`);
            const linkText = t(`ecosystem.${item.id}.linkText`);

            const CardContent = (
              <GlassCard
                hover
                className={`group h-full bg-gradient-to-b ${item.gradient}`}
                style={{ borderColor: `${item.color}30` }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${item.color}15` }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: item.color }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2" style={{ color: item.color }}>
                  <KindnessTerm termKey={item.id}>{title}</KindnessTerm>
                </h3>
                <p className="text-text-secondary mb-4 leading-relaxed">
                  {description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.features.map((feature, j) => {
                    const featureText = t(`ecosystem.${item.id}.features.${feature.key}`);
                    return (
                      <span
                        key={j}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 text-text-muted"
                      >
                        {feature.termKey ? (
                          <KindnessTerm termKey={feature.termKey}>{featureText}</KindnessTerm>
                        ) : (
                          featureText
                        )}
                      </span>
                    );
                  })}
                </div>

                {/* Link */}
                <div
                  className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
                  style={{ color: item.color }}
                >
                  {linkText}
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </div>
              </GlassCard>
            );

            return item.external ? (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {CardContent}
              </a>
            ) : (
              <Link key={i} to={item.link} className="block">
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-muted mb-4">
            {t('ecosystem.bottomCta').split('Web3Auth')[0]}
            <KindnessTerm termKey="web3auth"><span className="text-neos-blue">Web3Auth</span></KindnessTerm>
            {t('ecosystem.bottomCta').split('Web3Auth')[1]}
          </p>
          <div className="flex justify-center gap-3 text-xs text-text-subtle">
            <span className="px-3 py-1.5 rounded-full bg-white/5">Google</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5">Facebook</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5">X (Twitter)</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5">MetaMask</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default EcosystemSection;

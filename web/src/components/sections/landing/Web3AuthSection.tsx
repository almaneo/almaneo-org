import { Fingerprint, Wallet, Shield, Zap, Chrome, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText } from '../../ui';
import onboardingBackground from '../../../assets/images/05.webp';

interface LoginMethod {
  icon: LucideIcon;
  name: string;
  color: string;
}

interface Benefit {
  id: string;
  icon: LucideIcon;
  color: string;
}

const loginMethods: LoginMethod[] = [
  { icon: Chrome, name: 'Google', color: '#4285F4' },
  { icon: MessageSquare, name: 'Facebook', color: '#1877F2' },
  { icon: MessageSquare, name: 'X', color: '#1DA1F2' },
  { icon: Wallet, name: 'MetaMask', color: '#F6851B' },
];

const benefitsData: Benefit[] = [
  {
    id: 'social',
    icon: Fingerprint,
    color: '#60a5fa',
  },
  {
    id: 'secure',
    icon: Shield,
    color: '#4ade80',
  },
  {
    id: 'gasless',
    icon: Zap,
    color: '#FB923C',
  },
];

export function Web3AuthSection() {
  const { t } = useTranslation('landing');

  return (
    <Section id="web3auth" overlay="cold" className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={onboardingBackground}
          alt="Onboarding Background"
          className="w-full h-full object-cover"
        />
        {/* Sleek blue overlay for onboarding theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-blue-950/70 to-slate-950/90" />
      </div>

      <Container className="relative z-10">
        <SectionHeader
          tag={t('web3auth.title')}
          tagColor="cold"
          title={
            <>
              <GradientText variant="cold">Web3</GradientText> {t('web3auth.subtitle')}
            </>
          }
          subtitle={t('web3auth.subtitle')}
        />

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Login Demo */}
          <GlassCard padding="xl" className="relative overflow-hidden">
            {/* Background Glow */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ background: '#0052FF' }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-neos-blue/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-neos-blue" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('web3auth.loginDemo.title')}</h3>
                  <p className="text-sm text-text-subtle">{t('web3auth.loginDemo.description')}</p>
                </div>
              </div>

              {/* Login Methods Grid */}
              <div className="grid grid-cols-2 gap-3">
                {loginMethods.map((method, i) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${method.color}20` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: method.color }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                        {method.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-text-subtle">{t('web3auth.loginDemo.or')}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Wallet Connect */}
              <button className="w-full p-4 rounded-xl border border-white/10 hover:border-neos-blue/50 bg-white/5 hover:bg-neos-blue/10 transition-all flex items-center justify-center gap-3 group">
                <Wallet className="w-5 h-5 text-text-muted group-hover:text-neos-blue transition-colors" strokeWidth={1.5} />
                <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
                  {t('web3auth.loginDemo.connectWallet')}
                </span>
              </button>
            </div>
          </GlassCard>

          {/* Right: Benefits */}
          <div className="space-y-5">
            {benefitsData.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <GlassCard
                  key={benefit.id}
                  padding="md"
                  hover
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${benefit.color}15` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: benefit.color }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{t(`web3auth.benefits.${benefit.id}.title`)}</h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {t(`web3auth.benefits.${benefit.id}.description`)}
                    </p>
                  </div>
                </GlassCard>
              );
            })}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neos-blue">{t('web3auth.stats.loginTime.value')}</div>
                <div className="text-xs text-text-subtle">{t('web3auth.stats.loginTime.label')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-jeong-orange">{t('web3auth.stats.gasFee.value')}</div>
                <div className="text-xs text-text-subtle">{t('web3auth.stats.gasFee.label')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{t('web3auth.stats.ownership.value')}</div>
                <div className="text-xs text-text-subtle">{t('web3auth.stats.ownership.label')}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Web3AuthSection;

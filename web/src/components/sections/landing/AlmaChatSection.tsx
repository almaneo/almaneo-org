import { Languages, MessageCircle, Heart, Award, Download } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText } from '../../ui';
import almachatBackground from '../../../assets/images/07.webp';

// Google Play SVG icon
const GooglePlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.396 13l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
  </svg>
);

// Apple App Store SVG icon
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

interface FeatureData {
  id: string;
  icon: LucideIcon;
  color: string;
}

const featuresData: FeatureData[] = [
  { id: 'translate', icon: Languages, color: '#60a5fa' },
  { id: 'meetupChat', icon: MessageCircle, color: '#FB923C' },
  { id: 'kindness', icon: Heart, color: '#f87171' },
  { id: 'ambassador', icon: Award, color: '#a78bfa' },
];

export function AlmaChatSection() {
  const { t } = useTranslation('landing');

  return (
    <Section
      id="almachat"
      className="relative"
      background={
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={almachatBackground}
            alt="AlmaChat Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-orange-950/70 to-slate-950/90" />
        </div>
      }
    >
      <Container>
        <SectionHeader
          tag={t('almachat.tag')}
          tagColor="warm"
          title={
            <>
              {t('almachat.titleSuffix')}{' '}
              <GradientText variant="warm">{t('almachat.title')}</GradientText>
            </>
          }
          subtitle={t('almachat.subtitle')}
        />

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div
                className="absolute -inset-10 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)' }}
              />

              {/* Phone frame */}
              <div className="relative w-[260px] h-[520px] rounded-[2.5rem] border-2 border-white/15 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-sm">
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden relative">
                  {/* Status bar */}
                  <div className="flex items-center justify-center pt-2">
                    <div className="w-20 h-5 rounded-full bg-black/60" />
                  </div>

                  {/* App header */}
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-jeong-orange/30 flex items-center justify-center">
                        <MessageCircle className="w-3.5 h-3.5 text-jeong-orange" strokeWidth={2} />
                      </div>
                      <span className="text-xs font-semibold text-white/80">AlmaChat</span>
                      <div className="ml-auto flex gap-1">
                        <Languages className="w-3.5 h-3.5 text-white/30" />
                      </div>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="p-3 space-y-3 mt-1">
                    {/* Message 1 - Korean */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-neos-blue/30 flex-shrink-0" />
                      <div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]">
                        <p className="text-[11px] text-white/70">{t('almachat.phone.greeting1')}</p>
                        <p className="text-[9px] text-white/30 mt-0.5 italic">{t('almachat.phone.greeting1Translation')}</p>
                      </div>
                    </div>

                    {/* Message 2 - Vietnamese (mine) */}
                    <div className="flex gap-2 items-end justify-end">
                      <div className="bg-neos-blue/20 rounded-2xl rounded-br-sm px-3 py-2 max-w-[75%]">
                        <p className="text-[11px] text-white/70">{t('almachat.phone.greeting2')}</p>
                        <p className="text-[9px] text-white/30 mt-0.5 italic">{t('almachat.phone.greeting2Translation')}</p>
                      </div>
                    </div>

                    {/* Message 3 - French */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-purple-500/30 flex-shrink-0" />
                      <div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]">
                        <p className="text-[11px] text-white/70">{t('almachat.phone.greeting3')}</p>
                        <p className="text-[9px] text-white/30 mt-0.5 italic">{t('almachat.phone.greeting3Translation')}</p>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-green-500/30 flex-shrink-0" />
                      <div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2.5">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom tab bar */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-around items-center py-2 bg-white/5 rounded-xl">
                      <div className="w-5 h-5 rounded bg-white/10" />
                      <div className="w-5 h-5 rounded bg-jeong-orange/40" />
                      <div className="w-5 h-5 rounded bg-white/10" />
                      <div className="w-5 h-5 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="space-y-4">
            {featuresData.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.id}
                  padding="md"
                  hover
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${feature.color}15` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: feature.color }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{t(`almachat.features.${feature.id}.title`)}</h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {t(`almachat.features.${feature.id}.description`)}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/5">
          <div className="text-center">
            <div className="text-2xl font-bold text-neos-blue">{t('almachat.stats.languages.value')}</div>
            <div className="text-xs text-text-subtle">{t('almachat.stats.languages.label')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-jeong-orange">{t('almachat.stats.translate.value')}</div>
            <div className="text-xs text-text-subtle">{t('almachat.stats.translate.label')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{t('almachat.stats.kindness.value')}</div>
            <div className="text-xs text-text-subtle">{t('almachat.stats.kindness.label')}</div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="mt-10 text-center">
          <p className="text-text-secondary mb-6 font-medium">{t('almachat.download.title')}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Google Play */}
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group relative"
            >
              <GooglePlayIcon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
              <div className="text-left">
                <div className="text-[10px] text-text-subtle uppercase tracking-wider">{t('almachat.download.comingSoon')}</div>
                <div className="text-sm font-semibold text-white">{t('almachat.download.googlePlay')}</div>
              </div>
            </a>

            {/* App Store */}
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group relative"
            >
              <AppleIcon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
              <div className="text-left">
                <div className="text-[10px] text-text-subtle uppercase tracking-wider">{t('almachat.download.comingSoon')}</div>
                <div className="text-sm font-semibold text-white">{t('almachat.download.appStore')}</div>
              </div>
            </a>
          </div>

          {/* Direct APK Download */}
          <div className="mt-4">
            <a
              href="https://github.com/almaneo/almaneo-org/releases/download/v1.0.0/app-release.apk"
              download
              className="inline-flex items-center gap-2 text-sm text-jeong-orange hover:text-orange-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('almachat.download.directApk')}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default AlmaChatSection;

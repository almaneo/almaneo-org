import { Heart, Twitter, MessageCircle, Send, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { HeartbeatLine, GlassCard, Button, GradientText } from '../../ui';

const socialLinks = [
  { icon: Twitter, label: 'Twitter' },
  { icon: MessageCircle, label: 'Discord' },
  { icon: Send, label: 'Telegram' },
  { icon: Github, label: 'GitHub' },
];

export function CTASection() {
  const { t } = useTranslation('landing');

  return (
    <Section overlay="warm-bottom">
      <Container size="md" className="text-center">
        {/* Heartbeat Line */}
        <div className="mb-6 opacity-60">
          <HeartbeatLine className="w-full h-14" />
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          <GradientText>{t('cta.title')}</GradientText>
        </h2>

        {/* Quote */}
        <GlassCard padding="lg" className="mb-10">
          <blockquote className="text-lg md:text-xl italic text-text-secondary">
            {t('cta.description')}
          </blockquote>
        </GlassCard>

        {/* CTA Button */}
        <Button
          size="lg"
          glow
          heartbeat
          className="text-lg sm:text-xl mb-10 w-full sm:w-auto"
          icon={<Heart className="w-5 h-5" strokeWidth={2} />}
        >
          {t('cta.button')}
        </Button>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          {socialLinks.map((social, i) => {
            const Icon = social.icon;
            return (
              <button
                key={i}
                className="social-btn"
                aria-label={social.label}
              >
                <Icon className="w-5 h-5 opacity-70" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default CTASection;

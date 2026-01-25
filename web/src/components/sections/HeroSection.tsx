import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, FileText, ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HeartbeatLine, AnimatedCounter, Button } from '../ui';
import heroBackground from '../../assets/images/01.webp';

// SNS Icons (Brand icons as SVG)
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

// SNS Links Data (Telegram, YouTube 미정으로 숨김)
const snsLinks = [
  {
    name: 'Twitter / X',
    icon: TwitterXIcon,
    url: 'https://x.com/almaneo_org',
    color: 'hover:bg-slate-800',
    hoverColor: 'group-hover:text-white',
  },
  {
    name: 'Discord',
    icon: DiscordIcon,
    url: 'https://discord.gg/JkRNuj7aYd',
    color: 'hover:bg-[#5865F2]',
    hoverColor: 'group-hover:text-[#5865F2]',
  },
  {
    name: 'TikTok',
    icon: TiktokIcon,
    url: 'https://www.tiktok.com/@almaneo',
    color: 'hover:bg-slate-800',
    hoverColor: 'group-hover:text-white',
  },
];

// SNS Modal Component
const SnsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation('landing');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {t('hero.snsModal.title', '커뮤니티에 참여하세요')}
          </h3>
          <p className="text-sm text-slate-400">
            {t('hero.snsModal.description', 'AlmaNEO의 최신 소식을 받아보세요')}
          </p>
        </div>

        {/* SNS Links */}
        <div className="space-y-3">
          {snsLinks.map((sns) => (
            <a
              key={sns.name}
              href={sns.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 transition-all duration-200 ${sns.color} hover:border-transparent`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700/50 transition-colors group-hover:bg-white/10`}>
                <sns.icon className={`w-5 h-5 text-slate-300 transition-colors ${sns.hoverColor}`} />
              </div>
              <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                {sns.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const { t } = useTranslation('landing');
  const [isSnsModalOpen, setIsSnsModalOpen] = useState(false);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20 px-6">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroBackground}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90" />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, #0052FF 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 animate-pulse-slow"
          style={{
            background: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)',
            animationDelay: '1s'
          }}
        />
      </div>

      <div className="text-center max-w-4xl mx-auto relative z-10">
        {/* Heartbeat Line */}
        <div className="mb-8 opacity-70">
          <HeartbeatLine className="w-full h-16" />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight font-montserrat">
          <span className="block text-blue-400">Cold Code,</span>
          <span className="block gradient-text">Warm Soul.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-3 font-light text-slate-300">
          {t('hero.subtitle')}
        </p>
        <p className="text-lg md:text-xl mb-10 text-slate-400">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <a href="https://game.almaneo.org" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button
              size="lg"
              glow
              icon={<Globe className="w-5 h-5" strokeWidth={1.5} />}
              className="w-full"
            >
              Play AI Hub
            </Button>
          </a>
          <Button
            size="lg"
            variant="secondary"
            icon={<Globe className="w-5 h-5" strokeWidth={1.5} />}
            onClick={() => setIsSnsModalOpen(true)}
            className="w-full sm:w-auto"
          >
            {t('hero.cta.joinMovement')}
          </Button>
          <Link to="/whitepaper" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              icon={<FileText className="w-5 h-5" strokeWidth={1.5} />}
              className="w-full"
            >
              {t('hero.cta.whitepaper')}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400">
              <AnimatedCounter end={8} suffix="B" />
            </div>
            <div className="text-xs mt-1 text-slate-500">{t('hero.stats.totalSupply')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-jeong-orange">
              <AnimatedCounter end={8} suffix="B" />
            </div>
            <div className="text-xs mt-1 text-slate-500">{t('hero.stats.forHumans')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-400">
              100+
            </div>
            <div className="text-xs mt-1 text-slate-500">{t('hero.stats.countries')}</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* SNS Modal */}
      <SnsModal isOpen={isSnsModalOpen} onClose={() => setIsSnsModalOpen(false)} />
    </section>
  );
};

export default HeroSection;

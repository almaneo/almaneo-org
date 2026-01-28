import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText } from '../../ui';

interface PartnerData {
  id: string;
  logo: string;
  color: string;
}

const partnersData: PartnerData[] = [
  { id: 'polygon', logo: 'POL', color: '#8247E5' },
  { id: 'web3auth', logo: 'W3A', color: '#0364FF' },
  { id: 'biconomy', logo: 'BIO', color: '#FF4E17' },
  { id: 'supabase', logo: 'SB', color: '#3ECF8E' },
  { id: 'vercel', logo: '▲', color: '#FFFFFF' },
  { id: 'openzeppelin', logo: 'OZ', color: '#4E5EE4' },
  { id: 'ipfs', logo: 'IPFS', color: '#65C2CB' },
];

const integrationKeys = ['erc20', 'erc721', 'erc1155', 'erc4907', 'erc2771', 'uups'];

const integrationNames: Record<string, string> = {
  erc20: 'ERC-20',
  erc721: 'ERC-721',
  erc1155: 'ERC-1155',
  erc4907: 'ERC-4907',
  erc2771: 'ERC-2771',
  uups: 'UUPS',
};

export function PartnersSection() {
  const { t } = useTranslation('landing');

  return (
    <Section id="partners" overlay="cold">
      <Container>
        <SectionHeader
          tag={t('partners.tag')}
          tagColor="cold"
          title={
            <>
              {t('partners.titlePrefix')}<GradientText variant="cold">{t('partners.titleHighlight')}</GradientText>
            </>
          }
          subtitle={t('partners.subtitleFull')}
        />

        {/* Partners Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-8 sm:mb-16">
          {partnersData.map((partner, i) => (
            <GlassCard
              key={i}
              hover
              padding="md"
              className="flex items-center gap-4"
            >
              {/* Logo */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
                style={{ background: `${partner.color}20`, color: partner.color }}
              >
                {partner.logo}
              </div>

              {/* Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold truncate">{t(`partners.partners.${partner.id}.name`)}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-text-subtle">
                    {t(`partners.partners.${partner.id}.category`)}
                  </span>
                </div>
                <p className="text-sm text-text-muted truncate">
                  {t(`partners.partners.${partner.id}.description`)}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Standards & Integrations */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-secondary mb-6">
            {t('partners.blockchainStandards')}
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {integrationKeys.map((key, i) => (
              <div
                key={i}
                className="px-3 py-2 sm:px-4 rounded-xl bg-white/5 border border-white/10 hover:border-neos-blue/50 transition-colors"
              >
                <span className="text-sm font-mono text-neos-blue">{integrationNames[key]}</span>
                <span className="text-xs text-text-muted ml-1 sm:ml-2 hidden sm:inline">{t(`partners.standards.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership CTA */}
        <div className="mt-12 text-center">
          <GlassCard padding="lg" className="inline-block">
            <p className="text-text-secondary mb-2">
              {t('partners.partnershipCta')}
            </p>
            <p className="text-sm text-text-muted">
              <a href="mailto:partners@almaneo.org" className="text-neos-blue hover:underline">
                partners@almaneo.org
              </a>
              {' '}{t('partners.contactMessage')}
            </p>
          </GlassCard>
        </div>
      </Container>
    </Section>
  );
}

export default PartnersSection;

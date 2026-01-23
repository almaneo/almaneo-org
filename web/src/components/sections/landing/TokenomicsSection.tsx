import { useTranslation } from 'react-i18next';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, KindnessTerm } from '../../ui';

interface TokenInfo {
  labelKey: string;
  value: string;
  termKey?: string;
}

interface Distribution {
  labelKey: string;
  percent: number;
  color: string;
  termKey?: string;
}

const tokenInfoData: TokenInfo[] = [
  { labelKey: 'token', value: 'ALMAN', termKey: 'alman' },
  { labelKey: 'network', value: 'Polygon', termKey: 'polygon' },
  { labelKey: 'standard', value: 'ERC-20', termKey: 'token' },
  { labelKey: 'supply', value: '8B', termKey: 'totalSupply' },
  { labelKey: 'forAll', value: '', termKey: undefined },
];

const distributionData: Distribution[] = [
  { labelKey: 'community', percent: 40, color: '#FB923C' },
  { labelKey: 'foundation', percent: 25, color: '#60a5fa' },
  { labelKey: 'liquidity', percent: 15, color: '#4ade80', termKey: 'liquidity' },
  { labelKey: 'team', percent: 10, color: '#a78bfa' },
  { labelKey: 'grants', percent: 10, color: '#f472b6' },
];

export function TokenomicsSection() {
  const { t } = useTranslation('landing');

  return (
    <Section id="tokenomics" overlay="cold">
      <Container>
        <SectionHeader
          tag={t('tokenomics.subtitle')}
          tagColor="cold"
          title={
            <>
              <span className="text-jeong-orange">{t('tokenomics.forHumansCount')}</span> {t('tokenomics.forHumans').split(',')[0]},{' '}
              <span className="text-cold-blue-300">{t('tokenomics.forHumansCount')}</span> {t('tokenomics.forHumans').split(',')[1]}
            </>
          }
        />

        {/* Token Info */}
        <GlassCard padding="lg" className="mb-10">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {tokenInfoData.map((info) => (
              <div key={info.labelKey}>
                <div className="text-xs mb-1 text-text-subtle">{t(`tokenomics.tokenInfo.${info.labelKey}`)}</div>
                <div className="font-bold">
                  {info.labelKey === 'forAll' ? (
                    t('tokenomics.tokenInfo.forAllValue')
                  ) : info.termKey ? (
                    <KindnessTerm termKey={info.termKey}>{info.value}</KindnessTerm>
                  ) : (
                    info.value
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Distribution */}
        <GlassCard padding="lg">
          <h4 className="text-xl font-bold mb-6 text-center">{t('tokenomics.distribution.title')}</h4>
          <div className="space-y-4">
            {distributionData.map((d) => (
              <div key={d.labelKey}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">
                    {d.termKey ? (
                      <KindnessTerm termKey={d.termKey}>{t(`tokenomics.distribution.${d.labelKey}`)}</KindnessTerm>
                    ) : (
                      t(`tokenomics.distribution.${d.labelKey}`)
                    )}
                  </span>
                  <span className="text-text-subtle">{d.percent}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${d.percent}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}

export default TokenomicsSection;

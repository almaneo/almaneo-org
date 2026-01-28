import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Section, Container } from '../../layout';
import { SectionHeader, GlassCard, GradientText } from '../../ui';

// FAQ 아이템과 카테고리 매핑
const faqItems = [
  { id: 'whatIsAlmaNEO', category: 'general' },
  { id: 'whatIsJeong', category: 'general' },
  { id: 'totalSupply', category: 'token' },
  { id: 'howToGetToken', category: 'token' },
  { id: 'whichBlockchain', category: 'technology' },
  { id: 'noWallet', category: 'technology' },
  { id: 'whatIsJeongSBT', category: 'nft' },
  { id: 'nftMarketplaceFeatures', category: 'nft' },
  { id: 'howStakingWorks', category: 'participation' },
  { id: 'whatIsKindnessGame', category: 'participation' },
];

interface FAQItemProps {
  itemId: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItemComponent({ itemId, isOpen, onToggle }: FAQItemProps) {
  const { t } = useTranslation('landing');

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-start justify-between gap-4 text-left group"
      >
        <div className="flex items-start gap-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-neos-blue/20 text-neos-blue mt-1">
            {t(`faq.items.${itemId}.category`)}
          </span>
          <span className={`font-medium transition-colors ${isOpen ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>
            {t(`faq.items.${itemId}.question`)}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-sm text-text-muted leading-relaxed pl-4 sm:pl-[calc(0.5rem+3.5rem)]">
          {t(`faq.items.${itemId}.answer`)}
        </p>
      </div>
    </div>
  );
}

const categoryKeys = ['general', 'token', 'technology', 'nft', 'participation'];

export function FAQSection() {
  const { t } = useTranslation('landing');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // 같은 카테고리 클릭 시 필터 해제
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      setOpenIndex(null); // 카테고리 변경 시 열린 아이템 닫기
    }
  };

  // 선택된 카테고리에 따라 필터링
  const filteredItems = selectedCategory
    ? faqItems.filter(item => item.category === selectedCategory)
    : faqItems;

  return (
    <Section id="faq" overlay="warm">
      <Container size="md">
        <SectionHeader
          tag={t('faq.tag')}
          tagColor="warm"
          title={
            <>
              {t('faq.titlePrefix')}<GradientText variant="warm">{t('faq.titleHighlight')}</GradientText>
            </>
          }
          subtitle={t('faq.subtitleFull')}
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          <span className="text-sm text-text-muted flex items-center gap-2">
            <HelpCircle className="w-4 h-4" strokeWidth={1.5} />
            {t('faq.categoryLabel')}
          </span>
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neos-blue text-white'
                  : 'bg-white/5 text-text-subtle hover:bg-white/10 hover:text-white'
              }`}
            >
              {t(`faq.categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <GlassCard padding="lg">
          {filteredItems.map((item, i) => (
            <FAQItemComponent
              key={item.id}
              itemId={item.id}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </GlassCard>

        {/* Contact CTA */}
        <div className="mt-10 text-center">
          <p className="text-text-muted mb-2">
            {t('faq.contactCta')}
          </p>
          <p className="text-sm">
            <a href="mailto:support@almaneo.org" className="text-neos-blue hover:underline">
              support@almaneo.org
            </a>
            {' '}{t('faq.contactMessage')}
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default FAQSection;

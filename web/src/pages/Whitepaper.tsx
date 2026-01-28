/**
 * AlmaNEO Whitepaper Page
 * - 13 sections with 14 language support
 * - Markdown rendering with TOC navigation
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  AlertTriangle,
  Heart,
  Lightbulb,
  Code,
  Coins,
  Globe,
  Calendar,
  Vote,
  Map,
  Users,
  Shield,
  Flag,
  ChevronRight,
  Menu,
  X,
  Languages,
  Download,
  ExternalLink,
} from 'lucide-react';
import whitepaperData from '../data/whitepaper/whitepaper.json';

// Section icons mapping
const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  abstract: FileText,
  problem: AlertTriangle,
  philosophy: Heart,
  solution: Lightbulb,
  technical: Code,
  tokenomics: Coins,
  expansion: Globe,
  expo: Calendar,
  governance: Vote,
  roadmap: Map,
  team: Users,
  risk: Shield,
  conclusion: Flag,
};

// Section titles for each language
const sectionTitles: Record<string, Record<string, string>> = {
  abstract: {
    en: 'Abstract',
    ko: '개요',
    zh: '摘要',
    ja: '概要',
    es: 'Resumen',
    fr: 'Résumé',
    ar: 'ملخص',
    pt: 'Resumo',
    id: 'Abstrak',
    ms: 'Abstrak',
    th: 'บทคัดย่อ',
    vi: 'Tóm tắt',
    km: 'សេចក្ដីសង្ខេប',
    sw: 'Muhtasari',
  },
  problem: {
    en: 'Problem Statement',
    ko: '문제 인식',
    zh: '问题陈述',
    ja: '問題提起',
    es: 'Planteamiento del Problema',
    fr: 'Énoncé du Problème',
    ar: 'بيان المشكلة',
    pt: 'Declaração do Problema',
    id: 'Pernyataan Masalah',
    ms: 'Pernyataan Masalah',
    th: 'คำชี้แจงปัญหา',
    vi: 'Phát biểu Vấn đề',
    km: 'សេចក្ដីថ្លែងការណ៍បញ្ហា',
    sw: 'Taarifa ya Tatizo',
  },
  philosophy: {
    en: 'Philosophy',
    ko: '철학',
    zh: '哲学',
    ja: '哲学',
    es: 'Filosofía',
    fr: 'Philosophie',
    ar: 'الفلسفة',
    pt: 'Filosofia',
    id: 'Filosofi',
    ms: 'Falsafah',
    th: 'ปรัชญา',
    vi: 'Triết lý',
    km: 'ទស្សនវិជ្ជា',
    sw: 'Falsafa',
  },
  solution: {
    en: 'Solution Overview',
    ko: '솔루션 개요',
    zh: '解决方案概述',
    ja: 'ソリューション概要',
    es: 'Descripción de la Solución',
    fr: 'Aperçu de la Solution',
    ar: 'نظرة عامة على الحل',
    pt: 'Visão Geral da Solução',
    id: 'Ikhtisar Solusi',
    ms: 'Gambaran Penyelesaian',
    th: 'ภาพรวมโซลูชัน',
    vi: 'Tổng quan Giải pháp',
    km: 'ទិដ្ឋភាពទូទៅនៃដំណោះស្រាយ',
    sw: 'Muhtasari wa Suluhisho',
  },
  technical: {
    en: 'Technical Architecture',
    ko: '기술 아키텍처',
    zh: '技术架构',
    ja: '技術アーキテクチャ',
    es: 'Arquitectura Técnica',
    fr: 'Architecture Technique',
    ar: 'البنية التقنية',
    pt: 'Arquitetura Técnica',
    id: 'Arsitektur Teknis',
    ms: 'Seni Bina Teknikal',
    th: 'สถาปัตยกรรมทางเทคนิค',
    vi: 'Kiến trúc Kỹ thuật',
    km: 'ស្ថាបត្យកម្មបច្ចេកទេស',
    sw: 'Usanifu wa Kiufundi',
  },
  tokenomics: {
    en: 'Tokenomics',
    ko: '토큰 경제',
    zh: '代币经济',
    ja: 'トークノミクス',
    es: 'Tokenomics',
    fr: 'Tokenomics',
    ar: 'اقتصاديات الرمز',
    pt: 'Tokenomics',
    id: 'Tokenomics',
    ms: 'Tokenomics',
    th: 'Tokenomics',
    vi: 'Tokenomics',
    km: 'Tokenomics',
    sw: 'Tokenomics',
  },
  expansion: {
    en: 'Global Expansion',
    ko: '글로벌 확장',
    zh: '全球扩展',
    ja: 'グローバル展開',
    es: 'Expansión Global',
    fr: 'Expansion Mondiale',
    ar: 'التوسع العالمي',
    pt: 'Expansão Global',
    id: 'Ekspansi Global',
    ms: 'Pengembangan Global',
    th: 'การขยายตัวทั่วโลก',
    vi: 'Mở rộng Toàn cầu',
    km: 'ការពង្រីកសកល',
    sw: 'Upanuzi wa Kimataifa',
  },
  expo: {
    en: 'Kindness Expo',
    ko: '친절 엑스포',
    zh: '善意博览会',
    ja: 'カインドネスエキスポ',
    es: 'Expo de Bondad',
    fr: 'Expo Bienveillance',
    ar: 'معرض اللطف',
    pt: 'Expo Bondade',
    id: 'Expo Kebaikan',
    ms: 'Ekspo Kebaikan',
    th: 'นิทรรศการความเมตตา',
    vi: 'Triển lãm Lòng tốt',
    km: 'ពិព័រណ៍សប្បុរសធម៌',
    sw: 'Maonyesho ya Wema',
  },
  governance: {
    en: 'Governance',
    ko: '거버넌스',
    zh: '治理',
    ja: 'ガバナンス',
    es: 'Gobernanza',
    fr: 'Gouvernance',
    ar: 'الحوكمة',
    pt: 'Governança',
    id: 'Tata Kelola',
    ms: 'Tadbir Urus',
    th: 'การกำกับดูแล',
    vi: 'Quản trị',
    km: 'អភិបាលកិច្ច',
    sw: 'Utawala',
  },
  roadmap: {
    en: 'Roadmap',
    ko: '로드맵',
    zh: '路线图',
    ja: 'ロードマップ',
    es: 'Hoja de Ruta',
    fr: 'Feuille de Route',
    ar: 'خارطة الطريق',
    pt: 'Roteiro',
    id: 'Peta Jalan',
    ms: 'Peta Jalan',
    th: 'แผนงาน',
    vi: 'Lộ trình',
    km: 'ផែនទីផ្លូវ',
    sw: 'Ramani ya Barabara',
  },
  team: {
    en: 'Team',
    ko: '팀',
    zh: '团队',
    ja: 'チーム',
    es: 'Equipo',
    fr: 'Équipe',
    ar: 'الفريق',
    pt: 'Equipe',
    id: 'Tim',
    ms: 'Pasukan',
    th: 'ทีม',
    vi: 'Đội ngũ',
    km: 'ក្រុម',
    sw: 'Timu',
  },
  risk: {
    en: 'Risk Disclosure',
    ko: '리스크 공개',
    zh: '风险披露',
    ja: 'リスク開示',
    es: 'Divulgación de Riesgos',
    fr: 'Divulgation des Risques',
    ar: 'الإفصاح عن المخاطر',
    pt: 'Divulgação de Riscos',
    id: 'Pengungkapan Risiko',
    ms: 'Pendedahan Risiko',
    th: 'การเปิดเผยความเสี่ยง',
    vi: 'Công bố Rủi ro',
    km: 'ការបង្ហាញហានិភ័យ',
    sw: 'Ufunuo wa Hatari',
  },
  conclusion: {
    en: 'Conclusion',
    ko: '결론',
    zh: '结论',
    ja: '結論',
    es: 'Conclusión',
    fr: 'Conclusion',
    ar: 'الخلاصة',
    pt: 'Conclusão',
    id: 'Kesimpulan',
    ms: 'Kesimpulan',
    th: 'บทสรุป',
    vi: 'Kết luận',
    km: 'សេចក្ដីសន្និដ្ឋាន',
    sw: 'Hitimisho',
  },
};

// Language names
const languageNames: Record<string, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  ko: { native: '한국어', english: 'Korean' },
  zh: { native: '中文', english: 'Chinese' },
  ja: { native: '日本語', english: 'Japanese' },
  es: { native: 'Español', english: 'Spanish' },
  fr: { native: 'Français', english: 'French' },
  ar: { native: 'العربية', english: 'Arabic' },
  pt: { native: 'Português', english: 'Portuguese' },
  id: { native: 'Indonesia', english: 'Indonesian' },
  ms: { native: 'Melayu', english: 'Malay' },
  th: { native: 'ไทย', english: 'Thai' },
  vi: { native: 'Tiếng Việt', english: 'Vietnamese' },
  km: { native: 'ភាសាខ្មែរ', english: 'Khmer' },
  sw: { native: 'Kiswahili', english: 'Swahili' },
};

interface Section {
  id: string;
  num: number;
  icon: string;
  content: Record<string, string>;
}

interface WhitepaperData {
  sections: Section[];
  languages: { code: string; name_en: string; name_native: string }[];
}

export default function Whitepaper() {
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [activeSection, setActiveSection] = useState<string>('abstract');
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language || 'en');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get section from URL
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && (whitepaperData as WhitepaperData).sections.find(s => s.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Update URL when section changes
  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setSearchParams({ section: sectionId, lang: selectedLang });
    setSidebarOpen(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedLang, setSearchParams]);

  // Update URL when language changes
  const handleLanguageChange = useCallback((langCode: string) => {
    setSelectedLang(langCode);
    setSearchParams({ section: activeSection, lang: langCode });
    // Update i18n language
    i18n.changeLanguage(langCode);
  }, [activeSection, i18n, setSearchParams]);

  // Get current section content
  const currentSection = useMemo(() => {
    const data = whitepaperData as WhitepaperData;
    return data.sections.find(s => s.id === activeSection);
  }, [activeSection]);

  // Get content for selected language
  const content = useMemo(() => {
    if (!currentSection) return '';
    // Try selected language, fallback to 'en', then 'original'
    return currentSection.content[selectedLang]
      || currentSection.content['en']
      || currentSection.content['original']
      || '';
  }, [currentSection, selectedLang]);

  // Available languages
  const languages = useMemo(() => {
    return Object.entries(languageNames).map(([code, names]) => ({
      code,
      ...names,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium">
              {sectionTitles[activeSection]?.[selectedLang] || sectionTitles[activeSection]?.['en'] || activeSection}
            </span>
          </button>

          {/* Language selector mobile */}
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-slate-800 text-slate-300 text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-neos-blue"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native}
                </option>
              ))}
            </select>
            <Languages className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex pt-16 lg:pt-0">
        {/* Sidebar - TOC */}
        <aside className={`
          fixed lg:sticky top-28 lg:top-20 left-0 z-30
          w-72 h-[calc(100vh-7rem)] lg:h-[calc(100vh-5rem)]
          bg-slate-900/95 lg:bg-slate-900/50 backdrop-blur-sm
          border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}>
          <div className="p-4">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-1">AlmaNEO Whitepaper</h2>
              <p className="text-xs text-slate-400">v3.0</p>
            </div>

            {/* Language selector desktop */}
            <div className="hidden lg:block mb-6">
              <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wide">
                Language
              </label>
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full appearance-none bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-neos-blue"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.english})
                  </option>
                ))}
              </select>
            </div>

            {/* Table of Contents */}
            <nav className="space-y-1">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide">
                Contents
              </p>
              {(whitepaperData as WhitepaperData).sections.map((section) => {
                const Icon = sectionIcons[section.id] || FileText;
                const isActive = activeSection === section.id;
                const title = sectionTitles[section.id]?.[selectedLang] || sectionTitles[section.id]?.['en'] || section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                      transition-all duration-200
                      ${isActive
                        ? 'bg-neos-blue/20 text-neos-blue border border-neos-blue/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-neos-blue' : 'text-slate-500'}`} />
                    <span className="text-sm font-medium truncate">
                      {section.num}. {title}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Download / Links */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                to="/gaii-report"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Report PDF
              </Link>
              <a
                href="https://github.com/almaneo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mt-3"
              >
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-3 sm:px-4 lg:px-8 py-6 sm:py-8 mt-12 lg:mt-0">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <span>Section {currentSection?.num || 1}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-300">
                  {sectionTitles[activeSection]?.[selectedLang] || sectionTitles[activeSection]?.['en'] || activeSection}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = sectionIcons[activeSection] || FileText;
                  return <Icon className="w-8 h-8 text-neos-blue" />;
                })()}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {sectionTitles[activeSection]?.[selectedLang] || sectionTitles[activeSection]?.['en'] || activeSection}
                </h1>
              </div>
            </div>

            {/* Markdown Content */}
            <article className="prose prose-lg max-w-none whitepaper-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Hide broken images
                  img: () => null,
                }}
              >
                {content}
              </ReactMarkdown>
            </article>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between">
              {(() => {
                const sections = (whitepaperData as WhitepaperData).sections;
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
                const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

                return (
                  <>
                    {prevSection ? (
                      <button
                        onClick={() => handleSectionChange(prevSection.id)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        <span className="text-sm">
                          {sectionTitles[prevSection.id]?.[selectedLang] || sectionTitles[prevSection.id]?.['en']}
                        </span>
                      </button>
                    ) : <div />}
                    {nextSection ? (
                      <button
                        onClick={() => handleSectionChange(nextSection.id)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <span className="text-sm">
                          {sectionTitles[nextSection.id]?.[selectedLang] || sectionTitles[nextSection.id]?.['en']}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

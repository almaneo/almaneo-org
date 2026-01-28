/**
 * Header Component - 글로벌 네비게이션
 * 2단계 드롭다운 메뉴 + 언어 선택 + 친절 모드 지원
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { languages, type LanguageCode } from '../../i18n';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  ExternalLink,
  BarChart3,
  Bot,
  Heart,
  Coins,
  Gift,
  Image,
  Gamepad2,
  Vote,
  FileText,
  MessageCircle,
  Twitter,
  Github,
  HeartHandshake,
  Users,
} from 'lucide-react';
import { useWallet, WalletButton, WalletModal } from '../wallet';
import { useKindnessMode } from '../../contexts';
import '../wallet/wallet.css';
import logoImg from '../../assets/logo.png';

// 네비게이션 구조 정의
interface NavItem {
  nameKey: string; // i18n key
  path?: string;
  icon?: React.ElementType;
  external?: boolean;
  badgeKey?: string; // i18n key for badge
}

const platformItems: NavItem[] = [
  { nameKey: 'nav.gaii', path: '/gaii', icon: BarChart3 },
  { nameKey: 'nav.gaiiReport', path: '/gaii-report', icon: FileText, badgeKey: 'common.new' },
  { nameKey: 'nav.aiHub', path: '/ai-hub', icon: Bot, badgeKey: 'common.new' },
  { nameKey: 'nav.kindnessProtocol', path: '/kindness', icon: Heart },
  { nameKey: 'nav.meetups', path: '/meetup', icon: Users, badgeKey: 'common.new' },
];

const ecosystemItems: NavItem[] = [
  { nameKey: 'nav.staking', path: '/staking', icon: Coins },
  { nameKey: 'nav.airdrop', path: '/airdrop', icon: Gift },
  { nameKey: 'nav.nftMarketplace', path: 'https://nft.almaneo.org', icon: Image, external: true },
  { nameKey: 'nav.kindnessGame', path: 'https://game.almaneo.org', icon: Gamepad2, external: true },
  { nameKey: 'nav.governance', path: '/governance', icon: Vote },
];

const communityItems: NavItem[] = [
  { nameKey: 'nav.whitepaper', path: '/whitepaper', icon: FileText },
  { nameKey: 'nav.blog', path: 'https://medium.com/@news_15809', icon: FileText, external: true },
  { nameKey: 'nav.discord', path: 'https://discord.gg/JkRNuj7aYd', icon: MessageCircle, external: true },
  { nameKey: 'nav.twitter', path: 'https://x.com/almaneo_org', icon: Twitter, external: true },
  { nameKey: 'nav.github', path: 'https://github.com/almaneo', icon: Github, external: true },
];

// 언어 목록을 i18n/index.ts에서 가져옴
const languageList = Object.entries(languages).map(([code, lang]) => ({
  code: code as LanguageCode,
  name: lang.nativeName,
  flag: lang.flag,
}));

// 드롭다운 컴포넌트
function Dropdown({
  labelKey,
  items,
  isOpen,
  onToggle,
  onClose,
}: {
  labelKey: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isOpen
          ? 'text-white bg-white/10'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
      >
        {t(labelKey)}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 py-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl animate-fade-in-up">
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
                {Icon && <Icon className="w-4 h-4 text-slate-400" strokeWidth={1.5} />}
                <span className="flex-1">{t(item.nameKey)}</span>
                {item.badgeKey && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-jeong-orange/20 text-jeong-orange">
                    {t(item.badgeKey)}
                  </span>
                )}
                {item.external && (
                  <ExternalLink className="w-3 h-3 text-slate-500" strokeWidth={1.5} />
                )}
              </div>
            );

            return item.external ? (
              <a
                key={item.nameKey}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="block text-sm text-slate-300 hover:text-white"
              >
                {content}
              </a>
            ) : (
              <Link
                key={item.nameKey}
                to={item.path || '/'}
                onClick={onClose}
                className="block text-sm text-slate-300 hover:text-white"
              >
                {content}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 언어 선택 드롭다운
function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language as LanguageCode;
  const current = languageList.find((l) => l.code === currentLang) || languageList[0];

  const handleChangeLang = (code: string) => {
    i18n.changeLanguage(code);
    // Update document direction for RTL languages
    document.documentElement.dir = languages[code as LanguageCode]?.dir || 'ltr';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Globe className="w-4 h-4" strokeWidth={1.5} />
        <span className="uppercase">{current.code}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 max-h-80 overflow-y-auto py-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl animate-fade-in-up">
          {languageList.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                handleChangeLang(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${lang.code === currentLang
                ? 'text-white bg-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 친절 모드 토글 컴포넌트
function KindnessModeToggle() {
  const { t } = useTranslation();
  const { isKindnessMode, toggleKindnessMode } = useKindnessMode();

  return (
    <button
      onClick={toggleKindnessMode}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isKindnessMode
        ? 'bg-jeong-orange/20 text-jeong-orange'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      title={isKindnessMode ? t('kindnessMode.description') : t('kindnessMode.title')}
    >
      <HeartHandshake className="w-4 h-4" strokeWidth={1.5} />
      <span className="hidden xl:inline text-xs">
        {isKindnessMode ? `${t('kindnessMode.title')} ${t('kindnessMode.on')}` : t('kindnessMode.title')}
      </span>
    </button>
  );
}

export default function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { isConnected, address, balance, userInfo, isLoading, connect } = useWallet();
  const { isKindnessMode, toggleKindnessMode } = useKindnessMode();

  const currentLang = i18n.language as LanguageCode;

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => setOpenDropdown(null);

  // 모바일 메뉴용 아코디언 상태
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="AlmaNEO" className="h-8 w-auto max-w-[35vw] sm:max-w-none object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Dashboard - 직접 링크 */}
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                ? 'text-white bg-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {t('nav.dashboard')}
            </Link>

            {/* Platform 드롭다운 */}
            <Dropdown
              labelKey="nav.platform"
              items={platformItems}
              isOpen={openDropdown === 'platform'}
              onToggle={() => handleDropdownToggle('platform')}
              onClose={closeDropdown}
            />

            {/* Ecosystem 드롭다운 */}
            <Dropdown
              labelKey="nav.ecosystem"
              items={ecosystemItems}
              isOpen={openDropdown === 'ecosystem'}
              onToggle={() => handleDropdownToggle('ecosystem')}
              onClose={closeDropdown}
            />

            {/* Community 드롭다운 */}
            <Dropdown
              labelKey="nav.community"
              items={communityItems}
              isOpen={openDropdown === 'community'}
              onToggle={() => handleDropdownToggle('community')}
              onClose={closeDropdown}
            />
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Kindness Mode Toggle */}
            <KindnessModeToggle />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Wallet Button */}
            <WalletButton
              variant="default"
              showBalance={true}
              onOpenModal={() => setWalletModalOpen(true)}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-700/50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {t('nav.dashboard')}
              </Link>

              {/* Platform 아코디언 */}
              <MobileAccordion
                labelKey="nav.platform"
                items={platformItems}
                isOpen={mobileAccordion === 'platform'}
                onToggle={() =>
                  setMobileAccordion(mobileAccordion === 'platform' ? null : 'platform')
                }
                onItemClick={() => setMobileMenuOpen(false)}
              />

              {/* Ecosystem 아코디언 */}
              <MobileAccordion
                labelKey="nav.ecosystem"
                items={ecosystemItems}
                isOpen={mobileAccordion === 'ecosystem'}
                onToggle={() =>
                  setMobileAccordion(mobileAccordion === 'ecosystem' ? null : 'ecosystem')
                }
                onItemClick={() => setMobileMenuOpen(false)}
              />

              {/* Community 아코디언 */}
              <MobileAccordion
                labelKey="nav.community"
                items={communityItems}
                isOpen={mobileAccordion === 'community'}
                onToggle={() =>
                  setMobileAccordion(mobileAccordion === 'community' ? null : 'community')
                }
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </nav>

            {/* Kindness Mode & Language - Mobile */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              {/* Kindness Mode Toggle */}
              <div className="px-4 mb-4">
                <button
                  onClick={toggleKindnessMode}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isKindnessMode
                    ? 'bg-jeong-orange/20 border border-jeong-orange/30'
                    : 'bg-white/5 border border-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <HeartHandshake
                      className={`w-5 h-5 ${isKindnessMode ? 'text-jeong-orange' : 'text-slate-400'}`}
                      strokeWidth={1.5}
                    />
                    <div className="text-left">
                      <div className={`text-sm font-medium ${isKindnessMode ? 'text-jeong-orange' : 'text-white'}`}>
                        {t('kindnessMode.title')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {t('kindnessMode.description')}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${isKindnessMode ? 'bg-jeong-orange' : 'bg-slate-600'
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${isKindnessMode ? 'translate-x-5' : 'translate-x-1'
                        }`}
                    />
                  </div>
                </button>
              </div>

              {/* Language */}
              <div className="px-4 mb-2 text-xs text-slate-500 uppercase">{t('language.select')}</div>
              <div className="px-4">
                <select
                  value={currentLang}
                  onChange={(e) => {
                    i18n.changeLanguage(e.target.value);
                    document.documentElement.dir = languages[e.target.value as LanguageCode]?.dir || 'ltr';
                  }}
                  className="w-full appearance-none bg-slate-800 text-slate-300 text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-neos-blue min-h-[44px]"
                >
                  {languageList.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Wallet - Mobile */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              {isConnected && address ? (
                <div className="space-y-2 px-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      {userInfo?.profileImage ? (
                        <img
                          src={userInfo.profileImage}
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      )}
                      <span className="text-sm text-white">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {parseFloat(balance).toFixed(3)} POL
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setWalletModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neos-blue/10 border border-neos-blue/30 rounded-lg text-neos-blue hover:bg-neos-blue/20 transition-colors"
                  >
                    <span>{t('wallet.viewExplorer')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    connect();
                  }}
                  disabled={isLoading}
                  className="btn-primary flex items-center justify-center gap-2 px-4 py-3 disabled:opacity-50 mx-4 w-[calc(100%-2rem)]"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                  )}
                  <span>{isLoading ? `${t('common.loading')}` : t('wallet.connect')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Wallet Modal */}
      <WalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        enabledFeatures={{
          tokens: true,
          nft: true,
          game: true,
          staking: true,
          governance: true,
        }}
      />
    </header>
  );
}

// 모바일 아코디언 컴포넌트
function MobileAccordion({
  labelKey,
  items,
  isOpen,
  onToggle,
  onItemClick,
}: {
  labelKey: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  onItemClick: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors min-h-[44px]"
      >
        <span>{t(labelKey)}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <div className="ml-4 pl-4 border-l border-slate-700/50">
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-3 px-4 py-2.5 min-h-[44px]">
                {Icon && <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />}
                <span className="flex-1">{t(item.nameKey)}</span>
                {item.badgeKey && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-jeong-orange/20 text-jeong-orange">
                    {t(item.badgeKey)}
                  </span>
                )}
                {item.external && (
                  <ExternalLink className="w-3 h-3 text-slate-500" strokeWidth={1.5} />
                )}
              </div>
            );

            return item.external ? (
              <a
                key={item.nameKey}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onItemClick}
                className="block text-sm text-slate-400 hover:text-white transition-colors"
              >
                {content}
              </a>
            ) : (
              <Link
                key={item.nameKey}
                to={item.path || '/'}
                onClick={onItemClick}
                className="block text-sm text-slate-400 hover:text-white transition-colors"
              >
                {content}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

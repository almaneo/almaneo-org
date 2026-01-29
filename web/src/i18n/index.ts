import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Supported languages matching Header.tsx languages array
export const languages = {
  ko: { name: '한국어', nativeName: '한국어', dir: 'ltr', flag: '🇰🇷' },
  en: { name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸' },
  zh: { name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
  ja: { name: 'Japanese', nativeName: '日本語', dir: 'ltr', flag: '🇯🇵' },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  pt: { name: 'Portuguese', nativeName: 'Português', dir: 'ltr', flag: '🇧🇷' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', flag: '🇮🇩' },
  ms: { name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', flag: '🇲🇾' },
  th: { name: 'Thai', nativeName: 'ไทย', dir: 'ltr', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr', flag: '🇻🇳' },
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ', dir: 'ltr', flag: '🇰🇭' },
  sw: { name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr', flag: '🇹🇿' },
} as const;

export type LanguageCode = keyof typeof languages;

export const initPromise = i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(languages),
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'almaneo-language',
    },

    ns: ['common', 'landing', 'platform'],
    defaultNS: 'common',

    react: {
      useSuspense: true,
    },
  });

export default i18n;

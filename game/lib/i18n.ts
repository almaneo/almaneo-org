/**
 * i18n Configuration for AlmaNEO Kindness Game
 *
 * Uses bundled translations (ES import) for static export compatibility.
 * No HTTP backend needed - translations are included in the JS bundle.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ko from '@/locales/ko.json';
import en from '@/locales/en.json';

export const languages = {
  ko: { name: '한국어', nativeName: '한국어', flag: '🇰🇷' },
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
} as const;

export type LanguageCode = keyof typeof languages;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { game: ko },
      en: { game: en },
    },
    fallbackLng: 'ko',
    supportedLngs: ['ko', 'en'],
    defaultNS: 'game',
    ns: ['game'],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'almaneo-game-language',
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;

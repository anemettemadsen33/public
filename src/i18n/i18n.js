import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initLanguageDetection, detectBrowserLanguage } from '../utils/languageDetection';
import en from './locales/en.json';
import ro from './locales/ro.json';
import de from './locales/de.json';
import ar from './locales/ar.json';
import he from './locales/he.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
      de: { translation: de },
      ar: { translation: ar },
      he: { translation: he }
    },
    lng: detectBrowserLanguage(), // Auto-detect browser language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Initialize language detection and RTL support
initLanguageDetection(i18n);

export default i18n;

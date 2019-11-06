import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';

i18n
    .use (LanguageDetector)
    .use (Fetch)
    .use (initReactI18next)
    .init ({
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage']
      }
    });

export { i18n };

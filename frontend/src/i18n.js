import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ja',
    supportedLngs: ['ja','en','es','zh','ko'],
    detection: {
      order: ['localStorage','navigator','htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lng',
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
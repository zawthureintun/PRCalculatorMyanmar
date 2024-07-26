import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en/translation.json';
import my from './locales/my/translation.json';

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      my: {
        translation: my
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;

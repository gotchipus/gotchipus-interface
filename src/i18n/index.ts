import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Locale, DEFAULT_LOCALE } from './constants';
import enUsLocale from './locales/translations/en-US.json';
import zhCNLocale from './locales/translations/zh-CN.json';

const resources = {
  [Locale.EnglishUnitedStates]: {
    translation: enUsLocale
  },
  [Locale.ChineseSimplified]: {
    translation: zhCNLocale
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LOCALE,
      fallbackLng: DEFAULT_LOCALE,
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false
      }
    });
}

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../app/main/language/en_translation.json';
import vi from '../app/main/language/vi_translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: 'vi', // Ngôn ngữ mặc định
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // Không cần escape trong React Native
  },
  // Loại bỏ compatibilityJSON: 'v3' hoặc sử dụng 'v4' nếu cần
  compatibilityJSON: 'v4', // Nếu thực sự cần
});

export default i18n;

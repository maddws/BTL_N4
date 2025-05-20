// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// import en from '../app/main/language/en_translation.json';
// import vi from '../app/main/language/vi_translation.json';

// i18n.use(initReactI18next).init({
//     resources: {
//         en: { translation: en },
//         vi: { translation: vi },
//     },
//     lng: 'vi', // Ngôn ngữ mặc định
//     fallbackLng: 'en',
//     interpolation: {
//         escapeValue: false, // Không cần escape trong React Native
//     },
//     // Loại bỏ compatibilityJSON: 'v3' hoặc sử dụng 'v4' nếu cần
//     compatibilityJSON: 'v4', // Nếu thực sự cần
// });

// export default i18n;
// i18n.ts
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../app/main/language/en_translation.json';
import vi from '../app/main/language/vi_translation.json';

// Lấy mã ngôn ngữ chính chỉ phần trước dấu '-' (ví dụ "en-US" → "en")
const deviceLocale = Localization.locale.split('-')[0];

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        vi: { translation: vi },
    },
    // Mặc định dùng locale của thiết bị, nếu không có trong resources thì fallback về 'en'
    lng: deviceLocale,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    // Nếu JSON của bạn đã là flat key/value, bạn không cần compatibilityJSON
    compatibilityJSON: 'v4',
});

export default i18n;

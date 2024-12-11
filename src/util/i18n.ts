import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from '@/lang/ko.json';
import en from '@/lang/en.json';

i18n.use(initReactI18next).init({
    debug: true,
    resources: {
        ko: { translation: ko },
        en: { translation: en }
    },
    lng: 'ko', // 기본 언어를 'ko'로 설정
    fallbackLng: 'ko', // 번역이 없을 경우 한국어로 폴백
    interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        prefix: '{',
        suffix: '}'
    }
});

export default i18n;

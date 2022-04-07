import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
        en: {
            translations: require('./locales/en/english.json'),
        },
    },
    ns: ['translations'],
    defaultNS: 'translations',
});

export default i18n;

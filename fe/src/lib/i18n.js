import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Only create the instance if we're on the client side
const createI18nInstance = () => {
    const instance = i18n.createInstance();

    instance
        .use(Backend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            fallbackLng: 'en',
            debug: process.env.NODE_ENV === 'development',
            interpolation: {
                escapeValue: false,
            },
            resources: {
                en: {
                    translation: {
                        error: "Has occurred an error, please try again",
                        hello: "Hello, {{name}}",
                        profile: "Profile",
                    }
                },
                vi: {
                    translation: {
                        error: "Đã có lỗi xảy ra. Vui lòng thử lại",
                        hello: "Xin chào, {{name}}",
                        profile: "Hồ sơ",
                    }
                }
            }
        });

    return instance;
};

const i18nInstance = typeof window !== 'undefined' ? createI18nInstance() : null;

export default i18nInstance;
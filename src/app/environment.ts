const NODE_ENV = import.meta.env.MODE;
const ENV_MODE = import.meta.env.VITE_ENVIRONMENT_NAME;
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;
const APP_VERSION = import.meta.env.VITE_VERSION;
const CDN_URL = import.meta.env.VITE_CDN_URL;
const AMPLITUDE_KEY = import.meta.env.VITE_AMPLITUDE_KEY;

const CONTACT_EMAIL = 'app-marketing@its-newid.com';
const ERROR_VIDEO_URL = CDN_URL + '/img/bgErrorBlack.mp4';

const DEFAULT_LOCALE = {
    lang: 'en',
    country: 'US'
};

const EnvType = {
    PROD: 'production',
    DEV: 'development',
    ERROR_CASE: 'error',
    LOCAL: 'local'
} as const;

export {
    NODE_ENV,
    ENV_MODE,
    BASE_API_URL,
    BEARER_TOKEN,
    APP_VERSION,
    CDN_URL,
    AMPLITUDE_KEY,
    CONTACT_EMAIL,
    ERROR_VIDEO_URL,
    DEFAULT_LOCALE,
    EnvType
};

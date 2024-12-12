const NODE_ENV = import.meta.env.NODE_ENV;
const ENV_MODE = import.meta.env.ENVIRONMENT_NAME;
const BASE_API_URL = import.meta.env.BASE_API_URL;
const BEARER_TOKEN = import.meta.env.BEARER_TOKEN;
const APP_VERSION = import.meta.env.VERSION;
const CDN_URL = import.meta.env.CDN_URL;
const AMPLITUDE_KEY = import.meta.env.AMPLITUDE_KEY;

const CONTACT_EMAIL = 'app-marketing@its-newid.com';
const ERROR_VIDEO_URL = CDN_URL + '/img/bgErrorBlack.mp4';

const DEFAULT_LOCALE = {
    lang: 'ko',
    country: 'KR'
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

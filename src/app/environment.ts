const ENV_MODE = import.meta.env.VITE_ENVIRONMENT_NAME;
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;
const CDN_URL = import.meta.env.VITE_CDN_URL;

const ERROR_VIDEO_URL = CDN_URL + '/img/bgErrorBlack.mp4';

const DEFAULT_LOCALE = {
    lang: 'en',
    country: 'US',
};

const EnvType = {
    PROD: 'production',
    DEV: 'development',
    ERROR_CASE: 'error',
    LOCAL: 'local',
} as const;

export {
    ENV_MODE,
    BASE_API_URL,
    BEARER_TOKEN,
    CDN_URL,
    ERROR_VIDEO_URL,
    DEFAULT_LOCALE,
    EnvType,
};

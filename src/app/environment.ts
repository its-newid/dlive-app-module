const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;
const APP_VERSION = import.meta.env.VITE_VERSION;
const CDN_URL = import.meta.env.VITE_CDN_URL;

const ERROR_VIDEO_URL = CDN_URL + '/img/bgErrorBlack.mp4';

const DEFAULT_LOCALE = {
    lang: 'en',
    country: 'US',
};

export {
    BASE_API_URL,
    BEARER_TOKEN,
    APP_VERSION,
    CDN_URL,
    ERROR_VIDEO_URL,
    DEFAULT_LOCALE,
};

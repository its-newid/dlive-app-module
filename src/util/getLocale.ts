import { UserAgentLocale } from '@/type/userAgent.ts';

export function getLocale() {
    const metaContentName = document
        .querySelector('meta[property="locale"]')
        ?.getAttribute('content')
        ?.toLowerCase();

    switch (metaContentName) {
        case null:
        case undefined:
        case 'locale_name':
            return UserAgentLocale.DEFAULT.toLowerCase();
        default:
            return metaContentName;
    }
}

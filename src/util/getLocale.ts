import { UserAgentLocale } from '@/type/userAgent.ts';

export function getLocale() {
    const metaContentName = document
        .querySelector('meta[property="locale"]')
        ?.getAttribute('content');
    if (!metaContentName) return UserAgentLocale.DEFAULT;

    const matchedLocale = metaContentName.toLowerCase();

    return 'kr';
    // return matchedLocale ?? UserAgentLocale.DEFAULT;
}

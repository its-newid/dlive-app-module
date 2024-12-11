import { UserAgentOS } from '@/type/userAgent';

export function getOS(): UserAgentOS {
    const metaContentName = document.querySelector('meta[property="os"]')?.getAttribute('content');
    if (!metaContentName) return UserAgentOS.DEFAULT;

    const matchedOS = Object.values(UserAgentOS).find(
        (value) => value === metaContentName.toLowerCase()
    );
    return matchedOS ?? UserAgentOS.DEFAULT;
}

import { UserAgentOS } from '@/type/userAgent';

export function closeApp(os: UserAgentOS) {
    const { DEFAULT } = UserAgentOS;
    switch (os) {
        case DEFAULT:
            Android.exit();
            break;
        default:
            window.close();
    }
}

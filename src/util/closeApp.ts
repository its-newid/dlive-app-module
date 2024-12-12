import { UserAgentOS } from '@/type/userAgent';

export function closeApp(os: UserAgentOS) {
    const { ANDROID } = UserAgentOS;
    switch (os) {
        case ANDROID:
            Android.exit();
            break;
        default:
            window.close();
    }
}

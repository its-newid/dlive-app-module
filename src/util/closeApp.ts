import { UserAgentOS } from '@/type/userAgent';

export function closeApp(os: UserAgentOS) {
    const { DLIVE_STB, DLIVE_CTV, LONGTV_STB, GOOGLE_PLAY } = UserAgentOS;
    switch (os) {
        case DLIVE_STB:
        case DLIVE_CTV:
        case LONGTV_STB:
        case GOOGLE_PLAY:
            Android.exit();
            break;
        default:
            window.close();
    }
}

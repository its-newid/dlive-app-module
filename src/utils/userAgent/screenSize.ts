import { ScreenDimension } from '@/types/userAgent';

export class UserAgentScreenSize implements ScreenDimension {
    getScreenWidth() {
        return document.body.clientWidth;
    }

    getScreenHeight() {
        return document.documentElement.clientHeight;
    }
}

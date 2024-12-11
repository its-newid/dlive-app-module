import { ScreenDimension } from '@/type/userAgent';

export class UserAgentScreenSize implements ScreenDimension {
    getScreenWidth() {
        return document.body.clientWidth;
    }

    getScreenHeight() {
        return document.documentElement.clientHeight;
    }
}

import { IScreenDimension } from '@/type/userAgent';

export class UserAgentScreenSize implements IScreenDimension {
    getScreenWidth() {
        return document.body.clientWidth;
    }

    getScreenHeight() {
        return document.documentElement.clientHeight;
    }
}

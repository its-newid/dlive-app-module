import { IScreenDimension } from '@/type/userAgent';

export class UserAgentScreenSize implements IScreenDimension {
    getScreenWidth() {
        const bodyStyle = window.getComputedStyle(document.body);
        const bodyWidth = bodyStyle.getPropertyValue('width');
        return parseInt(bodyWidth);
    }

    getScreenHeight() {
        const bodyStyle = window.getComputedStyle(document.body);
        const bodyHeight = bodyStyle.getPropertyValue('height');
        return parseInt(bodyHeight);
    }
}

export class AndroidScreenSize implements IScreenDimension {
    getScreenWidth() {
        return document.body.clientWidth;
    }

    getScreenHeight() {
        return document.documentElement.clientHeight;
    }
}

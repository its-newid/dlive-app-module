import { IKeyCodeMap } from '@/type/userAgent';

export class UserAgentKeyCodeMap implements IKeyCodeMap {
    arrowLeft = 37;
    arrowUp = 38;
    arrowRight = 39;
    arrowDown = 40;
    enter = 13;
    back = 27;
}

export class AndroidKeyCodeMap extends UserAgentKeyCodeMap {}

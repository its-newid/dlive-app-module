import { getOS } from '@/util/getOs';
import { AndroidAgentAdsParameter, NewidAgentAdsParameter } from '@/util/userAgent/adsParameter';
import { UserAgentKeyCodeMap } from '@/util/userAgent/keyCodeMap';
import { UserAgentScreenSize } from '@/util/userAgent/screenSize';
import {
    AdsParameter,
    KeyCodeMap,
    ScreenDimension,
    UserAgent,
    UserAgentOS
} from '@/type/userAgent';

interface IUserAgentConstructor {
    new (
        type: UserAgentOS,
        adsParameter: AdsParameter,
        keyCodeMap: KeyCodeMap,
        screenSize: ScreenDimension
    ): UserAgent;
}

function createAgent(
    builder: IUserAgentConstructor,
    type: UserAgentOS,
    adsParameter: AdsParameter,
    keyCodeMap: KeyCodeMap,
    screenSize: ScreenDimension
): UserAgent {
    return new builder(type, adsParameter, keyCodeMap, screenSize);
}

export class UserAgentImpl implements UserAgent {
    private static instance: UserAgentImpl;

    public constructor(
        public readonly type: UserAgentOS,
        public readonly adsParameter: AdsParameter,
        public readonly keyCodeMap: KeyCodeMap,
        public readonly screenSize: ScreenDimension
    ) {
        this.type = type;
        this.adsParameter = adsParameter;
        this.keyCodeMap = keyCodeMap;
        this.screenSize = screenSize;
    }

    public static getInstance(os: UserAgentOS): UserAgent {
        if (UserAgentImpl.instance) {
            return this.instance;
        }

        let userAgent;
        switch (os) {
            case UserAgentOS.ANDROID: {
                userAgent = createAgent(
                    this,
                    os,
                    new AndroidAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize()
                );
                break;
            }
            default:
                userAgent = createAgent(
                    this,
                    os,
                    new NewidAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize()
                );
        }

        this.instance = userAgent;
        return this.instance;
    }
}

export const userAgent = UserAgentImpl.getInstance(getOS());

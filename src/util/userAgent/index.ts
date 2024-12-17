import { getOS } from '@/util/getOs.ts';
import {
    AndroidAgentAdsParameter,
    NewidAgentAdsParameter,
} from './adsParameter';
import { AndroidKeyCodeMap, UserAgentKeyCodeMap } from './keyCodeMap';
import { AndroidScreenSize, UserAgentScreenSize } from './screenSize';
import {
    IAdsParameter,
    IKeyCodeMap,
    IScreenDimension,
    IUserAgent,
    UserAgentOS,
} from '@/type/userAgent';

interface IUserAgentConstructor {
    new (
        type: UserAgentOS,
        adsParameter: IAdsParameter,
        keyCodeMap: IKeyCodeMap,
        screenSize: IScreenDimension,
    ): IUserAgent;
}

function createAgent(
    builder: IUserAgentConstructor,
    type: UserAgentOS,
    adsParameter: IAdsParameter,
    keyCodeMap: IKeyCodeMap,
    screenSize: IScreenDimension,
): IUserAgent {
    return new builder(type, adsParameter, keyCodeMap, screenSize);
}

export class UserAgentImpl implements IUserAgent {
    private static instance: UserAgentImpl;

    public constructor(
        public readonly type: UserAgentOS,
        public readonly adsParameter: IAdsParameter,
        public readonly keyCodeMap: IKeyCodeMap,
        public readonly screenSize: IScreenDimension,
    ) {
        this.type = type;
        this.adsParameter = adsParameter;
        this.keyCodeMap = keyCodeMap;
        this.screenSize = screenSize;
    }

    public static getInstance(os: UserAgentOS): IUserAgent {
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
                    new AndroidKeyCodeMap(),
                    new AndroidScreenSize(),
                );
                break;
            }
            default:
                userAgent = createAgent(
                    this,
                    os,
                    new NewidAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize(),
                );
        }

        this.instance = userAgent;
        return this.instance;
    }
}

export const userAgent = UserAgentImpl.getInstance(getOS());

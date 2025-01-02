import { getOS } from '@/util/getOs';
import {
    DliveAgentAdsParameter,
    DliveCtvAgentAdsParameter,
    DliveStbAgentAdsParameter,
    GooglePlayAgentAdsParameter,
    LongtvStbAgentAdsParameter,
} from '@/util/userAgent/adsParameter';
import { UserAgentKeyCodeMap } from '@/util/userAgent/keyCodeMap';
import { UserAgentScreenSize } from '@/util/userAgent/screenSize';
import {
    IAdsParameter,
    IKeyCodeMap,
    IScreenDimension,
    IUserAgent,
    UserAgentOS,
} from '@/type/userAgent';

type IUserAgentConstructor = new (
    type: UserAgentOS,
    adsParameter: IAdsParameter,
    keyCodeMap: IKeyCodeMap,
    screenSize: IScreenDimension,
) => IUserAgent;

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
            case UserAgentOS.DLIVE_STB: {
                userAgent = createAgent(
                    this,
                    os,
                    new DliveStbAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize(),
                );
                break;
            }
            case UserAgentOS.DLIVE_CTV: {
                userAgent = createAgent(
                    this,
                    os,
                    new DliveCtvAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize(),
                );
                break;
            }
            case UserAgentOS.LONGTV_STB: {
                userAgent = createAgent(
                    this,
                    os,
                    new LongtvStbAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize(),
                );
                break;
            }
            case UserAgentOS.GOOGLE_PLAY: {
                userAgent = createAgent(
                    this,
                    os,
                    new GooglePlayAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize(),
                );
                break;
            }
            default:
                userAgent = createAgent(
                    this,
                    os,
                    new DliveAgentAdsParameter(os),
                    new UserAgentKeyCodeMap(),
                    new UserAgentScreenSize(),
                );
        }

        this.instance = userAgent;
        return this.instance;
    }
}

export const userAgent = UserAgentImpl.getInstance(getOS());

export const UserAgentOS = {
    DLIVE_STB: 'dlive_settopbox',
    DLIVE_CTV: 'dlive_embedded',
    LONGTV_STB: 'longtv_settopbox',
    GOOGLE_PLAY: 'google_play',
    DEFAULT: 'dlive',
} as const;
export type UserAgentOS = (typeof UserAgentOS)[keyof typeof UserAgentOS];

export const UserAgentLocale = {
    DEFAULT: 'KR',
} as const;
export type UserAgentLocale =
    (typeof UserAgentLocale)[keyof typeof UserAgentLocale];

export interface ITargetOS {
    type: UserAgentOS;
}

export interface IAdsParameter {
    params: {
        os: string;
        ua: string;
        appName: string;
        bundleId: string;
        ifaType: string;
        ifa: string;
        lmt: string;
        appstoreUrl: string;
        appVersion: string;
    };
}

export interface IScreenDimension {
    getScreenWidth(): number;

    getScreenHeight(): number;
}

export interface IKeyCodeMap {
    arrowLeft: number;
    arrowUp: number;
    arrowRight: number;
    arrowDown: number;
    enter: number;
    back: number;
    channelUp?: number;
    channelDown?: number;
}

export type IUserAgent = ITargetOS & {
    adsParameter: IAdsParameter;
    keyCodeMap: IKeyCodeMap;
    screenSize: IScreenDimension;
};

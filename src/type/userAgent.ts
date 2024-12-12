export const UserAgentOS = {
    ANDROID: 'android',
    DEFAULT: 'DLIVE'
} as const;
export type UserAgentOS = (typeof UserAgentOS)[keyof typeof UserAgentOS];

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

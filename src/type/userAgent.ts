export const UserAgentOS = {
    ANDROID: 'android',
    DEFAULT: 'DLIVE'
} as const;
export type UserAgentOS = (typeof UserAgentOS)[keyof typeof UserAgentOS];

export interface TargetOS {
    type: UserAgentOS;
}

export interface AdsParameter {
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

export interface ScreenDimension {
    getScreenWidth(): number;

    getScreenHeight(): number;
}

export interface KeyCodeMap {
    arrowLeft: number;
    arrowUp: number;
    arrowRight: number;
    arrowDown: number;
    enter: number;
    back: number;
    channelUp?: number;
    channelDown?: number;
}

export type UserAgent = TargetOS & {
    adsParameter: AdsParameter;
    keyCodeMap: KeyCodeMap;
    screenSize: ScreenDimension;
};

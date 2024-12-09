import { AdsParameter, UserAgentOS } from '@/types/userAgent';

const ADS_APP_NAME = 'diva';

export abstract class UserAgentAdsParameter implements AdsParameter {
    private readonly appName = ADS_APP_NAME;

    constructor(
        private readonly os: UserAgentOS,
        private bundleId: string,
        private appstoreUrl: string = '',
        private appVersion: string = import.meta.env.VITE_APP_VERSION ?? ''
    ) {}

    public get params() {
        return {
            os: this.os,
            ua: encodeURIComponent(navigator.userAgent),
            appName: this.appName,
            bundleId: this.bundleId,
            appstoreUrl: this.appstoreUrl,
            ifaType: this.getIfaType(),
            ifa: this.getIfa(),
            lmt: this.getLmt(),
            appVersion: this.appVersion
        };
    }

    abstract getIfaType(): string;

    getIfa(): string {
        return '';
    }

    getLmt(): string {
        return '';
    }
}

export class NewidAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(os, encodeURIComponent('diva'), encodeURIComponent('diva.net'));
    }

    getIfaType(): string {
        return 'newid';
    }
}

export class AndroidAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(
            os,
            encodeURIComponent('net.itsnewid.app.android.diva'),
            encodeURIComponent(
                'https://play.google.com/store/apps/details?id=net.itsnewid.app.android.diva'
            )
        );
    }

    getIfaType(): string {
        return 'aaid';
    }
}

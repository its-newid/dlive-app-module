import { IAdsParameter, UserAgentOS } from '@/type/userAgent';

const ADS_APP_NAME = 'diva';

export abstract class UserAgentAdsParameter implements IAdsParameter {
    private readonly appName = ADS_APP_NAME;

    constructor(
        private readonly os: UserAgentOS,
        private bundleId: string,
        private appstoreUrl: string = '',
        private appVersion: string = import.meta.env.VITE_APP_VERSION ?? '',
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
            appVersion: this.appVersion,
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

export class DliveAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(os, encodeURIComponent('diva'), encodeURIComponent('diva.net'));
    }

    getIfaType(): string {
        return 'dlive';
    }
}

export class DliveStbAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(
            os,
            encodeURIComponent('kr.dlive.app.android.fasttv'),
            encodeURIComponent('diva.net'),
        );
    }

    getIfaType(): string {
        return 'aaid';
    }
}

export class DliveCtvAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(
            os,
            encodeURIComponent('kr.dlive.app.android.fasttv'),
            encodeURIComponent('diva.net'),
        );
    }

    getIfaType(): string {
        return 'aaid';
    }
}

export class LongtvStbAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(
            os,
            encodeURIComponent('kr.dlive.app.android.fasttv'),
            encodeURIComponent('diva.net'),
        );
    }

    getIfaType(): string {
        return 'aaid';
    }
}

export class GooglePlayAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(
            os,
            encodeURIComponent('kr.dlive.app.android.fasttv'),
            encodeURIComponent('diva.net'),
        );
    }

    getIfaType(): string {
        return 'aaid';
    }
}

import { IAdsParameter, UserAgentOS } from '@/type/userAgent';

const ADS_APP_NAME = 'bingekorea';

export abstract class UserAgentAdsParameter implements IAdsParameter {
    private readonly appName = ADS_APP_NAME;

    constructor(
        private readonly os: UserAgentOS,
        private bundleId: string,
        private appstoreUrl: string = '',
        private appVersion: string = '',
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

export class NewidAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(
            os,
            encodeURIComponent('bingekorea'),
            encodeURIComponent('bingekorea.net'),
        );
    }

    getIfaType(): string {
        return 'newid';
    }
}

export class AndroidAgentAdsParameter extends UserAgentAdsParameter {
    constructor(os: UserAgentOS) {
        super(
            os,
            encodeURIComponent('kr.dlive.app.android.fasttv'),
            encodeURIComponent(
                'https://play.google.com/store/apps/details?id=net.itsnewid.app.android.bingekorea',
            ),
        );
    }

    getIfaType(): string {
        return 'aaid';
    }
}

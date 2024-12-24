import { useAtomValue } from 'jotai';
import { IAdsParameter } from '@/type/userAgent';
import { DEFAULT_LOCALE } from '@/app/environment';
import { uuidState } from '@/atom/app';
// import { UUIDGenerator } from '../util/userAgent/uuid';

const DEVICE_ID = `[DEVICE_ID]`;
const APP_NAME = `[APP_NAME]`;
const APP_BUNDLE = `[APP_BUNDLE]`;
const APP_STORE_URL = `[APP_STOREURL]`;
const APP_MODULE_VERSION = '[APP_VERSION]';
const IFA_TYPE = `[IFA_TYPE]`;
const LMT = `[LMT]`;
const COUNTRY = '[COUNTRY]';
const IP = '[IP]';
const UA = '[UA]';
const IFA = '[IFA]';
const PLATFORM_OS = 'platform.os';

export type ReplaceAdsParamsHandler = (
    url: string,
    impl: IAdsParameter,
    additionalParams?: Record<string, string>,
) => string;

const isLimitAdTrackingEnabled = (lmt: string) => Number(lmt) === 1;

export function useMakeAdsUrl(): ReplaceAdsParamsHandler {
    const uuid = useAtomValue(uuidState);
    const country = DEFAULT_LOCALE.country;

    return (url, impl, additionalParams = {}) => {
        const {
            os,
            ua,
            appName,
            appVersion,
            bundleId,
            appstoreUrl,
            ifaType,
            ifa,
            lmt,
        } = impl.params;

        const params = {
            [APP_NAME]: appName,
            [APP_BUNDLE]: bundleId || APP_BUNDLE,
            [APP_STORE_URL]: appstoreUrl || APP_STORE_URL,
            [DEVICE_ID]: uuid || DEVICE_ID,
            [COUNTRY]: country || DEFAULT_LOCALE.country,
            [IFA_TYPE]: ifaType || IFA_TYPE,
            [LMT]: lmt || LMT,
            [APP_MODULE_VERSION]: appVersion,
            [IP]: IP,
            [UA]: ua,
            [IFA]: isLimitAdTrackingEnabled(lmt)
                ? uuid || DEVICE_ID
                : ifa || IFA,
            ...additionalParams,
        };

        let outputUrl = `${url}&${PLATFORM_OS}=${os}`;

        Object.entries(params).forEach(([key, value]) => {
            if (outputUrl.includes(key)) {
                outputUrl = outputUrl.replace(key, value);
            }
        });

        return outputUrl;
    };
}

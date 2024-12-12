import { useAtomValue } from 'jotai';
import { IAdsParameter } from '@/type/userAgent';
import { DEFAULT_LOCALE } from '@/app/environment';
import { ipState, uuidState } from '@/atom/app';
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
    additionalParams?: Record<string, string>
) => string;

const isLimitAdTrackingEnabled = (lmt: string) => Number(lmt) === 1;

// const IP_OBFUSCATION_VALUE = '000';
// const IPV4_DELIMITER = '.';
// const IPV6_DELIMITER = ':';

// const obfuscateIp = (ip: string) => {
//     if (!validateIPAddress(ip)) return ip;

//     const delimiter = ip.includes(IPV6_DELIMITER) ? IPV6_DELIMITER : IPV4_DELIMITER;
//     const ipParts = ip.split(delimiter);

//     if (ipParts.length >= 2) {
//         ipParts[0] = IP_OBFUSCATION_VALUE;
//         ipParts[ipParts.length - 1] = IP_OBFUSCATION_VALUE;
//     }

//     return ipParts.join(delimiter);
// };

// function validateIPAddress(ip: string): boolean {
//     const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
//     const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;

//     if (ipv4Regex.test(ip)) {
//         return ip.split(IPV4_DELIMITER).every((part) => {
//             const num = parseInt(part, 10);
//             return num >= 0 && num <= 255;
//         });
//     }
//     if (ipv6Regex.test(ip)) {
//         return ip.split(IPV6_DELIMITER).every((part) => part.length <= 4);
//     }
//     return false;
// }

// function obfuscateUUID(uuid: string): string {
//     if (!UUIDGenerator.validate(uuid)) return uuid;
//     return uuid.slice(0, -4) + '000x';
// }

export function useMakeAdsUrl(): ReplaceAdsParamsHandler {
    const uuid = useAtomValue(uuidState);
    const ip = useAtomValue(ipState);
    // const { country } = useAtomValue(localeState);
    const country = DEFAULT_LOCALE.country;

    return (url, impl, additionalParams = {}) => {
        const { os, ua, appName, appVersion, bundleId, appstoreUrl, ifaType, ifa, lmt } =
            impl.params;

        const ipValue = ip;

        const params = {
            [APP_NAME]: appName,
            [APP_BUNDLE]: bundleId || APP_BUNDLE,
            [APP_STORE_URL]: appstoreUrl || APP_STORE_URL,
            [DEVICE_ID]: uuid || DEVICE_ID,
            [COUNTRY]: country || DEFAULT_LOCALE.country,
            [IFA_TYPE]: ifaType || IFA_TYPE,
            [LMT]: lmt || LMT,
            [APP_MODULE_VERSION]: appVersion,
            [IP]: encodeURIComponent(ipValue),
            [UA]: ua,
            [IFA]: isLimitAdTrackingEnabled(lmt) ? uuid || DEVICE_ID : ifa || IFA,
            ...additionalParams
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

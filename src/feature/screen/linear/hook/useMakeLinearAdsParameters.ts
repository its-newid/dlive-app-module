import { ReplaceAdsParamsHandler, useMakeAdsUrl } from '@/hook/useMakeAdsUrl';

export function useMakeLinearAdsParameters(): ReplaceAdsParamsHandler {
    const makeAdsUrl = useMakeAdsUrl();

    const makeAdsUrlHandler: ReplaceAdsParamsHandler = (url, impl) => {
        return makeAdsUrl(url, impl);
    };

    return makeAdsUrlHandler;
}

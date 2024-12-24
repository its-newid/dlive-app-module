import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Hls, {
    ErrorData,
    FragLoadedData,
    HlsConfig,
    LevelLoadedData,
    ManifestParsedData,
    SubtitleTracksUpdatedData,
} from 'hls.js';
import { Nullable } from '@/type/common';
import { userAgent } from '@/util/userAgent';
import { ReplaceAdsParamsHandler } from '@/hook/useMakeAdsUrl';

type HlsEventCallback = {
    onManifestParsed: (data: ManifestParsedData) => void;
    onError: (data: ErrorData) => void;
    onSubtitleUpdated?: (data: SubtitleTracksUpdatedData) => void;
    onFragLoaded?: (data: FragLoadedData) => void;
    onLevelLoaded?: (data: LevelLoadedData) => void;
};

type HlsProps = HlsEventCallback & {
    videoRef: RefObject<HTMLVideoElement>;
    url: string;
    config: Partial<HlsConfig>;
    enabled?: boolean;
    onHandleAdsParams: ReplaceAdsParamsHandler;
};

type HlsReturn = {
    readonly hls: Nullable<Hls>;
};

export const useHls = ({
                           url,
                           config,
                           onManifestParsed,
                           onError,
                           videoRef,
                           enabled = true,
                           onHandleAdsParams,
                       }: HlsProps): HlsReturn => {
    const [hls, setHls] = useState<Nullable<Hls>>(null);

    const callbacksRef = useRef({
        onManifestParsed,
        onError,
    });

    useLayoutEffect(() => {
        callbacksRef.current = {
            onManifestParsed,
            onError,
        };
    }, [onManifestParsed, onError]);

    useLayoutEffect(() => {
        if (!url || !videoRef.current || !enabled) {
            return;
        }

        const {
            current: { onManifestParsed, onError },
        } = callbacksRef;

        let adsUrl = url;
        adsUrl = onHandleAdsParams(url, userAgent.adsParameter);

        const newHls = new Hls({ ...config });

        newHls.on(Hls.Events.MANIFEST_PARSED, (event, data) =>
            onManifestParsed(data),
        );

        newHls.on(Hls.Events.ERROR, (event, data) => onError(data));

        newHls.loadSource(adsUrl);
        newHls.attachMedia(videoRef.current);
        newHls.subtitleDisplay = false;

        setHls(newHls);
    }, [url, enabled]);

    useEffect(() => {
        return () => hls?.destroy();
    }, [hls, enabled]);

    return { hls };
};

const liveManifestLoadPolicy = {
    maxTimeToFirstByteMs: 10_000,
    maxLoadTimeMs: 8_000,
    timeoutRetry: {
        maxNumRetry: 0,
        retryDelayMs: 0,
        maxRetryDelayMs: 0,
    },
    errorRetry: {
        maxNumRetry: 0,
        retryDelayMs: 0,
        maxRetryDelayMs: 0,
    },
};

export const commonLinearHlsConfig: Partial<HlsConfig> = {
    // startFragPrefetch: true,
    debug: false,
    lowLatencyMode: true,
    enableWebVTT: true,
    liveDurationInfinity: true,
    backBufferLength: 1,
    nudgeMaxRetry: 10,
    manifestLoadPolicy: {
        default: liveManifestLoadPolicy,
    },
};

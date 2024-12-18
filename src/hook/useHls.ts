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
    videoRef: RefObject<HTMLVideoElement | null>;
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
    onFragLoaded,
    onSubtitleUpdated,
    onLevelLoaded,
    videoRef,
    enabled = true,
    onHandleAdsParams,
}: HlsProps): HlsReturn => {
    const [hls, setHls] = useState<Nullable<Hls>>(null);

    const callbacksRef = useRef({
        onManifestParsed,
        onError,
        onSubtitleUpdated,
        onFragLoaded,
        onLevelLoaded,
    });

    useLayoutEffect(() => {
        callbacksRef.current = {
            onManifestParsed,
            onError,
            onSubtitleUpdated,
            onFragLoaded,
            onLevelLoaded,
        };
    }, [
        onManifestParsed,
        onError,
        onSubtitleUpdated,
        onFragLoaded,
        onLevelLoaded,
    ]);

    useLayoutEffect(() => {
        if (!url || !videoRef.current || !enabled) {
            return;
        }

        const {
            current: {
                onManifestParsed,
                onLevelLoaded,
                onFragLoaded,
                onSubtitleUpdated,
                onError,
            },
        } = callbacksRef;

        let adsUrl = url;
        adsUrl = onHandleAdsParams(url, userAgent.adsParameter);

        const newHls = new Hls({ ...config });

        newHls.on(Hls.Events.MANIFEST_PARSED, (_, data) =>
            onManifestParsed(data),
        );

        newHls.on(Hls.Events.ERROR, (_, data) => onError(data));

        if (onSubtitleUpdated) {
            newHls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) =>
                onSubtitleUpdated(data),
            );
        }

        if (onFragLoaded) {
            newHls.on(Hls.Events.FRAG_LOADED, (_, data) => onFragLoaded(data));
        }

        if (onLevelLoaded) {
            newHls.on(Hls.Events.LEVEL_LOADED, (_, data) =>
                onLevelLoaded(data),
            );
        }

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

const AVERAGE_BITRATE = 5000000;
const MAX_BUFFER_LENGTH = 60;

export const calcMaxBufferSize = (bufferLimit: number) => {
    return Math.min(bufferLimit, AVERAGE_BITRATE * MAX_BUFFER_LENGTH);
};

const vodManifestLoadPolicy = {
    maxTimeToFirstByteMs: 10000,
    maxLoadTimeMs: 8000,
    timeoutRetry: {
        maxNumRetry: 3,
        retryDelayMs: 1000,
        maxRetryDelayMs: 5000,
    },
    errorRetry: {
        maxNumRetry: 3,
        retryDelayMs: 1000,
        maxRetryDelayMs: 5000,
    },
};

export const commonVodHlsConfig: Partial<HlsConfig> = {
    debug: false,
    autoStartLoad: false,
    lowLatencyMode: false,
    enableWebVTT: false,
    liveDurationInfinity: false,
    startLevel: -1,
    maxBufferHole: 0.5,
    maxBufferLength: MAX_BUFFER_LENGTH,
    nudgeMaxRetry: 3,
    manifestLoadPolicy: {
        default: vodManifestLoadPolicy,
    },
};

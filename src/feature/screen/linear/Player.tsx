import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Video, { hasErrorVideoSrc } from '@/component/Video.tsx';
import { commonLinearHlsConfig, useHls } from '@/hook/useHls.ts';
import { ErrorData } from 'hls.js';
import { ERROR_VIDEO_URL } from '@/app/environment.ts';
import {
    isFailedAutoplayError,
    liveScreenOverlayState,
    LiveScreenOverlayType,
    videoErrorState,
    VideoErrorState,
    VideoState,
    videoState
} from '@/atom/screen/linear.ts';
import { useAtom } from 'jotai';
import { Skeleton } from '@/component/Skeleton.tsx';
import { useAtomCallback } from 'jotai/utils';
import { VideoErrorName } from '@/type/common.ts';
import { PlayOverlay } from '@/component/PlayOverlay.tsx';
import { userAgent } from '@/util/userAgent';
import { UserAgentOS } from '@/type/userAgent.ts';
import { useVideo } from '@/feature/screen/linear/hook/useVideo.ts';
import useOverlay from '@/feature/screen/linear/hook/useOverlay.ts';
import { useMakeLinearAdsParameters } from '@/feature/screen/linear/hook/useMakeLinearAdsParameters.ts';

type LiveVideoProps = {
    url: string;
};

export default function Player({ url }: LiveVideoProps) {
    const {
        videoRef,
        videoConfig,
        videoState: state,
        videoPlay,
        videoCallback,
        setLoop,
        setAutoPlay,
        setSrc,
        setMute
    } = useVideo({});

    const getAsyncVideoState = useAtomCallback(
        useCallback((get) => {
            return get(videoState);
        }, [])
    );

    const [errorState, setErrorState] = useAtom(videoErrorState);
    const getAsyncErrorState = useAtomCallback(
        useCallback((get) => {
            return get(videoErrorState);
        }, [])
    );

    const handleError = (data: ErrorData) => {
        if (data.fatal) {
            setErrorState({ type: VideoErrorState.FAILED, message: data.type });
        }
    };

    const handleManifestParsed = async () => {
        try {
            await videoPlay();
        } catch (error) {
            if (error instanceof Error) {
                const { ABORT_ERROR, AUTOPLAY_NOT_ALLOWED } = VideoErrorName;
                const isKnownError =
                    error.name === ABORT_ERROR || error.name === AUTOPLAY_NOT_ALLOWED;

                if (isKnownError) {
                    if (
                        userAgent.type === UserAgentOS.DEFAULT &&
                        getAsyncVideoState() === VideoState.LOADED
                    ) {
                        setErrorState({
                            type: VideoErrorState.FAILED,
                            message: error.name ?? error.message
                        });
                        return;
                    }
                }
            }

            console.error('Failed to play video: An unknown error occurred');
        }
    };

    useHls({
        url,
        videoRef,
        config: commonLinearHlsConfig,
        onError: handleError,
        onManifestParsed: handleManifestParsed,
        onHandleAdsParams: useMakeLinearAdsParameters()
    });

    useEffect(() => {
        if (!videoRef.current) return;

        const { type: errorType } = getAsyncErrorState();

        if (state === VideoState.LOADED) {
            setMute(false);
        } else if (state === VideoState.PLAYING) {
            if (!hasErrorVideoSrc(videoRef.current) && errorType !== VideoErrorState.IDLE) {
                setErrorState({ type: VideoErrorState.IDLE });
            }
        }
    }, [state]);

    useEffect(() => {
        setErrorState({ type: VideoErrorState.IDLE });
    }, [url]);

    const getCurrentOverlay = useAtomCallback(
        useCallback((get) => {
            return get(liveScreenOverlayState);
        }, [])
    );
    const { showOverlay, removeOverlay } = useOverlay();
    useEffect(() => {
        if (state !== VideoState.PLAYING) return;

        const currentOverlay = getCurrentOverlay();

        const { MINI_BANNER, CHANNEL_BANNER } = LiveScreenOverlayType;

        switch (currentOverlay) {
            case MINI_BANNER:
                showOverlay({ type: MINI_BANNER });
                break;
            case CHANNEL_BANNER:
                showOverlay({ type: CHANNEL_BANNER });
                break;
        }
    }, [state]);

    useEffect(() => {
        const isError = errorState.type === VideoErrorState.FAILED;

        if (isError) {
            if (isFailedAutoplayError(errorState)) {
                removeOverlay();
            } else {
                setSrc(ERROR_VIDEO_URL);
            }
        }

        setLoop(isError);
        setAutoPlay(isError);
    }, [errorState]);

    const togglePlay = useCallback(() => videoPlay(), [videoPlay]);

    return url ? (
        <>
            <Video {...videoConfig} ref={videoCallback} />
            {state === VideoState.IDLE && <SkeletonLoader />}
            {isFailedAutoplayError(errorState) && <PlayOverlay onPlay={togglePlay} />}
        </>
    ) : (
        <DefaultBackground />
    );
}

const DefaultBackground = styled.div`
    z-index: -1;
    width: 100%;
    background: ${({ theme }) => theme.colors.grey80};
`;

const SkeletonLoader = styled(Skeleton)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

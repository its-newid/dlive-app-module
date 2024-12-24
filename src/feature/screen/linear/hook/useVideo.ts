import { RefObject, useCallback, useEffect, useRef } from 'react';
import { Nullable, Optional } from '@/type/common';
import { LinearVideoState, videoState, VideoState } from '@/atom/screen/linear';
import { useAtom } from 'jotai';
import { VideoConfig } from '@/component/Video';

export interface VideoProps {
    config?: Partial<VideoConfig>;
    src?: string;
}

interface VideoReturn {
    readonly videoConfig: VideoConfig;
    readonly videoState: LinearVideoState;
    videoPlay: () => Optional<Promise<void>>;
    setMute: (muted: boolean) => void;
    setLoop: (loop: boolean) => void;
    setSrc: (src: string) => void;
    setAutoPlay: (autoplay: boolean) => void;
    videoRef: RefObject<HTMLVideoElement | null>;
    videoCallback: (node: Nullable<HTMLVideoElement>) => void;
}

export const useVideo = ({
    config = defaultVideoConfig,
}: VideoProps): VideoReturn => {
    const playerRef = useRef<HTMLVideoElement | null>(null);

    const _config = { ...defaultVideoConfig, ...config };
    const configRef = useRef<VideoConfig>({
        muted: _config.muted,
        autoPlay: _config.autoPlay,
        loop: _config.loop,
    });

    const [state, setState] = useAtom(videoState);

    const setMute = (muted: boolean) => {
        const { current: state } = configRef;
        configRef.current = { ...state, muted: muted };

        const { current: player } = playerRef;
        if (player) {
            player.muted = muted;
        }
    };

    const setLoop = (loop: boolean) => {
        const { current: state } = configRef;
        configRef.current = { ...state, loop: loop };

        const { current: player } = playerRef;
        if (player) {
            player.loop = loop;
        }
    };

    const setAutoPlay = (autoPlay: boolean) => {
        const { current: state } = configRef;
        configRef.current = { ...state, autoPlay: autoPlay };

        const { current: player } = playerRef;
        if (player) {
            player.autoplay = autoPlay;
        }
    };

    const setSrc = (src: string) => {
        const { current: player } = playerRef;
        if (player) {
            player.src = src;
        }
    };

    const play = () => {
        const playPromise = playerRef.current?.play();

        if (playPromise) {
            return playPromise
                .then(() => {
                    setState(VideoState.PLAYING);
                    return;
                })
                .catch((error) => {
                    if (error instanceof Error) {
                        throw error;
                    } else {
                        throw new Error('An unknown error occurred');
                    }
                });
        } else {
            return;
        }
    };

    const handleLoad = useCallback(() => {
        setState(VideoState.LOADED);
    }, []);

    const handleEmptied = useCallback(() => {
        if (state !== VideoState.IDLE) {
            setState(VideoState.IDLE);
        }
    }, [state]);

    const manageEventListeners = (
        node: Nullable<HTMLVideoElement>,
        action: 'add' | 'remove',
    ) => {
        if (!node) return;

        const method =
            action === 'add' ? 'addEventListener' : 'removeEventListener';
        node[method]('emptied', handleEmptied);
        node[method]('loadedmetadata', handleLoad);
    };

    const videoCallback = useCallback(
        (node: Nullable<HTMLVideoElement>) => {
            if (playerRef.current) {
                manageEventListeners(playerRef.current, 'remove');
            }

            if (node) {
                playerRef.current = node;
                manageEventListeners(node, 'add');
            }
        },
        [handleEmptied, handleLoad],
    );

    useEffect(() => {
        if (state !== VideoState.IDLE) {
            setState(VideoState.IDLE);
        }
    }, []);

    return {
        videoConfig: configRef.current,
        videoState: state,
        videoRef: playerRef,
        videoCallback,
        videoPlay: play,
        setMute,
        setLoop,
        setSrc,
        setAutoPlay,
    };
};

const defaultVideoConfig: VideoConfig = {
    autoPlay: false,
    muted: true,
    loop: false,
};

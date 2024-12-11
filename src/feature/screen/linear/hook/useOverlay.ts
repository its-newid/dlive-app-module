import { useSetAtom } from 'jotai';
import {
    LiveScreenOverlay,
    LiveScreenOverlayType,
    VideoState,
    videoState,
    writeLiveScreenOverlay,
} from '../../../../atom/screen/linear';
import { ScreenOverlayConfig } from '../../../../type/common';
import { useCallback } from 'react';
import { useAtomCallback } from 'jotai/utils';

export default function useOverlay() {
    const setCurrentOverlay = useSetAtom(writeLiveScreenOverlay);

    const getIsVideoLoading = useAtomCallback(
        useCallback((get) => {
            return get(videoState) === VideoState.IDLE;
        }, [])
    );

    const showOverlay = ({
        type,
        needDelay,
    }: {
        type: LiveScreenOverlayType;
        needDelay?: boolean;
    }) => {
        const overlay = getOverlay(type);
        if (!overlay) return;

        const keepShowing =
            needDelay === undefined ? getIsVideoLoading() : !needDelay;

        const config: ScreenOverlayConfig = keepShowing
            ? { state: 'infinite' }
            : { state: 'delayed', duration: overlay.timeout };
        setCurrentOverlay({
            type: overlay.type,
            config,
        });
    };

    const removeOverlay = () => {
        setCurrentOverlay({ type: LiveScreenOverlayType.IDLE });
    };

    return { showOverlay, removeOverlay };
}

const getOverlay = (type: LiveScreenOverlayType) => {
    return Object.values(ScreenOverlayMap).find((value) => value.type === type);
};

const getTimeout = {
    [LiveScreenOverlayType.IDLE]: 0,
    [LiveScreenOverlayType.CHANNEL_BANNER]: 5000,
    [LiveScreenOverlayType.MINI_BANNER]: 5000,
    [LiveScreenOverlayType.SUBTITLE_TRACK_SHEET]: 5000,
    [LiveScreenOverlayType.GUIDE]: 30_000,
    [LiveScreenOverlayType.FULL_DESCRIPTION]: 30_000,
};

type TScreenOverlayMap = {
    [key in keyof typeof LiveScreenOverlayType]: LiveScreenOverlay;
};

const ScreenOverlayMap = Object.entries(LiveScreenOverlayType).reduce(
    (acc, [key, value]) => {
        return {
            ...acc,
            [key]: {
                type: value,
                timeout: getTimeout[value],
            },
        };
    },
    {} as TScreenOverlayMap
);

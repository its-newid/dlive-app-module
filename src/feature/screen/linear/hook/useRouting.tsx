import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAtomCallback } from 'jotai/utils';
import { useSetAtom } from 'jotai';

import useOverlay from '@/feature/screen/linear/hook/useOverlay';
import {
    channelNowState,
    channelSelector,
    selectedChannelSelector,
} from '@/atom/screen';
import { LiveScreenOverlayType } from '@/atom/screen/linear';
import { RoutePath } from '@/type/routePath';

export const ChannelUpdateState = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
} as const;
export type ChannelUpdateState =
    (typeof ChannelUpdateState)[keyof typeof ChannelUpdateState];

export function useParamsUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [channelUpdateState, setChannelUpdateState] =
        useState<ChannelUpdateState>(ChannelUpdateState.PENDING);

    const getCurrentChannel = useAtomCallback(
        useCallback((get) => get(channelNowState), []),
    );

    const getChannelById = useAtomCallback(
        useCallback((get, _, channelId: string) => {
            return get(channelSelector(channelId));
        }, []),
    );

    useEffect(() => {
        const currentChannel = getCurrentChannel();
        const channelId = id ?? currentChannel?.contentId;
        if (!channelId) {
            navigate(RoutePath.ERROR);
            return;
        }

        const channel = getChannelById(channelId);
        if (!channel) {
            navigate(RoutePath.ERROR);
            return;
        }

        if (currentChannel?.contentId !== channelId) {
            navigate(RoutePath.ERROR);
            return;
        }

        setChannelUpdateState(ChannelUpdateState.SUCCESS);
    }, [id]);

    return { channelUpdateState };
}

export function useInitialOverlay() {
    const { state } = useLocation();

    const { showOverlay } = useOverlay();

    const setGuideChannel = useSetAtom(selectedChannelSelector);

    const getCurrentChannel = useAtomCallback(
        useCallback((get) => get(channelNowState), []),
    );

    useEffect(() => {
        const currentChannel = getCurrentChannel();
        if (!currentChannel) return;

        const overlay =
            state?.overlayType ?? LiveScreenOverlayType.CHANNEL_BANNER;

        const isGuideOverlay = overlay === LiveScreenOverlayType.GUIDE;
        if (isGuideOverlay) {
            setGuideChannel(currentChannel.contentId);
        }

        showOverlay({ type: overlay, needDelay: isGuideOverlay });
    }, [state]);

    useEffect(() => {
        const clearStateOnPageLoad = () => {
            state && window.history.replaceState(null, document.title);
        };

        window.addEventListener('beforeunload', clearStateOnPageLoad);
        return () =>
            window.removeEventListener('beforeunload', clearStateOnPageLoad);
    }, []);
}

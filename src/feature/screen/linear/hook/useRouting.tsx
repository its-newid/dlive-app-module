import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router';
import { useAtomCallback } from 'jotai/utils';
import { useSetAtom } from 'jotai';
import { Optional } from '@/type/common';
import { Channel } from '@/type/linear';
import { RoutePath } from '@/type/routePath';
import useOverlay from '@/feature/screen/linear/hook/useOverlay';
import { channelNowState, channelSelector, selectedChannelSelector } from '@/atom/screen';
import { LiveScreenOverlayType } from '@/atom/screen/linear';

export const ChannelUpdateState = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS'
} as const;
export type ChannelUpdateState = (typeof ChannelUpdateState)[keyof typeof ChannelUpdateState];

export function useParamsUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [channelUpdateState, setChannelUpdateState] = useState<ChannelUpdateState>(
        ChannelUpdateState.PENDING
    );

    const setChannelNow = useAtomCallback(
        useCallback((_, set, channel: Optional<Channel>) => {
            set(channelNowState, channel);
        }, [])
    );

    const getCurrentChannel = useAtomCallback(useCallback((get) => get(channelNowState), []));

    const getChannelById = useAtomCallback(
        useCallback((get, _, channelId: string) => {
            return get(channelSelector(channelId));
        }, [])
    );

    useEffect(() => {
        const currentChannel = getCurrentChannel();
        const channelId = id ?? currentChannel?.contentId;
        if (!channelId) {
            // FIXME: 채널 없을 때 에러 페이지 이동
            navigate(RoutePath.ERROR);
            return;
        }

        const channel = getChannelById(channelId);
        if (!channel) {
            // FIXME: 채널 없을 때 에러 페이지 이동
            navigate(RoutePath.ERROR);
            return;
        }

        if (currentChannel?.contentId !== channelId) {
            setChannelNow(channel);
        }

        setChannelUpdateState(ChannelUpdateState.SUCCESS);
    }, [id]);

    return { channelUpdateState };
}

export function useInitialOverlay() {
    const { state } = useLocation();

    const { showOverlay } = useOverlay();

    const setGuideChannel = useSetAtom(selectedChannelSelector);

    const getCurrentChannel = useAtomCallback(useCallback((get) => get(channelNowState), []));

    useEffect(() => {
        const currentChannel = getCurrentChannel();
        if (!currentChannel) return;

        const overlay = state?.overlayType ?? LiveScreenOverlayType.CHANNEL_BANNER;

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
        return () => window.removeEventListener('beforeunload', clearStateOnPageLoad);
    }, []);
}

import { useCallback, useEffect } from 'react';
import { useChannelZapping } from '../hook/useChannelZapping';
import useOverlay from '../hook/useOverlay';
import { ENTER, ESCAPE, onDefaultUIEvent } from '@/util/eventKey';
import { MiniBanner } from './MiniBanner';
import { ChannelBanner } from './ChannelBanner';
import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import {
    ChannelBannerToolMenu,
    currentToolbarMenuState,
    isToastVisibleState,
    isVideoAutoplayBlockedState,
    liveScreenOverlayState,
    LiveScreenOverlayType
} from '@/atom/screen/linear';

function Banner() {
    const { IDLE, MINI_BANNER, CHANNEL_BANNER, FULL_DESCRIPTION } = LiveScreenOverlayType;

    const navigate = useNavigate();
    const { showOverlay } = useOverlay();
    const currentOverlay = useAtomValue(liveScreenOverlayState);
    const isToastVisible = useAtomValue(isToastVisibleState);
    const isVideoAutoplayBlocked = useAtomValue(isVideoAutoplayBlockedState);
    const setToolbarMenu = useSetAtom(currentToolbarMenuState);

    const isCurrentOverlayIncludes = useCallback(
        (types: LiveScreenOverlayType[]) => types.some((type) => type === currentOverlay),
        [currentOverlay]
    );

    const onChangedChannel = useCallback(() => {
        switch (currentOverlay) {
            case IDLE:
            case MINI_BANNER:
                showOverlay({ type: MINI_BANNER });
                break;
            case CHANNEL_BANNER:
                showOverlay({ type: CHANNEL_BANNER });
                break;
        }
    }, [currentOverlay]);
    const { channelNow } = useChannelZapping({
        enable: isCurrentOverlayIncludes([IDLE, MINI_BANNER, CHANNEL_BANNER]) && !isToastVisible,
        callback: onChangedChannel
    });

    useEffect(() => {
        return () => {
            setToolbarMenu(ChannelBannerToolMenu.GUIDE);
        };
    }, []);

    useEffect(() => {
        if (!isCurrentOverlayIncludes([IDLE, MINI_BANNER])) return;

        function handleKeyDown(event: KeyboardEvent) {
            event.preventDefault();

            const { keyCode } = event;

            if (keyCode === ENTER) {
                if (isVideoAutoplayBlocked) return;

                showOverlay({ type: CHANNEL_BANNER });
            }

            if (keyCode === ESCAPE) {
                navigate(-1);
                event.stopPropagation();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentOverlay, channelNow, isVideoAutoplayBlocked]);

    const handleClick = useCallback(() => {
        if (isCurrentOverlayIncludes([IDLE, MINI_BANNER])) {
            if (isVideoAutoplayBlocked) return;

            showOverlay({ type: CHANNEL_BANNER });
        }
    }, [currentOverlay, isVideoAutoplayBlocked]);

    return (
        <Container onClick={onDefaultUIEvent(handleClick)}>
            {currentOverlay === LiveScreenOverlayType.MINI_BANNER && <MiniBanner />}
            {isCurrentOverlayIncludes([CHANNEL_BANNER, FULL_DESCRIPTION]) && <ChannelBanner />}
        </Container>
    );
}

export default Banner;

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

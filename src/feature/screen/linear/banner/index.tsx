import { useCallback, useEffect } from 'react';
import { useChannelZapping } from '../hook/useChannelZapping';
import useOverlay from '../hook/useOverlay';
import { ENTER, ESCAPE, onDefaultUIEvent } from '@/util/eventKey';
import { MiniBanner } from './MiniBanner';
import { ChannelBanner } from './ChannelBanner';
import { useAtomValue, useSetAtom } from 'jotai';
import styled, { css } from 'styled-components';
import {
    ChannelBannerToolMenu,
    currentToolbarMenuState,
    isVideoAutoplayBlockedState,
    liveScreenOverlayState,
    LiveScreenOverlayType,
} from '@/atom/screen/linear';
import useToast, { TOAST_ANIMATION } from '../hook/useToast';
import { closeApp } from '@/util/closeApp';
import { userAgent } from '@/util/userAgent';
import { AnimationType, Group } from '@/component/anim/Group';
import { useTranslation } from 'react-i18next';

function Banner() {
    const { IDLE, MINI_BANNER, CHANNEL_BANNER, FULL_DESCRIPTION } =
        LiveScreenOverlayType;
    const { showOverlay } = useOverlay();
    const currentOverlay = useAtomValue(liveScreenOverlayState);
    const isVideoAutoplayBlocked = useAtomValue(isVideoAutoplayBlockedState);
    const setToolbarMenu = useSetAtom(currentToolbarMenuState);
    const { isToastVisible, message, showToast } = useToast();

    const { t } = useTranslation();

    const isCurrentOverlayIncludes = useCallback(
        (types: LiveScreenOverlayType[]) =>
            types.some((type) => type === currentOverlay),
        [currentOverlay],
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
        enable:
            isCurrentOverlayIncludes([IDLE, MINI_BANNER, CHANNEL_BANNER]) &&
            !isToastVisible,
        callback: onChangedChannel,
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

            if (!isToastVisible && keyCode === ENTER) {
                if (isVideoAutoplayBlocked) return;

                showOverlay({ type: CHANNEL_BANNER });
            }

            if (keyCode === ESCAPE) {
                showToast(t('press_back_again_to_exit'));
                event.stopPropagation();
            }

            if (isToastVisible && event.keyCode === ESCAPE) {
                closeApp(userAgent.type);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentOverlay, channelNow, isVideoAutoplayBlocked, isToastVisible]);

    const handleClick = useCallback(() => {
        if (isCurrentOverlayIncludes([IDLE, MINI_BANNER])) {
            if (isVideoAutoplayBlocked) return;

            showOverlay({ type: CHANNEL_BANNER });
        }
    }, [currentOverlay, isVideoAutoplayBlocked]);

    return (
        <Container onClick={onDefaultUIEvent(handleClick)}>
            {currentOverlay === LiveScreenOverlayType.MINI_BANNER && (
                <MiniBanner />
            )}
            {isCurrentOverlayIncludes([CHANNEL_BANNER, FULL_DESCRIPTION]) && (
                <ChannelBanner />
            )}
            {isToastVisible && (
                <Toast $isVisible={isToastVisible} role={'status'}>
                    {message}
                </Toast>
            )}
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

const Toast = styled.div<{ $isVisible: boolean }>`
    position: absolute;
    display: flex;
    bottom: 0;
    width: 100%;
    height: 128rem;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.main};
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 38rem/46rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.blackAlpha100};

    ${({ $isVisible }) =>
        $isVisible &&
        css`
            animation:
                ${Group[AnimationType.SLIDE_IN]} ${TOAST_ANIMATION.DURATION}ms,
                ${Group[AnimationType.SLIDE_OUT]} ${TOAST_ANIMATION.DURATION}ms
                    ${TOAST_ANIMATION.DELAY}ms;
        `};
    animation-fill-mode: forwards;
`;

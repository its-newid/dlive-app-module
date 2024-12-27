import {
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import styled, { css } from 'styled-components';
import useOverlay from '../hook/useOverlay';
import { ContentType, ErrorMessage, Nullable, Optional } from '@/type/common';
import { ENTER, ESCAPE, LEFT, RIGHT } from '@/util/eventKey';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import useMyList from '@/hook/useMyList';
import { coerceIn } from '@/util/common';
import { ButtonType, Child, ToolButton } from './ToolButton';
import MoreIcon from '@/asset/icMore.svg?react';
import { MyListButton as StyledMyListButton } from '@/component/MyListButton';
import useToast, { TOAST_ANIMATION } from '../hook/useToast';
import { RESET } from 'jotai/utils';
import { channelNowState, selectedChannelSelector } from '@/atom/screen';
import {
    ChannelBannerToolMenu,
    currentToolbarMenuState,
    findAiringEpisode,
    LiveScreenOverlayType,
    isFullDescriptionVisibleState,
    liveScreenOverlayState,
} from '@/atom/screen/linear';
import { t } from 'i18next';
import { AnimationType, Group } from '@/component/anim/Group.tsx';

export function Toolbar() {
    const menuRef = useRef(new Map());

    const [currentMenu, setMenu] = useAtom(currentToolbarMenuState);
    const currentChannel = useAtomValue(channelNowState);
    const isFullDescriptionVisible = useAtomValue(
        isFullDescriptionVisibleState,
    );

    const menuList: ChannelBannerToolMenu[] = useMemo(() => {
        // 자막 숨김처리
        return Object.values(ChannelBannerToolMenu);
    }, []);

    const { isToastVisible, showToast, removeToast, message } = useToast();
    const { showOverlay, removeOverlay } = useOverlay();

    useEffect(() => {
        const currentMenuItem = menuRef.current?.get(currentMenu);
        !isToastVisible ? currentMenuItem?.focus() : currentMenuItem?.blur();
    }, [currentMenu, isToastVisible]);

    const handleMessage = (message: string) => {
        showOverlay({ type: LiveScreenOverlayType.CHANNEL_BANNER });
        showToast(message);
    };

    const canGuideOpen = useMemo(() => {
        const schedule = currentChannel?.schedule;
        const hasCategory = currentChannel?.categoryIdx;
        return schedule ? findAiringEpisode(schedule) && hasCategory : false;
    }, [currentChannel]);

    useEffect(() => {
        return () => setMenu(RESET);
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            event.preventDefault();
            const { keyCode } = event;

            if (
                isFullDescriptionVisible &&
                ![ENTER, ESCAPE].includes(keyCode)
            ) {
                return;
            }

            const changeMenu = () => {
                if (isToastVisible) return;
                const delta = keyCode === LEFT ? -1 : 1;
                const currentIndex = menuList.findIndex(
                    (menu) => menu === currentMenu,
                );
                const targetIndex = coerceIn(
                    currentIndex + delta,
                    0,
                    menuList.length - 1,
                );
                setMenu(menuList[targetIndex]);
                showOverlay({ type: LiveScreenOverlayType.CHANNEL_BANNER });
            };

            const handleAction = {
                [LEFT]: changeMenu,
                [RIGHT]: changeMenu,
                [ESCAPE]: () => {
                    if (isToastVisible) {
                        removeToast();
                    } else if (isFullDescriptionVisible) {
                        showOverlay({
                            type: LiveScreenOverlayType.CHANNEL_BANNER,
                            needDelay: true,
                        });
                    } else {
                        removeOverlay();
                    }
                },
            };
            handleAction[keyCode]?.();
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentMenu, isFullDescriptionVisible, isToastVisible]);

    return (
        <>
            <Container>
                <ToolbarLeft>
                    {!isFullDescriptionVisible && (
                        <>
                            <GuideButton
                                showMessage={handleMessage}
                                canGuideOpen={canGuideOpen}
                                menuRef={menuRef}
                            />
                            <MyListButton menuRef={menuRef} />
                        </>
                    )}
                </ToolbarLeft>
                <ToolbarRight>
                    <MoreButton menuRef={menuRef} />
                </ToolbarRight>
            </Container>
            {isToastVisible && !canGuideOpen && (
                <Toast $isVisible={isToastVisible}>{message}</Toast>
            )}
        </>
    );
}

type ButtonProps = {
    menuRef: MutableRefObject<Map<ChannelBannerToolMenu, HTMLElement>>;
};

type GuideButtonProps = ButtonProps & {
    canGuideOpen: false | Optional<number>;
    showMessage: (message: string) => void;
};

const GuideButton = ({
    menuRef,
    canGuideOpen,
    showMessage,
    ...rest
}: GuideButtonProps) => {
    const { showOverlay } = useOverlay();

    const setToolbarMenu = useSetAtom(currentToolbarMenuState);
    const currentChannel = useAtomValue(channelNowState);

    const type = useMemo(() => ChannelBannerToolMenu.GUIDE, []);
    const callbackRef = useCallback((node: HTMLDivElement) => {
        menuRef.current?.set(type, node);
    }, []);

    const setSelectedChannelId = useSetAtom(selectedChannelSelector);

    const elements: Child = {
        type: ButtonType.TEXT_ONLY,
        elements: (
            <span key={type}>{t('live_screen_channel_banner_guide')}</span>
        ),
    };

    const handleClick = () => {
        setToolbarMenu(ChannelBannerToolMenu.GUIDE);

        if (!currentChannel || !canGuideOpen) {
            showMessage(t(ErrorMessage.NO_DATA_AVAILABLE));
            return;
        }

        setSelectedChannelId(currentChannel.contentId);
        showOverlay({ type: LiveScreenOverlayType.GUIDE, needDelay: true });
    };

    return (
        <ToolButton
            item={elements}
            onClick={handleClick}
            ref={callbackRef}
            {...rest}
        />
    );
};

const MyListButton = ({ menuRef, ...rest }: ButtonProps) => {
    const { showOverlay } = useOverlay();

    const setToolbarMenu = useSetAtom(currentToolbarMenuState);
    const currentChannel = useAtomValue(channelNowState);

    const { isMyList, toggleMyList } = useMyList();
    const isMyListChannel = currentChannel
        ? isMyList({
              contentId: currentChannel.contentId,
              type: ContentType.LINEAR,
          })
        : false;

    const type = useMemo(() => ChannelBannerToolMenu.MY_LIST, []);
    const callbackRef = useCallback(
        (node: Nullable<HTMLDivElement>) => {
            if (!node) return;
            menuRef.current?.set(type, node);
        },
        [isMyListChannel],
    );

    const elements: Child = {
        type: ButtonType.BOTH,
        elements: (
            <>
                <StyledMyListButton
                    key={`${type}.img`}
                    isMyList={isMyListChannel}
                />
                <span key={`${type}.txt`}>
                    {t('live_screen_channel_banner_my_list')}
                </span>
            </>
        ),
    };

    const handleClick = () => {
        showOverlay({ type: LiveScreenOverlayType.CHANNEL_BANNER });
        setToolbarMenu(ChannelBannerToolMenu.MY_LIST);
        currentChannel &&
            toggleMyList({
                contentId: currentChannel.contentId,
                type: ContentType.LINEAR,
            });
    };

    return (
        <ToolButton
            item={elements}
            onClick={handleClick}
            ref={callbackRef}
            {...rest}
        />
    );
};

const MoreButton = ({ menuRef, ...rest }: ButtonProps) => {
    const [isFullDescriptionVisible, setIsFullDescriptionVisible] = useAtom(
        isFullDescriptionVisibleState,
    );
    const setCurrentOverlay = useSetAtom(liveScreenOverlayState);
    const { showOverlay } = useOverlay();

    const setToolbarMenu = useSetAtom(currentToolbarMenuState);

    const type = useMemo(() => ChannelBannerToolMenu.FULL_DESCRIPTION, []);
    const callbackRef = useCallback((node: HTMLDivElement) => {
        menuRef.current?.set(type, node);
    }, []);

    const elements: Child = isFullDescriptionVisible
        ? {
              type: ButtonType.TEXT_ONLY,
              elements: (
                  <span key={type}>
                      {t('live_screen_channel_banner_full_description_close')}
                  </span>
              ),
          }
        : {
              type: ButtonType.BOTH,
              elements: (
                  <>
                      <MoreIcon key={`${type}.img`} />
                      <span key={type}>
                          {t('live_screen_channel_banner_full_description')}
                      </span>
                  </>
              ),
          };

    const handleClick = () => {
        if (!isFullDescriptionVisible) {
            setToolbarMenu(ChannelBannerToolMenu.FULL_DESCRIPTION);
            showOverlay({
                type: LiveScreenOverlayType.FULL_DESCRIPTION,
                needDelay: true,
            });
            setCurrentOverlay(LiveScreenOverlayType.FULL_DESCRIPTION);
            setIsFullDescriptionVisible(true);
        } else {
            showOverlay({
                type: LiveScreenOverlayType.IDLE,
            });
        }
    };

    return (
        <ToolButton
            item={elements}
            onClick={handleClick}
            ref={callbackRef}
            {...rest}
        />
    );
};

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 6rem 72rem 50rem;
    background: ${({ theme }) => theme.colors.grey90};
`;
const ToolbarLeft = styled.div`
    display: flex;
    align-items: center;
    & > *:nth-child(2) {
        margin-right: 16px;
    }
    & > *:last-child {
        margin-left: 32px;
    }
`;

const ToolbarRight = styled.div``;

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

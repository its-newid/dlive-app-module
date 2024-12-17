import styled from 'styled-components';
import { ContentType, ThumbRatio, ThumbSizes } from '@/type/common';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { ENTER, LEFT, onDefaultUIEvent } from '@/util/eventKey';
import { MyListButton } from '@/component/MyListButton';
import { MY_LIST_CATEGORY_IDX, RowChildProps } from './Listings';
import { useAtomCallback } from 'jotai/utils';
import useOverlay from '../hook/useOverlay';
import { LoadThumbnail } from '../LoadThumbnail';
import {
    currentScheduleState,
    ScheduleChannel,
    selectedChannelSelector,
    totalChannelState,
} from '@/atom/screen';
import {
    currentScheduleFocusState,
    findAiringEpisode,
    LiveScreenOverlayType,
    ScheduleFocusState,
} from '@/atom/screen/linear';
import { RowState, rowStyle } from './EpisodeCell';
import useMyList from '@/hook/useMyList';

type ChannelInfoProps = RowChildProps & {
    channel: ScheduleChannel;
};

export function ChannelRow({
    channel,
    states,
    schedule,
    onChangeChannel,
}: ChannelInfoProps) {
    const { showOverlay } = useOverlay();
    const { isMyList, toggleMyList } = useMyList();
    const isMyListChannel = isMyList({
        contentId: channel.contentId,
        type: ContentType.LINEAR,
    });
    const setFocus = useSetAtom(currentScheduleFocusState);
    const setSchedule = useSetAtom(currentScheduleState);
    const onAirSchedule = findAiringEpisode(schedule);

    const changeFocusToFirstRow = useAtomCallback(
        useCallback((get, set) => {
            const channels = Array.from(get(totalChannelState).values()).flat();
            const firstChannelItem = channels?.[0];
            set(selectedChannelSelector, firstChannelItem);
        }, []),
    );

    const handleFavClick = () => {
        showOverlay({
            type: LiveScreenOverlayType.GUIDE,
            needDelay: true,
        });
        toggleMyList({
            contentId: channel.contentId,
            type: ContentType.LINEAR,
        });

        if (channel.categoryIdx === MY_LIST_CATEGORY_IDX) {
            changeFocusToFirstRow();
        }
    };
    const handleFavKeyDown = (event: React.KeyboardEvent) => {
        event.preventDefault();
        const { keyCode } = event;

        if (keyCode === LEFT) {
            setFocus(ScheduleFocusState.NAV);
        }
        if (keyCode === ENTER) {
            event.stopPropagation();
            handleFavClick();
        }
    };

    const handleFocus = () => setSchedule(onAirSchedule ?? null);

    return (
        <Container onFocus={handleFocus}>
            <FavContainer
                states={states}
                onClick={onDefaultUIEvent(handleFavClick)}
                onKeyDown={onDefaultUIEvent(handleFavKeyDown)}
                role={'button'}
            >
                <MyListButton id={'myList'} isMyList={isMyListChannel} />
                <span className={'number'} id={`ch_no-${channel.no}`}>
                    {channel.no}
                </span>
            </FavContainer>
            <Thumbnail
                alt={channel?.title}
                src={
                    channel?.thumbUrl?.[ThumbRatio.WIDE]?.[ThumbSizes.SMALL] ??
                    ''
                }
                onClick={onChangeChannel}
            />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    min-width: fit-content;
    margin-left: 24rem;
    padding: 10rem 10rem 10rem 0;
`;

const FavContainer = styled.div.attrs({ tabIndex: 0 })<{ states: RowState[] }>`
    display: flex;
    min-width: fit-content;
    margin-right: 10rem;
    padding: 27rem 18rem 27rem 14rem;
    align-items: center;
    border-radius: 16rem;
    ${({ states }) => rowStyle(states).backgroundColor};

    svg {
        width: 36rem;
        height: 36rem;
        margin-right: 2rem;
        color: ${({ theme }) => theme.colors.grey20};
    }

    .number {
        width: 48rem;
        font-size: 24rem;
        line-height: 32rem;
        font-family: ${({ theme }) => theme.fonts.family.pretendard};
        color: ${({ theme }) => theme.colors.whiteAlpha89};
    }

    :hover:not(:focus) {
        outline: none;
        background: ${({ theme }) => theme.colors.grey50};
    }

    :focus {
        outline: none;
        background: ${({ theme }) => theme.colors.main};

        svg {
            color: ${({ theme }) => theme.colors.grey80};
        }
        .number {
            color: ${({ theme }) => theme.colors.grey90};
            font-weight: ${({ theme }) => theme.fonts.weight.bold};
        }
    }
`;

const Thumbnail = styled(LoadThumbnail)`
    position: relative;
    width: 160rem;
    min-width: 160rem;
    height: 90rem;

    :after {
        content: '';
        position: absolute;
        display: block;
        width: 168rem;
        height: 98rem;
        border-radius: 26rem;
        border: 6rem solid transparent;
        transform: translate(-10rem, -10rem);
        top: 0;
    }

    :hover:not(:focus) {
        outline: none;
        :after {
            border: 6rem solid ${({ theme }) => theme.colors.grey50};
        }
    }

    :focus {
        outline: none;
        :after {
            border: 6rem solid ${({ theme }) => theme.colors.main};
        }
    }
`;

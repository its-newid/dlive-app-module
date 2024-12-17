import React, { ReactNode, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    useItemNumbersInListings,
    useListingsTable,
} from '../hook/useListingsTable';
import useOverlay from '../hook/useOverlay';
import { EpisodeRow } from './EpisodeRow';
import { coerceAtMost, coerceIn } from '@/util/common';
import { ChannelRow } from './ChannelRow';
import SelectedIcon from '@/asset/icSelectedTriangle.svg';
import { MyListCategory } from '@/type/category';
import { ChannelEpisode } from '@/type/linear';
import {
    currentScheduleFocusState,
    LiveScreenOverlayType,
    ScheduleFocusState,
    scheduleOfChannelSelector,
    timeBarOffsetReducer,
    timeBarOffsetState,
    timeBarOffsetValuesSelector,
} from '@/atom/screen/linear';
import {
    channelNowState,
    EmptyMyListItem,
    findChannelByIdSelector,
    ScheduleChannel,
    selectedChannelState,
    selectedChannelSelector,
    totalChannelState,
} from '@/atom/screen';
import { KeyboardEventListener, Nullable } from '@/type/common';
import EpisodeCell, { EpisodeCellProps, RowState } from './EpisodeCell';
import { useAtomCallback } from 'jotai/utils';
import { ENTER, LEFT } from '@/util/eventKey';
import { useReducerAtom } from 'jotai/utils';
import { t } from 'i18next';

export const MY_LIST_CATEGORY_IDX = MyListCategory.idx;

export default function Listings() {
    const setSelectedChannel = useSetAtom(selectedChannelSelector);
    const channelMap = useAtomValue(totalChannelState);
    const channels = useMemo(
        () => Array.from(channelMap.values()).flat(),
        [channelMap],
    );

    const getChannel = useAtomCallback(
        useCallback((get, set, channelId: string) => {
            return get(findChannelByIdSelector(channelId));
        }, []),
    );

    const [currentScheduleFocus, setScheduleFocus] = useAtom(
        currentScheduleFocusState,
    );
    const isFocused = useMemo(
        () => currentScheduleFocus === ScheduleFocusState.LISTINGS,
        [currentScheduleFocus],
    );

    const timeBarOffsetValues = useAtomValue(timeBarOffsetValuesSelector);
    const selectedChannel = useAtomValue(selectedChannelState);

    const { itemNumbers, setRef } = useItemNumbersInListings();

    const [, dispatch] = useReducerAtom(
        timeBarOffsetState,
        timeBarOffsetReducer,
    );

    const visibleChannels = useMemo(() => {
        const selectedChannelIndex = channels.findIndex((channel) => {
            return (
                channel.contentId === selectedChannel?.contentId &&
                channel.categoryIdx === selectedChannel?.categoryIdx
            );
        });
        if (!selectedChannel) return { list: [], selectedIndex: -1 };

        const endIndex = coerceAtMost(
            selectedChannelIndex + itemNumbers,
            channels.length,
        );
        const startIndex = coerceIn(
            selectedChannelIndex - 2,
            0,
            endIndex - itemNumbers,
        );

        const list = channels.slice(startIndex, endIndex);
        const index = list.findIndex((channel) => {
            return (
                channel.contentId === selectedChannel.contentId &&
                channel.categoryIdx === selectedChannel.categoryIdx
            );
        });

        return {
            list,
            selectedIndex: index,
        };
    }, [channels, selectedChannel, itemNumbers]);

    const { offset, setListRef, selectItem } = useListingsTable({
        items: visibleChannels.list,
        selectedColumnIndex: visibleChannels.selectedIndex,
        enabled: isFocused,
        timeBarOffsetValues,
    });

    const handleChangeEpisode = useCallback(
        (index: number, channel: ScheduleChannel) => {
            const columnIndex = visibleChannels.list.findIndex(
                (ch) => ch === channel,
            );
            selectItem([columnIndex, index]);
            !isFocused && setScheduleFocus(ScheduleFocusState.LISTINGS);
        },
        [visibleChannels],
    );

    const makeHeader = useCallback(
        (channel: ScheduleChannel) => {
            let header: Nullable<ReactNode> = null;

            for (const categoryIdx of Array.from(channelMap.keys())) {
                const firstChannel = channelMap.get(categoryIdx)?.[0];
                if (firstChannel !== channel) continue;

                if (categoryIdx === MyListCategory.idx) {
                    header = <RowHeader title={MyListCategory.name} />;
                    break;
                }

                header = <RowHeader title={'All Channel'} />;

                break;
            }

            return header;
        },
        [channelMap],
    );

    const channelImpl = visibleChannels.list.map((channel) => {
        const originChannel = getChannel(channel.contentId);
        return (
            <React.Fragment key={`${channel.categoryIdx}_${channel.contentId}`}>
                {makeHeader(channel)}
                {channel === EmptyMyListItem ? (
                    <EmptyMyList
                        onFocus={() => setSelectedChannel(channel)}
                        onClick={() => {
                            if (
                                currentScheduleFocus !==
                                ScheduleFocusState.LISTINGS
                            ) {
                                setScheduleFocus(ScheduleFocusState.LISTINGS);
                            }
                            dispatch({ type: 'RESET' });
                            selectItem([1, 0]);
                        }}
                    />
                ) : originChannel ? (
                    <RowContents channel={channel}>
                        {(props) => (
                            <>
                                <ChannelRow {...props} channel={channel} />
                                <EpisodeRow
                                    {...props}
                                    onClickEpisode={(index) =>
                                        handleChangeEpisode(index, channel)
                                    }
                                />
                            </>
                        )}
                    </RowContents>
                ) : null}
            </React.Fragment>
        );
    });

    return (
        <Container ref={setRef}>
            <List offset={offset} ref={setListRef}>
                {channelImpl}
            </List>
        </Container>
    );
}

function RowHeader({ title }: { title: string }) {
    return (
        <Divider>
            <span className={'title'}>{title}</span>
            <div className={'line'} />
        </Divider>
    );
}

type ChannelRowProps = {
    channel: ScheduleChannel;
    children: (props: RowChildProps) => ReactNode;
};

function RowContents({ channel, children }: ChannelRowProps) {
    const { showOverlay } = useOverlay();

    const schedule = useAtomValue(scheduleOfChannelSelector(channel.contentId));
    const [onAirChannel, setOnAirChannel] = useAtom(channelNowState);
    const [selectedChannel, setSelectedChannel] = useAtom(
        selectedChannelSelector,
    );

    const states = useMemo(() => {
        if (channel.contentId === onAirChannel?.contentId) {
            const states = [RowState.SELECTED];
            if (
                selectedChannel?.contentId === channel.contentId &&
                selectedChannel?.categoryIdx === channel.categoryIdx
            ) {
                return [...states, RowState.FOCUSED];
            }
            return states;
        } else if (
            selectedChannel?.contentId === channel.contentId &&
            selectedChannel?.categoryIdx === channel.categoryIdx
        ) {
            return [RowState.FOCUSED];
        } else {
            return [RowState.IDLE];
        }
    }, [selectedChannel, channel]);

    const getChannel = useAtomCallback(
        useCallback((get, set, channelId: string) => {
            return get(findChannelByIdSelector(channelId));
        }, []),
    );

    const handleChangeChannel = () => {
        const originChannel = getChannel(channel.contentId);
        setOnAirChannel(originChannel);
        showOverlay({ type: LiveScreenOverlayType.CHANNEL_BANNER });
    };

    return (
        <RowContainer onFocus={() => setSelectedChannel(channel)}>
            {states.some((state) => state.includes(RowState.SELECTED)) && (
                <SelectedSchedule />
            )}
            {children({
                schedule,
                states,
                onChangeChannel: handleChangeChannel,
            })}
        </RowContainer>
    );
}

type EmptyMyListProps = Pick<EpisodeCellProps, 'onFocus' | 'onClick'>;
function EmptyMyList({ onClick, ...rest }: EmptyMyListProps) {
    const setScheduleFocus = useSetAtom(currentScheduleFocusState);

    const handleKeyDown: KeyboardEventListener = (event) => {
        event.preventDefault();
        const { keyCode } = event;

        if (keyCode === LEFT) {
            setScheduleFocus(ScheduleFocusState.NAV);
        }

        if (keyCode === ENTER) {
            onClick?.();
        }
    };

    return (
        <EmptyRowContainer>
            <EpisodeCell
                width={'100vw'}
                states={[RowState.IDLE]}
                title={t('guide_schedule_empty_my_list')}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                {...rest}
            />
        </EmptyRowContainer>
    );
}

export type RowChildProps = {
    schedule: ChannelEpisode[];
    states: RowState[];
    onChangeChannel: () => void;
};

const Divider = styled.div`
    display: flex;
    max-height: 110rem;
    height: 110rem;
    padding: 48rem 32rem 26rem 32rem;
    align-items: center;

    .title {
        padding-right: 16rem;
        white-space: nowrap;
        font: ${({ theme }) => `28rem/36rem ${theme.fonts.family.pretendard}`};
        color: ${({ theme }) => theme.colors.whiteAlpha50};
    }

    .line {
        width: 100%;
        height: 1rem;
        background: ${({ theme }) => theme.colors.grey50};
    }
`;

const Container = styled.div`
    position: relative;
    width: 100%;
    height: calc(100% - 80rem);
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.blackAlpha100};
`;

const List = styled.div.attrs<{ offset: number }>((props) => ({
    tabIndex: 0,
    style: {
        transform: `translateY(${props.offset}rem)`,
    },
}))<{ offset: number }>`
    display: flex;
    flex-direction: column;
    padding-top: 22rem;
`;

const RowContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    min-height: fit-content;
    max-height: fit-content;
`;

const SelectedSchedule = styled(SelectedIcon)`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 24rem;
    height: 28rem;
    object-fit: contain;
`;

const EmptyRowContainer = styled(RowContainer)`
    padding: 0 24rem;

    & span {
        text-align: center;
    }
`;

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import { RowChildProps } from './Listings';
import { COMMON_SELECTED_ROW_INDEX } from '@/feature/screen/linear/hook/useListingsTable';
import useOverlay from '../hook/useOverlay';
import { ChannelEpisode } from '@/type/linear';
import { coerceAtLeast } from '@/util/common';
import { ENTER, LEFT, RIGHT } from '@/util/eventKey';
import {
    isEpisodeAiring,
    LiveScreenOverlayType,
    timeBarOffsetReducer,
    timeBarOffsetState,
    visibleEpisodesState,
    visibleWidthOfScheduleSlotState,
} from '@/atom/screen/linear';
import { currentScheduleState, episodeSelector } from '@/atom/screen';
import EpisodeCell, {
    EpisodeCellEventProps,
    RowState,
} from '@/feature/screen/linear/guide/EpisodeCell';
import { useReducerAtom } from '@/atom/app';

type EpisodeRowProps = RowChildProps & {
    onClickEpisode: (index: number) => void;
};

export function EpisodeRow({
    schedule,
    states,
    onChangeChannel,
    onClickEpisode,
}: EpisodeRowProps) {
    const { showOverlay } = useOverlay();
    const visibleSchedule = useAtomValue(visibleEpisodesState(schedule));
    const hasEmptySchedule = visibleSchedule.length === 0;
    const setSchedule = useSetAtom(currentScheduleState);

    // const [timeBarOffset, setTimeBarOffset] = useAtom(timeBarOffsetState);
    // const [state, dispatch] = useReducer(timeBarOffsetReducer, timeBarOffset);
    const [, dispatch] = useReducerAtom(
        timeBarOffsetState,
        timeBarOffsetReducer,
    );

    // useEffect(() => {
    //     setTimeBarOffset(state);
    // }, [state, setTimeBarOffset]);

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>,
        schedule: ChannelEpisode,
        index: number,
    ) => {
        event.preventDefault();

        const keyCode = event.keyCode;
        if (index === 0 && keyCode === LEFT) {
            dispatch({ type: 'DECREMENT' });
        }

        if (index === visibleSchedule.length - 1 && keyCode === RIGHT) {
            dispatch({ type: 'INCREMENT' });
        }

        if (keyCode === ENTER) {
            event.stopPropagation();
            const isAiring = isEpisodeAiring()(schedule);
            isAiring && onChangeChannel();
        }
    };

    const handleClick = (schedule: ChannelEpisode) => {
        const isAiring = isEpisodeAiring()(schedule);
        if (isAiring) {
            onChangeChannel();
        } else {
            showOverlay({
                type: LiveScreenOverlayType.GUIDE,
                needDelay: true,
            });
            // 아 이건 처음에 fav랑 thumbnail떄문에 그런거네
            const index =
                visibleSchedule.indexOf(schedule) + COMMON_SELECTED_ROW_INDEX;
            onClickEpisode(index);
        }
    };

    const episodeImpl = visibleSchedule.map((schedule, index) => {
        return (
            <EpisodeItem
                key={`${schedule.contentId}_${schedule.startAt}`}
                schedule={schedule}
                states={states}
                onFocus={() => setSchedule(schedule)}
                onKeyDown={(event) => handleKeyDown(event, schedule, index)}
                onClick={() => handleClick(schedule)}
            />
        );
    });

    return (
        <RowContainer>
            {hasEmptySchedule ? (
                <EmptyEpisode onFocus={() => setSchedule(null)} />
            ) : (
                episodeImpl
            )}
        </RowContainer>
    );
}

type EpisodeItemProps = {
    schedule: ChannelEpisode;
    states: RowState[];
} & EpisodeCellEventProps;

function EpisodeItem({ schedule, states, ...rest }: EpisodeItemProps) {
    const width = useAtomValue(visibleWidthOfScheduleSlotState(schedule));
    const episode = useAtomValue(episodeSelector(schedule.contentId));

    return (
        <EpisodeCell
            width={`${Math.abs(coerceAtLeast(width - 8, 8))}px`}
            states={states}
            title={episode?.title ?? ''}
            {...rest}
        />
    );
}

function EmptyEpisode({ ...rest }: { onFocus: () => void }) {
    return (
        <EpisodeCell
            width={'100vw'}
            states={[RowState.IDLE]}
            title={'...'}
            {...rest}
        />
    );
}

export const RowContainer = styled.div`
    display: flex;
    align-items: center;
`;

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { COMMON_SELECTED_ROW_INDEX } from '../hook/useListingsTable';
import { ENTER, LEFT, RIGHT } from '@/util/eventKey';
import { RowChildProps } from './Listings';
import { coerceAtLeast } from '@/util/common';
import useOverlay from '../hook/useOverlay';
import { ChannelEpisode } from '@/type/linear';
import {
    isEpisodeAiring,
    LiveScreenOverlayType,
    timeBarOffsetReducer,
    timeBarOffsetState,
    visibleEpisodesState,
    visibleWidthOfScheduleSlotState,
} from '@/atom/screen/linear';
import { currentScheduleState, episodeSelector } from '@/atom/screen';
import EpisodeCell, { EpisodeCellEventProps, RowState } from './EpisodeCell';
import { useReducerAtom } from '@/atom/app.ts';

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

    const [, dispatch] = useReducerAtom(
        timeBarOffsetState,
        timeBarOffsetReducer,
    );

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>,
        schedule: ChannelEpisode,
        index: number,
    ) => {
        event.preventDefault();

        const keyCode = event.keyCode;
        if (keyCode === LEFT) {
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

    function EmptyEpisode({ ...rest }: { onFocus: () => void }) {
        return (
            <EpisodeCell
                width={'100vw'}
                states={[RowState.IDLE]}
                onKeyDown={(event) =>
                    event.keyCode === LEFT && dispatch({ type: 'DECREMENT' })
                }
                title={'...'}
                {...rest}
            />
        );
    }

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

export const RowContainer = styled.div`
    display: flex;
    align-items: center;
`;

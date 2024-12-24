import { useEffect, useLayoutEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { openingMillisState, timeBarOffsetReducer } from '@/atom/screen/linear';
import { timeBarOffsetState } from '@/atom/screen/linear';
import { useReducerAtom } from '@/atom/app';

const LAYOUT = {
    SLOT_WIDTH: 600,
    SLOT_COUNT: 24,
    SLOT_GAP: 8,
    TOTAL_WIDTH: 600 * 24 + 8 * 23,
} as const;

export function Indicator() {
    const [offset, setOffset] = useState(0);
    const timelineOffset = useAtomValue(timeBarOffsetState);
    const openingMillis = useAtomValue(openingMillisState);
    const [, dispatch] = useReducerAtom(
        timeBarOffsetState,
        timeBarOffsetReducer,
    );

    const updateOffset = () => {
        const currentTime = dayjs();
        const baseTime = dayjs(openingMillis);
        const diffMin = currentTime.diff(baseTime, 'minute');
        const position = (diffMin / 720) * LAYOUT.TOTAL_WIDTH;

        setOffset(position);
    };

    useLayoutEffect(() => {
        if (timelineOffset > 0) return;

        updateOffset();
        const intervalJob = window.setInterval(updateOffset, 1000);
        return () => window.clearInterval(intervalJob);
    }, [timelineOffset]);

    useEffect(() => {
        return () => {
            dispatch({ type: 'RESET' });
        };
    }, []);

    return timelineOffset === 0 && <StyledIndicator offset={offset} />;
}

type IndicatorStyleProps = {
    offset: number;
};

const StyledIndicator = styled.div.attrs<IndicatorStyleProps>((props) => ({
    style: {
        transform: `translateX(${props.offset}rem)`,
    },
}))<IndicatorStyleProps>`
    width: 2rem;
    left: 442rem;
    height: 100%;
    position: absolute;
    background: ${({ theme }) => theme.colors.main};
`;

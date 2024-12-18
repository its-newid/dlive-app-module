import { openingMillisState } from '@/atom/screen/linear';
import { timeBarOffsetState } from '@/atom/screen/linear';
import { lerp } from '@/util/common';
import { useAtomValue } from 'jotai';
import { useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { useTimeBarOffset } from './hook/useTimeBarOffset';

const TIME_BAR_BASE_WIDTH = 1694;

export function Indicator() {
    const [offset, setOffset] = useState(0);
    const timelineOffset = useAtomValue(timeBarOffsetState);
    const openingMillis = useAtomValue(openingMillisState);
    const [_, dispatch] = useTimeBarOffset();

    const updateOffset = () => {
        const currentMillis = new Date().getTime();
        const diffMin = (currentMillis - openingMillis) / 60_000;
        const alpha = Math.floor(diffMin) / 60;
        const offset = lerp(0, TIME_BAR_BASE_WIDTH, alpha);
        setOffset(offset);
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

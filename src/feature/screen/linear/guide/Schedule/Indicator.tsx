import { openingMillisState } from '@/atom/screen/linear';
import { timeBarOffsetState } from '@/atom/screen/linear';
import { lerp } from '@/util/common';
import { useAtomValue } from 'jotai';
import { useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { useTimeBarOffset } from './hook/useTimeBarOffset';

// const TIME_BAR_BASE_WIDTH = 1130;
// const TIME_BAR_BASE_WIDTH = 1482;
// const TIME_BAR_BASE_WIDTH = 1653;
const TIME_BAR_BASE_WIDTH = 1478;

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

    // const updateOffset = () => {
    //     const currentMillis = new Date().getTime();
    //     const diffMin = (currentMillis - openingMillis) / 60_000;

    //     // 73분을 기준으로 정규화 (사실상 608rem이 30분이므로)
    //     const alpha = Math.floor(diffMin) / 73;
    //     const offset = lerp(0, TIME_BAR_BASE_WIDTH, alpha);
    //     setOffset(Math.min(offset, TIME_BAR_BASE_WIDTH));
    // };

    // const updateOffset = () => {
    //     const currentMillis = new Date().getTime();
    //     const diffMin = (currentMillis - openingMillis) / 60_000; // 현재 경과 분

    //     // 전체 가용 영역 (1478rem)에서의 시간 비율 계산
    //     // 73분(1시간 13분)을 기준으로 정규화
    //     const alpha = Math.floor(diffMin) / 73;

    //     // 전체 영역(1478rem)에서 현재 시간 위치 계산
    //     const offset = lerp(0, 1478, alpha);
    //     setOffset(Math.min(offset, 1478)); // 최대값 제한
    // };

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
        transform: `translateX(${props.offset}rem)`
    }
}))<IndicatorStyleProps>`
    width: 2rem;
    left: 442rem;
    height: 100%;
    position: absolute;
    background: ${({ theme }) => theme.colors.main};
`;

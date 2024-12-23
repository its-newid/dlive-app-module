import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import {
    openingMillisState,
    timeBarOffsetReducer,
    timeBarOffsetState,
    timeBarVisibleWidthState,
} from '@/atom/screen/linear';
import { formatMMMDD, useTimeline } from '../hook/useTimeline';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { getRem, lerp } from '@/util/common';
import { t } from 'i18next';
import { useReducerAtom } from 'jotai/utils';

const TIME_BAR_BASE_WIDTH = 1474;

export function Timeline() {
    const openingMillis = useAtomValue(openingMillisState);

    const { times, currentSlotMillis, timeBarOffset } =
        useTimeline(openingMillis);

    const isTomorrow = useMemo(() => {
        const openingTime = new Date(openingMillis);
        const slotTime = new Date(currentSlotMillis);
        return openingTime.getDate() < slotTime.getDate();
    }, [openingMillis, currentSlotMillis]);

    const date = useMemo(() => {
        const slotTime = new Date(currentSlotMillis);
        return formatMMMDD(slotTime);
    }, [currentSlotMillis]);

    const setTimeBarWidth = useSetAtom(timeBarVisibleWidthState);

    useEffect(() => {
        const layoutWidth = (TIME_BAR_BASE_WIDTH * getRem()) / 100;
        setTimeBarWidth(Math.floor(layoutWidth));
    }, []);

    return (
        <Header>
            <DateInfo>
                <DaySlot>
                    {t(
                        isTomorrow
                            ? 'guide_schedule_timeline_tomorrow'
                            : 'guide_schedule_timeline_today',
                    )}
                </DaySlot>
                <DateSlot>{date}</DateSlot>
            </DateInfo>
            <TimeBar>
                {times.map((time, index) => {
                    return (
                        <TimeSlot key={index} offset={timeBarOffset}>
                            {time}
                        </TimeSlot>
                    );
                })}
            </TimeBar>
        </Header>
    );
}

export function Indicator() {
    const [offset, setOffset] = useState(0);

    const timelineOffset = useAtomValue(timeBarOffsetState);
    const openingMillis = useAtomValue(openingMillisState);
    const [, dispatch] = useReducerAtom(
        timeBarOffsetState,
        timeBarOffsetReducer,
    );
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

const Header = styled.div`
    display: flex;
    height: 80rem;
    min-height: 80rem;
    padding: 24rem 0;
    background: ${({ theme }) => theme.colors.grey80};
    overflow-x: hidden;

    span {
        font-family: ${({ theme }) => theme.fonts.family.pretendard};
        font-size: 24rem;
        line-height: 32rem;
        white-space: nowrap;
    }
`;
const DateInfo = styled.div`
    display: flex;
    width: 446rem;
    min-width: 446rem;
    background-color: ${({ theme }) => theme.colors.grey80};
    z-index: 1;
`;

const DaySlot = styled.span`
    margin-left: 40rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.whiteAlpha77};
`;
const DateSlot = styled.span`
    margin-left: 73rem;
    color: ${({ theme }) => theme.colors.whiteAlpha77};
`;
const TimeBar = styled.div`
    display: flex;
`;
const timeSlotStyle = {
    width: 600,
    gap: 8,
    box: function () {
        return this.width + this.gap;
    },
};
const TimeSlot = styled.span<{ offset: number }>`
    width: ${timeSlotStyle.width}rem;
    min-width: ${timeSlotStyle.width}rem;
    margin-right: ${timeSlotStyle.gap}rem;
    transform: translateX(
        ${({ offset }) => `-${timeSlotStyle.box() * offset}rem`}
    );
    color: ${({ theme }) => theme.colors.whiteAlpha50};
`;
type IndicatorStyleProps = {
    offset: number;
};
const StyledIndicator = styled.div.attrs<IndicatorStyleProps>((props) => ({
    style: {
        transform: `translateX(${props.offset}rem)`,
    },
}))<IndicatorStyleProps>`
    width: 2rem;
    left: 446rem;
    height: 100%;
    position: absolute;
    background: ${({ theme }) => theme.colors.main};
`;

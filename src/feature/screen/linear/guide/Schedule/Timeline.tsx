import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import {
    openingMillisState,
    timeBarVisibleWidthState,
} from '@/atom/screen/linear';
import { useEffect, useMemo } from 'react';
import { getRem } from '@/util/common';
// import { useTranslation } from 'react-i18next';
import { formatMMDD } from '../../hook/useTimeline';
import { useTimeline } from '../../hook/useTimeline';

const TIME_BAR_BASE_WIDTH = 1694;

const getDayName = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
};

export function Timeline() {
    const openingMillis = useAtomValue(openingMillisState);

    const { times, currentSlotMillis, timeBarOffset } =
        useTimeline(openingMillis);

    const date = useMemo(() => {
        const slotTime = new Date(currentSlotMillis);
        const dayName = getDayName(slotTime);
        return `${formatMMDD(slotTime)} (${dayName})`;
    }, [currentSlotMillis]);

    const setTimeBarWidth = useSetAtom(timeBarVisibleWidthState);

    useEffect(() => {
        const layoutWidth = (TIME_BAR_BASE_WIDTH * getRem()) / 100;
        setTimeBarWidth(Math.floor(layoutWidth));
    }, []);

    return (
        <Header>
            <DateInfo>
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
    width: 442rem;
    min-width: 442rem;
    background-color: ${({ theme }) => theme.colors.grey80};
    z-index: 1;
`;

const DateSlot = styled.span`
    margin-left: 40rem;
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

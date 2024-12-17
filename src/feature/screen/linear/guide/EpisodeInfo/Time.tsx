import { SimpleProgressBar } from '@/component/ProgressBar';
import { ScheduleRemainingTime } from '../../ScheduleRemainingTime';
import { ScheduleDuration } from '../../ScheduleDuration';
import { useMemo } from 'react';
import { useScheduleProgress } from '@/hook/useProgress';
import { ChannelEpisode } from '@/type/linear';
import styled from 'styled-components';

const Time = ({ schedule }: { schedule: ChannelEpisode }) => {
    const { value, maxValue, remainingValue, timeRange } = useScheduleProgress(schedule);

    const isOnAir = useMemo(() => {
        const current = Date.now();
        const start = timeRange.start;
        const end = timeRange.end;
        return current >= start && current <= end;
    }, [timeRange]);

    return (
        <TimeContainer id={'ep-time'}>
            {isOnAir ? (
                <>
                    <ProgressBar value={value} max={maxValue} />
                    <TimeLeft leftMillis={remainingValue} />
                </>
            ) : (
                <Duration range={timeRange} />
            )}
        </TimeContainer>
    );
};

export default Time;

const TimeContainer = styled.div`
    display: flex;
    width: fit-content;
    margin-top: 16rem;
    align-items: center;
`;

const ProgressBar = styled(SimpleProgressBar)`
    width: 320rem;
`;

const TimeLeft = styled(ScheduleRemainingTime)`
    margin-left: 16rem;
`;

const Duration = styled(ScheduleDuration)`
    font-size: 24rem;
    color: ${({ theme }) => theme.colors.whiteAlpha89};
`;

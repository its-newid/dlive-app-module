import {
    ProgressBarProps,
    SimpleProgressBarProps,
    TimeRange,
} from '@/component/ProgressBar';
import { useEffect, useMemo, useState } from 'react';
import { Optional } from '@/type/common';
import { coerceAtLeast, toMillis } from '@/util/common';
import { ChannelEpisode } from '@/type/linear';

export function useProgress({
    timeRange,
}: ProgressBarProps): SimpleProgressBarProps {
    const [value, setValue] = useState(0);

    const max = useMemo(
        () => timeRange.duration ?? timeRange.end - timeRange.start,
        [timeRange],
    );

    useEffect(() => {
        const calcEndTime = () => {
            const now = Date.now();
            const progress = now - timeRange.start;
            setValue(progress);
        };

        calcEndTime();
        const intervalJob = window.setInterval(calcEndTime, 1000);
        return () => window.clearInterval(intervalJob);
    }, [timeRange]);

    return {
        value,
        max,
    };
}

export function useScheduleProgress(schedule: Optional<ChannelEpisode>) {
    const { timeRange } = useTimeRage({ schedule });
    const initialRemainingValue = coerceAtLeast(timeRange.end - Date.now(), 0);
    const [remainingValue, setRemainingValue] = useState(initialRemainingValue);
    const { value, max } = useProgress({
        timeRange,
    });

    useEffect(() => {
        setRemainingValue(initialRemainingValue);
    }, [value]);

    return {
        value,
        maxValue: max,
        remainingValue,
        timeRange,
    };
}

export function useTimeRage({
    schedule,
}: {
    schedule: Optional<ChannelEpisode>;
}) {
    const timeRange: TimeRange = useMemo(() => {
        return {
            start: toMillis(schedule?.startAt ?? 0),
            end: toMillis(schedule?.endAt ?? 0),
            duration: toMillis(schedule?.duration ?? 0),
        };
    }, [schedule]);

    return { timeRange };
}

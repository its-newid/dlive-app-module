import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { timeBarOffsetState } from '@/atom/screen/linear';
import dayjs from 'dayjs';

export const TIME_SLOT_MILLIS = 1000 * 60 * 30;
export const TIME_SLOT_MAX_MILLIS = 1000 * 60 * 60 * 12;

export const useTimeline = (openingMillis: number) => {
    const timeBarOffset = useAtomValue(timeBarOffsetState);
    const [times, setTimes] = useState<string[]>([]);

    const currentSlotMillis = useMemo(() => {
        return openingMillis + timeBarOffset * TIME_SLOT_MILLIS;
    }, [openingMillis, timeBarOffset]);

    useEffect(() => {
        setTimes(generateTimes(openingMillis));
    }, [openingMillis]);

    return {
        times,
        timeBarOffset,
        currentSlotMillis,
        currentTime: new Date(currentSlotMillis),
    };
};

const generateTimes = (millis: number = new Date().getTime()) => {
    const date = new Date(millis);
    const minute = TIME_SLOT_MILLIS / 60_000;
    const len = Math.floor(720 / minute);

    const times = [];
    for (let i = 0; i <= len; i++) {
        times.push(format24Hour(date));
        date.setMinutes(date.getMinutes() + minute);
    }
    return times;
};

export function floorToNearest30Minutes(date: Date = new Date()) {
    return new Date(
        Math.floor(date.getTime() / TIME_SLOT_MILLIS) * TIME_SLOT_MILLIS,
    );
}

function format24Hour(date: Date) {
    return dayjs(date).format('HH:mm');
}

export function formatMMDD(date: Date) {
    return dayjs(date).format('MM/DD');
}

import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import { timeBarOffsetState } from '@/atom/screen/linear';

export const TIME_SLOT_MILLIS = 1000 * 60 * 30; // 30 minutes
export const TIME_SLOT_MAX_MILLIS = 1000 * 60 * 60 * 12; // 12 hours

export const useTimeline = (openingMillis: number) => {
    const timeBarOffset = useAtomValue(timeBarOffsetState);
    const [times, setTimes] = useState<string[]>([]);

    const currentSlotMillis = useMemo(() => {
        return openingMillis + timeBarOffset * TIME_SLOT_MILLIS;
    }, [openingMillis, timeBarOffset]);

    useEffect(() => {
        setTimes(generateTimes(openingMillis));
    }, [openingMillis]);

    return { times, timeBarOffset, currentSlotMillis };
};

const generateTimes = (millis: number = new Date().getTime()) => {
    const date = new Date(millis);
    const minute = TIME_SLOT_MILLIS / 60_000;
    const len = Math.floor(720 / minute);

    const times = [];
    for (let i = 0; i <= len; i++) {
        times.push(format12Hour(date));
        date.setMinutes(date.getMinutes() + minute);
    }
    return times;
};

export function floorToNearest30Minutes(date: Date = new Date()) {
    return new Date(Math.floor(date.getTime() / TIME_SLOT_MILLIS) * TIME_SLOT_MILLIS);
}

function format12Hour(date: Date) {
    return dayjs(date).format('hh:mm A');
}

export function formatYYYYMMDD(date: Date) {
    return dayjs(date).format('YYYY-MM-DD');
}

export function formatMMMDD(date: Date) {
    return dayjs(date).format('MMM DD');
}

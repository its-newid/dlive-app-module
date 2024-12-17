import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import { timeBarOffsetState } from '@/atom/screen/linear';

export const TIME_SLOT_MILLIS = 1000 * 60 * 30; // 30 minutes
export const TIME_SLOT_MAX_MILLIS = 1000 * 60 * 60 * 12; // 12 hours
const TIME_SLOT = {
    width: 600,
    gap: 8,
    total: 608
};
const REM_PER_MINUTE = TIME_SLOT.total / 30;

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
        times.push(format24Hour(date));
        date.setMinutes(date.getMinutes() + minute);
    }
    return times;
};

export function floorToNearest30Minutes(date: Date = new Date()) {
    // data.getTime()을 해서 30분 단위로 내림
    // return new Date(Math.floor(date.getTime() / TIME_SLOT_MILLIS) * TIME_SLOT_MILLIS);
    // 정확한 30분 단위로 내림
    const minutes = date.getMinutes();
    const roundedMinutes = Math.floor(minutes / 30) * 30;

    const newDate = new Date(date);
    newDate.setMinutes(roundedMinutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate;
}

function format12Hour(date: Date) {
    return dayjs(date).format('hh:mm A');
}

function format24Hour(date: Date) {
    return dayjs(date).format('HH:mm');
}

export function formatYYYYMMDD(date: Date) {
    return dayjs(date).format('YYYY-MM-DD');
}

export function formatMMMDD(date: Date) {
    return dayjs(date).format('MMM DD');
}

export function formatMMDD(date: Date) {
    return dayjs(date).format('MM/DD');
}

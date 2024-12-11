import { toMillis } from '../util/common';
import { useCallback, useEffect, useRef } from 'react';
import { Optional } from '../type/common';
import { Channel, ChannelEpisode } from '../type/linear';
import { findAiringEpisode, scheduleOfChannelSelector } from '../atom/screen/linear';
import { useAtomCallback } from 'jotai/utils';
import { lastUpdatedTimeState } from '../atom/app';
import { SCHEDULE_STALE_TIME, useGetSchedule } from '@/api/scheduleQuery';
import { useAtomValue, useAtom } from 'jotai';
import { scheduleEnabledState } from '../atom/screen';

export const useScheduleUpdater = ({
    channel,
    scheduleEndTime,
    setSchedule,
    setScheduleEndTime
}: {
    channel: Optional<Channel>;
    scheduleEndTime: number;
    setSchedule: (val: Optional<ChannelEpisode>) => void;
    setScheduleEndTime: (val: number) => void;
}) => {
    const savedCallback = useRef<Optional<() => void>>(undefined);

    const getSchedule = useAtomCallback(
        useCallback(
            (get, _, channel: Channel) =>
                get(scheduleOfChannelSelector(channel?.contentId ?? '')) ?? [],
            []
        )
    );

    const subscribeToUpdateCallback = useCallback((callback: Optional<() => void>) => {
        savedCallback.current = callback;
    }, []);

    useEffect(() => {
        setScheduleEndTime(-1);
    }, [channel]);

    const lastQueryTime = useAtomValue(lastUpdatedTimeState);
    const [scheduleEnabled, setScheduleEnabled] = useAtom(scheduleEnabledState);

    const getScheduleEnabled = useAtomCallback(
        useCallback(() => {
            const currentTime = Date.now();
            return currentTime - lastQueryTime >= SCHEDULE_STALE_TIME;
        }, [lastQueryTime])
    );

    const { refetch } = useGetSchedule();

    useEffect(() => {
        if (!channel) return;

        const updateSchedule = () => {
            if (scheduleEnabled) return;

            if (getScheduleEnabled()) {
                setScheduleEnabled(true);
                refetch();
                return;
            }

            savedCallback.current?.();

            const current = new Date().getTime();
            if (scheduleEndTime >= current) return;

            const schedule = getSchedule(channel);

            const airingEpisode = findAiringEpisode(schedule ?? [], current);

            setSchedule(airingEpisode);
            setScheduleEndTime(airingEpisode ? toMillis(airingEpisode.endAt) : -1);
        };

        updateSchedule();

        const intervalId = window.setInterval(updateSchedule, 1000);
        return () => clearInterval(intervalId);
    }, [channel, scheduleEndTime, scheduleEnabled]);

    return subscribeToUpdateCallback;
};

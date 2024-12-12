import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { appService } from '@/api/service/app';
import { ScheduleResponse } from '@/api/model/schedule';
import { DEFAULT_LOCALE } from '@/app/environment';
import { lastUpdatedTimeState } from '@/atom/app';
import { channelsState, scheduleEnabledState } from '@/atom/screen';
import { QueryKeys } from '@/type/queryKey';
import { ChannelEpisode } from '@/type/linear';

export const SCHEDULE_STALE_TIME = 1000 * 60 * 60 * 24;

export const useGetSchedule = () => {
    // const { lang, country } = useAtomValue(localeState);
    const locale = DEFAULT_LOCALE;

    const [scheduleEnabled, setScheduleEnabled] = useAtom(scheduleEnabledState);

    const { data, isLoading, isError, isRefetching, refetch } = useQuery({
        queryKey: [QueryKeys.APP],
        queryFn: () => {
            return appService.fetchSchedule(locale);
        },
        select: useCallback(transformData, []),
        enabled: scheduleEnabled
    });

    const setChannels = useSetAtom(channelsState);
    const getChannels = useAtomCallback(useCallback((get) => get(channelsState), []));
    const setLastAppQueryTime = useSetAtom(lastUpdatedTimeState);

    useEffect(() => {
        if (!data || isRefetching) return;

        setLastAppQueryTime(Date.now());

        const newChannels = getChannels();
        newChannels.map((channel) => ({
            ...channel,
            schedule: data[channel.contentId] || channel.schedule
        }));
        setChannels(newChannels);
        setScheduleEnabled(false);
    }, [data, isRefetching]);

    return {
        isRefetching,
        isLoading,
        isError,
        refetch
    };
};

const transformData = (data: ScheduleResponse) => {
    return data.reduce(
        (acc, linear) => {
            acc[linear.contentId] = linear.schedule.map((schedule) => ({
                ...schedule,
                channelId: linear.contentId
            }));
            return acc;
        },
        {} as Record<string, ChannelEpisode[]>
    );
};

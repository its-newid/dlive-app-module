import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { appService } from '@/api/service/app';
import { ScheduleResponse } from '@/api/model/schedule';
import { DEFAULT_LOCALE } from '@/app/environment';
import { lastUpdatedTimeState } from '@/atom/app';
import { channelsState, scheduleEnabledState } from '@/atom/screen';
import { QueryKeys } from '@/type/queryKey';
import { ChannelEpisode } from '@/type/linear';

const TWENTY_FOUR_HOURS_IN_MS = 1000 * 60 * 60 * 24;

export const useGetSchedule = () => {
    const { lang, country } = DEFAULT_LOCALE;
    const setScheduleEnabled = useSetAtom(scheduleEnabledState);
    const setLastAppQueryTime = useSetAtom(lastUpdatedTimeState);
    const setChannels = useSetAtom(channelsState);
    const getChannels = useAtomCallback(useCallback((get) => get(channelsState), []));
    const lastAppQueryTime = useAtomValue(lastUpdatedTimeState);

    useEffect(() => {
        console.log('lastAppQueryTime', lastAppQueryTime);
    }, [lastAppQueryTime]);

    const { data, isLoading, isError, isRefetching, refetch } = useQuery({
        queryKey: [QueryKeys.SCHEDULE],
        queryFn: () => {
            console.log('Fetching schedule...');
            return appService.fetchSchedule({ lang, country });
        },
        select: useCallback(transformData, []),
        staleTime: TWENTY_FOUR_HOURS_IN_MS,
        gcTime: TWENTY_FOUR_HOURS_IN_MS,
        refetchOnReconnect: true, // 네트워크 재연결 시 refetch
        refetchOnMount: false, // 마운트 시 refetch 방지
        refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 방지
        enabled: lastAppQueryTime === 0 || Date.now() - lastAppQueryTime > TWENTY_FOUR_HOURS_IN_MS
    });

    useEffect(() => {
        if (!data || isRefetching) return;

        setLastAppQueryTime(Date.now());

        const newChannels = getChannels();
        const updatedChannels = newChannels.map((channel) => ({
            ...channel,
            schedule: data[channel.contentId] || channel.schedule
        }));

        setChannels(updatedChannels);
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

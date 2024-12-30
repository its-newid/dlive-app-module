import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { appService } from '@/api/service/app';
import { ScheduleResponse } from '@/api/model/schedule';
import { LinearResponse } from '@/api/model/app';
import { DEFAULT_LOCALE } from '@/app/environment';
import { lastUpdatedTimeState } from '@/atom/app';
import {
    channelNowState,
    channelsState,
    onAirScheduleEndTimeState,
    onAirScheduleState,
    readInitialChannel,
} from '@/atom/screen';
import { QueryKeys } from '@/type/queryKey';
import { Channel } from '@/type/linear';
import { useAtomCallback } from 'jotai/utils';
import {
    findAiringEpisode,
    scheduleOfChannelSelector,
} from '@/atom/screen/linear';
import { toMillis } from '@/util/common';

export const SCHEDULE_STALE_TIME = 1000 * 60 * 60 * 24;

export const useGetSchedule = () => {
    const [isReady, setIsReady] = useState(false);
    const [channelNow, setChannelNow] = useAtom(channelNowState);
    const setLastAppQueryTime = useSetAtom(lastUpdatedTimeState);
    const setChannels = useSetAtom(channelsState);
    const getInitialChannel = useAtomCallback(
        useCallback((get) => get(readInitialChannel), []),
    );
    const { lang, country } = DEFAULT_LOCALE;

    const { data, isLoading, isError, isRefetching, refetch } = useQuery({
        queryKey: [QueryKeys.SCHEDULE],
        queryFn: () => {
            return appService.fetchSchedule({ lang, country });
        },
        select: useCallback(
            (data: ScheduleResponse) => transformData(data),
            [],
        ),
        staleTime: 60 * 60 * 1000,
        gcTime: 2 * 60 * 60 * 1000,
        refetchOnReconnect: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchInterval: 60 * 60 * 1000,
    });

    useEffect(() => {
        if (!data || isRefetching) return;
        setChannels(data);
        setLastAppQueryTime(Date.now());
        setChannelNow(getInitialChannel());
        setIsReady(true);
    }, [data, isRefetching, setChannels, setLastAppQueryTime]);

    const updateSchedule = useAtomCallback(
        useCallback((get, set, channel: Channel | null) => {
            if (!channel) return;

            const current = Date.now();
            const schedule =
                get(scheduleOfChannelSelector(channel.contentId)) ?? [];
            const airingEpisode = findAiringEpisode(schedule, current);

            set(onAirScheduleState, airingEpisode);
            set(
                onAirScheduleEndTimeState,
                airingEpisode ? toMillis(airingEpisode.endAt) : -1,
            );
        }, []),
    );

    useEffect(() => {
        if (!channelNow) return;
        updateSchedule(channelNow);
    }, [channelNow, updateSchedule]);

    return {
        isRefetching,
        isLoading: isLoading || !isReady,
        isError,
        refetch,
    };
};

const transformData = (data: ScheduleResponse) => {
    const transformedChannels = data.map((channel) => mapToChannel(channel));
    return transformedChannels;
};

const mapToChannel = (channel: LinearResponse): Channel => {
    const { schedule, ...rest } = channel;

    return {
        ...rest,
        categoryIdx: 1,
        schedule: schedule.map((schedule) => ({
            ...schedule,
            channelId: channel.contentId,
        })),
    };
};

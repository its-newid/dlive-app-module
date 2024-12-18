import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { appService } from '@/api/service/app';
import { ScheduleResponse } from '@/api/model/schedule';
import { LinearResponse } from '@/api/model/app';
import { DEFAULT_LOCALE } from '@/app/environment';
import { lastUpdatedTimeState, writeWatchHistory } from '@/atom/app';
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

export const useGetSchedule = () => {
    const [isReady, setIsReady] = useState(false);
    const { lang, country } = DEFAULT_LOCALE;
    const setLastAppQueryTime = useSetAtom(lastUpdatedTimeState);
    const setChannels = useSetAtom(channelsState);
    const getInitialChannel = useAtomCallback(
        useCallback((get) => get(readInitialChannel), []),
    );
    const [channelNow, setChannelNow] = useAtom(channelNowState);

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
        if (!data || isRefetching) return; // 데이터가 없거나, 데이터가 업데이트 중인 경우 아무 작업도 하지 않고 리턴
        console.log('data', data);
        setChannels(data);
        setLastAppQueryTime(Date.now());
        setChannelNow(getInitialChannel());
        setIsReady(true);
    }, [data, isRefetching, setChannels, setLastAppQueryTime]);

    const updateSchedule = useAtomCallback(
        useCallback((get, set, channel: Channel | null) => {
            if (!channel) return;

            // 현재 시간 기준으로 방송 중인 에피소드 찾기
            const current = new Date().getTime();
            const schedule =
                get(scheduleOfChannelSelector(channel.contentId)) ?? [];
            const airingEpisode = findAiringEpisode(schedule, current);

            // 스케줄 상태 업데이트
            set(onAirScheduleState, airingEpisode);
            set(
                onAirScheduleEndTimeState,
                airingEpisode ? toMillis(airingEpisode.endAt) : -1,
            );

            // 시청 기록 추가 로직
            if (airingEpisode) {
                set(writeWatchHistory, {
                    type: 'linear',
                    content: {
                        contentId: channel.contentId,
                    },
                });
            }
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
        categoryIdx: 1, // 카테고리 값이 실제로 없지만 추후 활용을 위해서 모든 카테고리인���스값에 1을 부여
        schedule: schedule.map((schedule) => ({
            ...schedule,
            channelId: channel.contentId,
        })),
    };
};

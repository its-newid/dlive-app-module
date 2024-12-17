import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import useMyList from '@/hook/useMyList';
import { appService } from '@/api/service/app';
import { ScheduleResponse } from '@/api/model/schedule';
import { DEFAULT_LOCALE } from '@/app/environment';
import { lastUpdatedTimeState, mylistState, TMyListContents } from '@/atom/app';
import { channelsState, scheduleEnabledState } from '@/atom/screen';
import { QueryKeys } from '@/type/queryKey';
import { Channel, ChannelEpisode } from '@/type/linear';
import { CategoryResponse } from './model/app';
import { LinearResponse } from './model/app';
import { ContentType } from '@/type/common';
import { MyListCategory } from '@/type/category';

const HOUR_IN_MS = 1000 * 60 * 60; // 1시간을 밀리초로 변환

export const useGetSchedule = () => {
    const { lang, country } = DEFAULT_LOCALE;
    const setScheduleEnabled = useSetAtom(scheduleEnabledState);
    const setLastAppQueryTime = useSetAtom(lastUpdatedTimeState);
    const setChannels = useSetAtom(channelsState);
    const lastAppQueryTime = useAtomValue(lastUpdatedTimeState);

    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData([QueryKeys.SCHEDULE]);

    const { data, isLoading, isError, isRefetching, refetch } = useQuery({
        queryKey: [QueryKeys.SCHEDULE],
        queryFn: () => {
            setScheduleEnabled(true);
            return appService.fetchSchedule({ lang, country });
        },
        select: useCallback((data: ScheduleResponse) => transformData(data), []),
        staleTime: HOUR_IN_MS,
        gcTime: HOUR_IN_MS, // 캐시된 데이터가 메모리에서 완전히 제거되기까지의 시간 1시간
        refetchOnReconnect: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        // 캐시된 데이터가 없는 경우 (!cachedData)
        // 마지막 앱 쿼리 시간이 0인 경우 (lastAppQueryTime === 0)
        // 마지막 앱 쿼리 시간이 1시간 이상 지난 경우 (Date.now() - lastAppQueryTime > HOUR_IN_MS)
        enabled: !cachedData || lastAppQueryTime === 0 || Date.now() - lastAppQueryTime > HOUR_IN_MS
    });

    useEffect(() => {
        // 데이터가 없거나 데이터가 업데이트 중인 경우 (isRefetching) 아무 작업도 하지 않고 리턴
        if (!data || isRefetching) return;
        setChannels(data); // 채널 데이터를 업데이트
        setLastAppQueryTime(Date.now()); // 마지막 쿼리 시간을 현재 시간으로 설정
        setScheduleEnabled(false); // 스케줄 enabled 상태를 false로 설정
    }, [data, isRefetching, setChannels, setLastAppQueryTime, setScheduleEnabled]);

    return {
        isRefetching,
        isLoading,
        isError,
        refetch
    };
};

const transformData = (
    data: ScheduleResponse
    // isMyList: (props: { contentId: string; type: ContentType }) => boolean
) => {
    const channelArray = data.map((channel) => mapToChannel(channel));
    return channelArray;
};

const mapToChannel = (
    channel: LinearResponse
    // isMyList: (props: { contentId: string; type: ContentType }) => boolean
): Channel => {
    // 잘못된 코드
    // const categoryIdx = isMyList({ contentId: channel.contentId, type: ContentType.LINEAR })
    //     ? MyListCategory.idx
    //     : 1;

    const { schedule, ...rest } = channel;

    return {
        ...rest,
        categoryIdx: 1,
        schedule: schedule.map((schedule) => ({
            ...schedule,
            channelId: channel.contentId
        }))
    };
};

import { useSetAtom } from 'jotai';
import { lastUpdatedTimeState } from '../atom/app';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../type/queryKey';
import { appService } from './service/app';
import { CategoryResponse, LinearResponse } from './model/app';
import { Channel } from '../type/linear';
import {
    channelNowState,
    channelsState,
    readInitialChannel,
} from '@/atom/screen';
import { DEFAULT_LOCALE } from '../app/environment';
import { useAtomCallback } from 'jotai/utils';
import { ScheduleResponse } from './model/schedule';

export const useGetApp = () => {
    // const { lang, country } = useAtomValue(localeState);
    const locale = DEFAULT_LOCALE;

    const [isReady, setIsReady] = useState(false);

    const { data, isLoading, isError, isRefetching } = useQuery({
        queryKey: [QueryKeys.APP],
        queryFn: () => {
            return appService.fetchSchedule(locale);
        },
        select: useCallback(transformData, []),
    });

    const setChannels = useSetAtom(channelsState);
    const setChannelNow = useSetAtom(channelNowState);
    const setLastAppQueryTime = useSetAtom(lastUpdatedTimeState);

    const getInitialChannel = useAtomCallback(
        useCallback((get) => get(readInitialChannel), []),
    );

    useEffect(() => {
        if (!data || isRefetching) return;

        setLastAppQueryTime(Date.now());

        const { channels } = data;

        setChannels(channels);
        setChannelNow(getInitialChannel());
        setIsReady(true);
    }, [data, isRefetching]);

    return {
        isRefetching,
        isLoading: isLoading || !isReady,
        isError,
    };
};

const transformData = (data: ScheduleResponse) => {
    const channelArray = data.map((channel) => mapToChannel(channel));

    return {
        channels: channelArray,
    };
};

const mapToChannel = (
    channel: LinearResponse,
    categories: CategoryResponse[],
): Channel => {
    const linearCategories = categories.flatMap((category) => category.linear);
    const findCategory = linearCategories.find((content) => {
        return content.contentId === channel.contentId;
    });

    const { schedule, ...rest } = channel;

    return {
        ...rest,
        categoryIdx: findCategory?.categoryIdx ?? undefined,
        schedule: schedule.map((schedule) => ({
            ...schedule,
            channelId: channel.contentId,
        })),
    };
};

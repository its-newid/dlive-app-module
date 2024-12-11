import { useCallback, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { lastUpdatedTimeState } from '@/atom/app';
import { useAtomCallback } from 'jotai/utils';
// import { useNavigate } from 'react-router';
import { usePrevious } from '@/hook/usePrevious';
import { appService } from '@/api/service/app';
import { LinearResponse } from '@/api/model/app';
import { Channel } from '@/type/linear';
import { QueryKeys } from '@/type/queryKey';
import { channelNowState, channelsState, readInitialChannel } from '@/atom/screen';
import { DEFAULT_LOCALE } from '@/app/environment';

export const useGetApp = () => {
    // const { lang, country } = useAtomValue(localeState);
    const { lang, country } = DEFAULT_LOCALE;
    const prevLang = usePrevious(lang);
    // const navigate = useNavigate();

    const [isReady, setIsReady] = useState(false);

    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: [QueryKeys.APP],
        queryFn: () => {
            const params = {
                country,
                lang
            };
            return appService.fetchSchedule(params);
        },
        select: useCallback(transformData, [])
    });

    // const setCategories = useSetAtom(categoriesState);
    const setChannels = useSetAtom(channelsState);
    const setChannelNow = useSetAtom(channelNowState);
    const setLastAppQueryTime = useSetAtom(lastUpdatedTimeState);

    const getInitialChannel = useAtomCallback(useCallback((get) => get(readInitialChannel), []));

    useEffect(() => {
        if (prevLang !== lang) {
            refetch();
        }
    }, [lang]);

    useEffect(() => {
        if (!data || isRefetching) return;

        setLastAppQueryTime(Date.now());

        const { channels } = data;

        // setCategories(categories);

        setChannels(channels);
        setChannelNow(getInitialChannel());
        setIsReady(true);
    }, [data, isRefetching]);

    return {
        isRefetching,
        isLoading: isLoading || !isReady,
        isError
    };
};

const transformData = (data: LinearResponse[]) => {
    const channelArray = data.map((channel) => mapToChannel(channel));
    return {
        channels: channelArray
    };
};

const mapToChannel = (channel: LinearResponse): Channel => {
    // const linearCategories = categories.flatMap((category) => category.linear);
    // const findCategory = linearCategories.find((content) => {
    //     return content.contentId === channel.contentId;
    // });
    const { schedule, ...rest } = channel;

    return {
        ...rest,
        streamUrl: channel.liveUrl,
        // categoryIdx: findCategory?.categoryIdx ?? undefined,
        schedule: schedule.map((schedule) => ({
            ...schedule,
            channelId: channel.contentId
        }))
    };
};

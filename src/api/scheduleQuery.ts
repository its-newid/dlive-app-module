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

export const SCHEDULE_STALE_TIME = 1000 * 60 * 60 * 24;

const META_ERROR_CHANNEL_ID = 'newid_112';
const HLS_ERROR_CHANNEL_ID = 'newid_110';
export const API_ERROR_CHANNEL_ID = 'newid_002';
export const NETWORK_ERROR_CHANNEL_ID = 'newid_102';

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

    if (channel.contentId === META_ERROR_CHANNEL_ID) {
        return {
            ...rest,
            thumbUrl: {},
            liveUrl: '',
            categoryIdx: 1,
            schedule: [],
        };
    }

    if (channel.contentId === HLS_ERROR_CHANNEL_ID) {
        return {
            ...rest,
            liveUrl:
                'https://.its-newid.net/api/manifest.m3u8?tp=binge_korea&channel_name=myunfortunateboyfriend&channel_id=newid_110&id=009f347c97d1875be683f81bd7c8947023aa8bde&mpf=d66626b0-dcf94840-73c715bf&apikey=5ad71e08-4495-4e72-9f51-2eb60c5eb725&auth=32b2fd3c-60dca2a8-ae35b89d-17ac3804&ads.live=[CONTENT_LIVE]&ads.deviceid=[DEVICE_ID]&ads.ifa=[IFA]&ads.ifatype=[IFA_TYPE]&ads.lat=[LMT]&ads.donotsell=[DNS]&ads.ua=[UA]&ads.ip=[IP]&ads.gdpr=[GDPR]&ads.gdpr_consent=[GDPR_CONSENT]&ads.country=[COUNTRY]&ads.us_privacy=[US_PRIVACY]&ads.appstoreurl=[APP_STOREURL]&ads.bundleid=[APP_BUNDLE]&ads.appname=[APP_NAME]&ads.appversion=[APP_VERSION]&ads.devicetype=[DEVICE_TYPE]&ads.devicemake=[DEVICE_MAKE]&ads.devicemodel=[DEVICE_MODEL]&ads.targetad=[TARGETAD_ALLOWED]',
            categoryIdx: 1,
            schedule: schedule.map((schedule) => ({
                ...schedule,
                channelId: channel.contentId,
            })),
        };
    }

    return {
        ...rest,
        categoryIdx: 1,
        schedule: schedule.map((schedule) => ({
            ...schedule,
            channelId: channel.contentId,
        })),
    };
};

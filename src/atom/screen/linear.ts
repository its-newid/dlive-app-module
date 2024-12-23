import { atom } from 'jotai';
import { atomFamily, atomWithReset } from 'jotai/utils';
import { coerceAtLeast, coerceAtMost, lerp, toMillis } from '@/util/common';
import {
    floorToNearest30Minutes,
    TIME_SLOT_MAX_MILLIS,
    TIME_SLOT_MILLIS,
} from '@/feature/screen/linear/hook/useTimeline';
import { channelSelector } from './index';
import { Optional, ScreenOverlayConfig, VideoErrorName } from '@/type/common';
import { ChannelEpisode } from '@/type/linear';
import { userAgent } from '@/util/userAgent';
import { UserAgentOS } from '@/type/userAgent';

export const LiveScreenOverlayType = {
    IDLE: 'idle',
    CHANNEL_BANNER: 'channelBanner',
    MINI_BANNER: 'miniBanner',
    SUBTITLE_TRACK_SHEET: 'subtitleTrackSheet',
    GUIDE: 'guide',
    FULL_DESCRIPTION: 'fullDescription',
} as const;
export type LiveScreenOverlayType =
    (typeof LiveScreenOverlayType)[keyof typeof LiveScreenOverlayType];
export type LiveScreenOverlay = {
    type: LiveScreenOverlayType;
    timeout: number;
};

export const ScheduleFocusState = {
    NAV: 0,
    CATEGORY: 1,
    LISTINGS: 2,
} as const;
export type ScheduleFocusState =
    (typeof ScheduleFocusState)[keyof typeof ScheduleFocusState];

export const ChannelBannerToolMenu = {
    HOME: 0,
    GUIDE: 1,
    MY_LIST: 2,
    SUBTITLE_TRACK_SHEET: 3,
    FULL_DESCRIPTION: 4,
} as const;
export type ChannelBannerToolMenu =
    (typeof ChannelBannerToolMenu)[keyof typeof ChannelBannerToolMenu];

export const isFullDescriptionVisibleState = atom(false);
export const isToastVisibleState = atom(false);

export const liveScreenOverlayState = atom<LiveScreenOverlayType>(
    LiveScreenOverlayType.IDLE,
);

export const VideoState = {
    IDLE: 'idle',
    LOADED: 'loaded',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended',
} as const;
export type VideoState = (typeof VideoState)[keyof typeof VideoState];

export type LinearVideoState = Exclude<VideoState, 'paused' | 'ended'>;
export const videoState = atom<LinearVideoState>(VideoState.IDLE);

export const VideoErrorState = {
    IDLE: 'idle',
    FAILED: 'failed',
} as const;
type TVideoErrorState = (typeof VideoErrorState)[keyof typeof VideoErrorState];
type VideoErrorStateDetails = {
    [K in TVideoErrorState]: K extends 'failed'
        ? { type: K; message: string }
        : { type: K };
};
export type VideoErrorState = VideoErrorStateDetails[TVideoErrorState];

export const videoErrorState = atom<VideoErrorState>({
    type: VideoErrorState.IDLE,
});

export const isFailedAutoplayError = (errorState: VideoErrorState) => {
    return (
        userAgent.type === UserAgentOS.DEFAULT &&
        errorState.type === VideoErrorState.FAILED &&
        (errorState.message === VideoErrorName.AUTOPLAY_NOT_ALLOWED ||
            errorState.message === VideoErrorName.ABORT_ERROR)
    );
};

export const isVideoAutoplayBlockedState = atom((get) => {
    return isFailedAutoplayError(get(videoErrorState));
});

export const timeBarOffsetState = atom(0);

export type TimeBarOffsetValues = {
    min: number;
    value: number;
    max: number;
};

const MAX_TIME_BAR_OFFSET = TIME_SLOT_MAX_MILLIS / TIME_SLOT_MILLIS - 2.456;
export const timeBarOffsetValuesSelector = atom<TimeBarOffsetValues>((get) => {
    return {
        min: 0,
        value: get(timeBarOffsetState),
        max: MAX_TIME_BAR_OFFSET,
    };
});

export const timeBarOffsetReducer = (
    prev: number,
    action: {
        type: 'INCREMENT' | 'DECREMENT' | 'RESET';
    },
) => {
    if (action.type === 'INCREMENT') {
        return coerceAtMost(prev + 2.456, MAX_TIME_BAR_OFFSET);
    } else if (action.type === 'DECREMENT') {
        return coerceAtLeast(prev - 2.456, 0);
    } else if (action.type === 'RESET') {
        return 0;
    } else {
        throw new Error('unknown action type');
    }
};

export const openingMillisState = atom<number>(
    floorToNearest30Minutes().getTime(),
);

export const currentScheduleFocusState = atom<ScheduleFocusState>(
    ScheduleFocusState.LISTINGS,
);

export const timeBarVisibleWidthState = atom<number>(0);

export const selectedScheduleCategoryIdxState = atom(0);

export const visibleTimesInTimeBar = atom((get) => {
    const openingMillis = get(openingMillisState);
    const timeBarOffset = get(timeBarOffsetState);

    const start = openingMillis + timeBarOffset * TIME_SLOT_MILLIS;
    const end = start + TIME_SLOT_MILLIS * 2.456; // 1hours
    return [start, end];
});

export const visibleEpisodesState = atomFamily((schedule: ChannelEpisode[]) =>
    atom((get) => {
        const [vStart, vEnd] = get(visibleTimesInTimeBar);

        return schedule.filter((schedule) => {
            const { startAt, endAt } = schedule;
            const pStart = toMillis(startAt);
            const pEnd = toMillis(endAt);
            return pStart < vStart ? pEnd > vStart : pStart <= vEnd;
        });
    }),
);

export const scheduleOfChannelSelector = atomFamily((id: string) =>
    atom((get) => {
        const openingMillis = get(openingMillisState);
        const channel = get(channelSelector(id));
        return channel
            ? channel.schedule.filter(
                  (schedule) => toMillis(schedule.endAt) > openingMillis,
              )
            : [];
    }),
);

export const visibleWidthOfScheduleSlotState = atomFamily(
    (schedule: ChannelEpisode) =>
        atom((get) => {
            const visibleWidth = get(timeBarVisibleWidthState);
            const [vStart, vEnd] = get(visibleTimesInTimeBar);

            const { startAt, endAt } = schedule;
            const pStart = toMillis(startAt);
            const pEnd = toMillis(endAt);
            const alpha = (pEnd - Math.max(pStart, vStart)) / (vEnd - vStart);
            return lerp(0, visibleWidth, alpha);
        }),
);

let screenOverlayTimerId: Optional<number> = undefined;
export const writeLiveScreenOverlay = atom(
    null,
    (
        get,
        set,
        {
            type,
            config = { state: 'infinite' },
        }: { type: LiveScreenOverlayType; config?: ScreenOverlayConfig },
    ) => {
        screenOverlayTimerId && window.clearTimeout(screenOverlayTimerId);
        set(liveScreenOverlayState, type);

        const isFullDescriptionVisible = get(isFullDescriptionVisibleState);
        if (isFullDescriptionVisible) {
            set(isFullDescriptionVisibleState, false);
        }

        const { IDLE } = LiveScreenOverlayType;
        if (type === IDLE) return;

        if (config.state === 'delayed') {
            screenOverlayTimerId = window.setTimeout(() => {
                set(liveScreenOverlayState, IDLE);
            }, config.duration);
        }
    },
);

export const currentToolbarMenuState = atomWithReset<ChannelBannerToolMenu>(
    ChannelBannerToolMenu.GUIDE,
);

export const findAiringEpisode = (
    schedule: ChannelEpisode[],
    current: number = new Date().getTime(),
) => {
    return schedule.find(isEpisodeAiring(current));
};

export const isEpisodeAiring =
    (current: number = new Date().getTime()) =>
    (schedule: ChannelEpisode) => {
        const { startAt, endAt } = schedule;
        return toMillis(startAt) < current && toMillis(endAt) >= current;
    };

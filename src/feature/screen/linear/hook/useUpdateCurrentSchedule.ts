import { useCallback, useEffect, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { toTimestamp } from '@/util/common';
import { usePrevious } from '@/hook/usePrevious';
import { useScheduleUpdater } from '@/hook/useScheduleUpdater';
import { useVisibility } from '@/hook/useVisibilityChange';
import { Optional } from '@/type/common';
import { Channel, ChannelEpisode } from '@/type/linear';
import { findChannelSelector, onAirScheduleEndTimeState, onAirScheduleState } from '@/atom/screen';
import { VideoErrorState, videoErrorState } from '@/atom/screen/linear';
import { writeWatchHistory } from '@/atom/app';

const WATCH_TIME_THRESHOLD_SECONDS = 10;

export const useUpdateCurrentSchedule = (channel: Optional<Channel>) => {
    const setSchedule = useSetAtom(onAirScheduleState);
    const [scheduleEndTime, setScheduleEndTime] = useAtom(onAirScheduleEndTimeState);

    const setWatchHistory = useSetAtom(writeWatchHistory);

    const getChannel = useAtomCallback(
        useCallback((get, _, schedule: ChannelEpisode) => {
            return get(findChannelSelector(schedule));
        }, [])
    );
    const getCurrentSchedule = useAtomCallback(useCallback((get) => get(onAirScheduleState), []));
    const currentSchedule = getCurrentSchedule();
    const prevSchedule = usePrevious(currentSchedule);

    const secondsRef = useRef(0);
    const scheduleEnterTimeRef = useRef(-1);

    const visible = useVisibility();
    const prevVisible = usePrevious(visible);

    const errorState = useAtomValue(videoErrorState);
    const getAsyncErrorState = useAtomCallback(useCallback((get) => get(videoErrorState), []));

    const initTime = () => {
        subscribeToUpdateCallback(undefined);
        secondsRef.current = 0;
    };

    const addWatchHistory = useCallback(() => {
        if (!currentSchedule) return;
        if (getAsyncErrorState().type === VideoErrorState.FAILED) return;

        secondsRef.current += 1;
        const { current: seconds } = secondsRef;

        if (seconds >= WATCH_TIME_THRESHOLD_SECONDS) {
            const channel = getChannel(currentSchedule);
            if (channel) {
                setWatchHistory({
                    type: 'linear',
                    content: {
                        contentId: channel.contentId
                    }
                });
            }

            initTime();
        }
    }, [currentSchedule]);

    const subscribeToUpdateCallback = useScheduleUpdater({
        channel,
        scheduleEndTime,
        setSchedule,
        setScheduleEndTime
    });

    useEffect(() => {
        const currentTime = toTimestamp(Date.now());

        if (visible && errorState.type === VideoErrorState.IDLE) {
            if (prevVisible !== visible && visible) {
                scheduleEnterTimeRef.current = -1;
            }

            if (currentSchedule) {
                scheduleEnterTimeRef.current = currentTime;
            }
        }

        if (errorState.type === VideoErrorState.FAILED) {
            scheduleEnterTimeRef.current = -1;
        }
    }, [currentSchedule, visible, errorState]);

    useEffect(() => {
        const isChannelsEqual =
            prevSchedule?.channelId === currentSchedule?.channelId &&
            prevSchedule?.contentId !== currentSchedule?.contentId;

        if (isChannelsEqual) return;

        subscribeToUpdateCallback(addWatchHistory);

        return () => initTime();
    }, [currentSchedule]);
};

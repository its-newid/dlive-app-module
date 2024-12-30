import { useCallback, useEffect, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { toTimestamp } from '@/util/common';
import { usePrevious } from '@/hook/usePrevious';
import { useScheduleUpdater } from '@/hook/useScheduleUpdater';
import { useVisibility } from '@/hook/useVisibilityChange';
import { Optional } from '@/type/common';
import { Channel } from '@/type/linear';
import { onAirScheduleEndTimeState, onAirScheduleState } from '@/atom/screen';
import { VideoErrorState, videoErrorState } from '@/atom/screen/linear';

export const useUpdateCurrentSchedule = (channel: Optional<Channel>) => {
    const setSchedule = useSetAtom(onAirScheduleState);
    const [scheduleEndTime, setScheduleEndTime] = useAtom(
        onAirScheduleEndTimeState,
    );

    const getCurrentSchedule = useAtomCallback(
        useCallback((get) => get(onAirScheduleState), []),
    );
    const currentSchedule = getCurrentSchedule();
    const prevSchedule = usePrevious(currentSchedule);

    const secondsRef = useRef(0);
    const scheduleEnterTimeRef = useRef(-1);

    const visible = useVisibility();
    const prevVisible = usePrevious(visible);

    const errorState = useAtomValue(videoErrorState);

    const initTime = () => {
        subscribeToUpdateCallback(undefined);
        secondsRef.current = 0;
    };

    const subscribeToUpdateCallback = useScheduleUpdater({
        channel,
        scheduleEndTime,
        setSchedule,
        setScheduleEndTime,
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

        return () => initTime();
    }, [currentSchedule]);
};

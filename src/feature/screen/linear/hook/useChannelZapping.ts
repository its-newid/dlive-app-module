import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { CHANNEL_DOWN, CHANNEL_UP, DOWN, UP } from '@/util/eventKey';
import { mod } from '@/util/common';
import { makeKeyboardEvent } from '@/util/makeKeyboardEvent';
import { channelNowState, channelsState } from '@/atom/screen';

export function useChannelZapping({
    enable,
    callback = undefined
}: {
    enable: boolean;
    callback?: () => void;
}) {
    const channels = useAtomValue(channelsState);
    const [channelNow, setChannelsNow] = useAtom(channelNowState);

    const channelChangeKeys = useMemo(() => [UP, DOWN, CHANNEL_UP, CHANNEL_DOWN], []);

    function handleKeyDown(event: KeyboardEvent) {
        const { keyCode } = event;
        if (!channelChangeKeys.includes(keyCode)) return;

        const delta = keyCode === UP || keyCode === CHANNEL_UP ? -1 : 1;
        const currentIndex = channels.findIndex((ch) => ch.contentId === channelNow?.contentId);
        const channel = channels[mod(currentIndex + delta, channels.length)];
        channel && setChannelsNow(channel);
        callback?.();
    }

    const handleWheel = (event: WheelEvent) => dispatchEvent(makeKeyboardEvent('keydown')(event));

    useEffect(() => {
        if (!enable) return;

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [channels, channelNow, enable, callback]);

    return { channelNow };
}

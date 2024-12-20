import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
// import { useNavigate } from 'react-router';
import { channelNowState, channelsState } from '@/atom/screen';
import { CHANNEL_DOWN, CHANNEL_UP, DOWN, UP } from '@/util/eventKey';
import { mod } from '@/util/common';

export function useChannelZapping({
    enable,
    callback = undefined,
}: {
    enable: boolean;
    callback?: () => void;
}) {
    const channels = useAtomValue(channelsState);
    const [channelNow, setChannelsNow] = useAtom(channelNowState);

    const channelChangeKeys = useMemo(
        () => [UP, DOWN, CHANNEL_UP, CHANNEL_DOWN],
        [],
    );

    function handleKeyDown(event: KeyboardEvent) {
        const { keyCode } = event;
        if (!channelChangeKeys.includes(keyCode)) return;

        const delta = keyCode === UP || keyCode === CHANNEL_UP ? -1 : 1;
        const currentIndex = channels.findIndex(
            (ch) => ch.contentId === channelNow?.contentId,
        );
        const channel = channels[mod(currentIndex + delta, channels.length)];
        channel && setChannelsNow(channel);
        callback?.();
    }
    // const navigate = useNavigate();

    // const handleKeyDown = useCallback(
    //     (event: KeyboardEvent) => {
    //         const { keyCode } = event;
    //         if (![UP, DOWN, CHANNEL_UP, CHANNEL_DOWN].includes(keyCode)) return;

    //         const delta = keyCode === UP || keyCode === CHANNEL_UP ? -1 : 1;
    //         const currentIndex = channels.findIndex(
    //             (ch) => ch.contentId === channelNow?.contentId,
    //         );
    //         const channel =
    //             channels[
    //                 (currentIndex + delta + channels.length) % channels.length
    //             ];
    //         if (channel) {
    //             setChannelsNow(channel);
    //             navigate(`/live/${channel.contentId}`, { replace: true });
    //         }
    //         callback?.();
    //     },
    //     [channels, channelNow, setChannelsNow, navigate, callback],
    // );

    useEffect(() => {
        if (!enable) return;

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enable, handleKeyDown]);

    return { channelNow };
}

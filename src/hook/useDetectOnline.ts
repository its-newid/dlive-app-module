import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { channelNowState } from '@/atom/screen';
import { NETWORK_ERROR_CHANNEL_ID } from '@/api/scheduleQuery.ts';

export const useDetectOnline = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const channelNow = useAtomValue(channelNowState);

    const setOnline = () => setIsOnline(true);

    useEffect(() => {
        const handleStatusChange = () => setIsOnline(false);
        if (channelNow?.contentId === NETWORK_ERROR_CHANNEL_ID)
            handleStatusChange();
        window.addEventListener('offline', handleStatusChange);

        return () => {
            window.removeEventListener('offline', handleStatusChange);
        };
    }, [channelNow]);

    return { isOnline, setOnline };
};

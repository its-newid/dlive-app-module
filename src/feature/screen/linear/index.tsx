import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { channelNowState } from '@/atom/screen';
import {
    ChannelUpdateState,
    useInitialOverlay,
    useParamsUpdate
} from '@/feature/screen/linear/hook/useRouting.tsx';
import { useUpdateCurrentSchedule } from '@/feature/screen/linear/hook/useUpdateCurrentSchedule.ts';
import Player from '@/feature/screen/linear/Player.tsx';

const LiveScreen = () => {
    const [liveUrl, setLiveUrl] = useState('');

    const currentChannel = useAtomValue(channelNowState);

    const { channelUpdateState } = useParamsUpdate();
    useUpdateCurrentSchedule(currentChannel);
    useInitialOverlay();

    useEffect(() => {
        if (channelUpdateState === ChannelUpdateState.SUCCESS) {
            setLiveUrl(currentChannel?.liveUrl ?? '');
        }
    }, [currentChannel, channelUpdateState]);
    return <Player url={liveUrl} />;
};
export default LiveScreen;

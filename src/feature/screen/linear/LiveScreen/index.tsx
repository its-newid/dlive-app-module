import { channelNowState } from '@/atom/screen';
import { useAtomValue } from 'jotai';
import { ChannelUpdateState, useParamsUpdate } from '../hook/useRouting';
import { useEffect, useState } from 'react';
import Player from '@/feature/screen/linear/Player';

const LiveScreen = () => {
    const [liveUrl, setLiveUrl] = useState('');

    const currentChannel = useAtomValue(channelNowState);
    const { channelUpdateState } = useParamsUpdate();

    useEffect(() => {
        if (channelUpdateState === ChannelUpdateState.SUCCESS) {
            setLiveUrl(currentChannel?.liveUrl ?? '');
        }
    }, [currentChannel, channelUpdateState]);

    return <Player url={liveUrl} />;
};

export default LiveScreen;

import { useEffect, useState } from 'react';
import Player from './Player';
import { useAtomValue } from 'jotai';
import { channelNowState } from '@/atom/screen';
import { useUpdateCurrentSchedule } from './hook/useUpdateCurrentSchedule';
import { withScheduleLoading } from './hook/withScheduleLoading';
import {
    ChannelUpdateState,
    useInitialOverlay,
    useParamsUpdate,
} from './hook/useRouting';

/**
 * state
 * backgroundLocation: boolean
 * overlayType?: LiveScreenOverlayType
 */

/**
 * params
 * contentId: string
 */

function LiveScreen() {
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
}
export default withScheduleLoading(LiveScreen);

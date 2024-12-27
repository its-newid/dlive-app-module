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
import { API_ERROR_CHANNEL_ID } from '@/api/scheduleQuery.ts';
import { useNavigate } from 'react-router';
import { RoutePath } from '@/type/routePath';

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
    const navigate = useNavigate();
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

    useEffect(() => {
        if (currentChannel?.contentId === API_ERROR_CHANNEL_ID)
            navigate(RoutePath.ERROR);
    }, [currentChannel]);

    return <Player url={liveUrl} />;
}
export default withScheduleLoading(LiveScreen);

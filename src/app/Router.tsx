import { useAtomValue } from 'jotai';
import {
    createHashRouter,
    RouterProvider,
    RouteObject,
    Navigate,
} from 'react-router';
import { channelNowState, channelsState } from '@/atom/screen';
import LinearLayout from '@/component/layout/LinearLayout';
import LiveScreen from '@/feature/screen/linear/LiveScreen';
import withLoading from '@/app/withLoading';
import { NetworkErrorPage } from '@/app/NetworkErrorPage';
import { useDetectOnline } from '@/hook/useDetectOnline';

function AppRouter() {
    const { isOnline, setOnline } = useDetectOnline();
    const channelNow = useAtomValue(channelNowState);
    const channels = useAtomValue(channelsState);

    const routes: RouteObject[] = [
        {
            path: '/',
            element: <LinearLayout />,
            children: [
                {
                    index: true,
                    element: (
                        <Navigate
                            to={`/live/${channelNow?.contentId || channels[0]?.contentId}`}
                            replace
                        />
                    ),
                },
                {
                    path: '/live/:id',
                    element: <LiveScreen />,
                },
            ],
        },
    ];

    const router = createHashRouter(routes);

    return isOnline ? (
        <RouterProvider router={router} />
    ) : (
        <NetworkErrorPage onConnected={setOnline} />
    );
}

export default withLoading(AppRouter);

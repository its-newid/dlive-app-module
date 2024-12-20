import {
    createHashRouter,
    RouterProvider,
    RouteObject,
    // Navigate,
} from 'react-router';
// import { channelNowState, channelsState } from '@/atom/screen';
import LinearLayout from '@/component/layout/LinearLayout';
// import LiveScreen from '@/feature/screen/linear/LiveScreen';
import withLoading from '@/app/withLoading';
import { NetworkErrorPage } from '@/app/NetworkErrorPage';
import { useDetectOnline } from '@/hook/useDetectOnline';
import { RoutePath } from '@/type/routePath';
import { ErrorPage } from '@/component/ErrorPage';

function AppRouter() {
    const { isOnline, setOnline } = useDetectOnline();

    const routes: RouteObject[] = [
        {
            path: '/',
            element: <LinearLayout />,
        },
        {
            path: RoutePath.ERROR,
            element: <ErrorPage />,
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

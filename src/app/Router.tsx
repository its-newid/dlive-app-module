import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import LiveScreen from '@/feature/screen/linear/LiveScreen';
import { ErrorPage } from '@/component/ErrorPage.tsx';
import LinearLayout from '@/component/layout/LinearLayout';
import { RoutePath } from '@/type/routePath.ts';
import { useDetectOnline } from '@/hook/useDetectOnline.ts';
import { NetworkErrorPage } from '@/app/NetworkErrorPage.tsx';
import AgreementScreen from '@/feature/agreement';
import withLoading from '@/app/withLoading.tsx';

const router = createHashRouter([
    {
        path: '/',
        element: <LinearLayout />,
        children: [
            {
                index: true,
                element: <Navigate to='/live/newid_269' replace />
            },
            {
                path: 'live/:id',
                element: <LiveScreen />
            }
        ]
    },
    {
        path: RoutePath.ERROR,
        element: <ErrorPage />
    },
    {
        path: RoutePath.ONBOARDING,
        element: <AgreementScreen />
    }
]);

const Router = () => {
    const { isOnline, setOnline } = useDetectOnline();

    return isOnline ? (
        <RouterProvider router={router} />
    ) : (
        <NetworkErrorPage onConnected={setOnline} />
    );
};

export default withLoading(Router);

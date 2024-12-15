import { createHashRouter, RouterProvider } from 'react-router';
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
        element: <LinearLayout />
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

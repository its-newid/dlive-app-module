import { createHashRouter, RouterProvider, RouteObject } from 'react-router';
import LinearLayout from '@/component/layout/LinearLayout';
import withLoading from '@/app/withLoading';
import { RoutePath } from '@/type/routePath';
import { ErrorPage } from '@/component/ErrorPage';

function AppRouter() {
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

    return <RouterProvider router={router} />;
}

export default withLoading(AppRouter);

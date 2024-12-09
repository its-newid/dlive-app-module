import { createHashRouter, RouterProvider, Navigate } from 'react-router';
import LinearLayout from '@/layout/LinearLayout';
import LiveScreen from '@/features/screen/linear/LiveScreen';

const router = createHashRouter([
    {
        path: '/',
        element: <LinearLayout />,
        children: [
            {
                index: true,
                element: <Navigate to='/live/44' replace />
            },
            {
                path: 'live/:id',
                element: <LiveScreen />
            }
        ]
    }
]);

const Router = () => {
    return <RouterProvider router={router} />;
};

export default Router;

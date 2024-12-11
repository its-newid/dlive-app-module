import { useLocation } from 'react-router';
import { RoutePath } from '../type/routePath';
import { useOnMount } from './useOnMount';
import { useAtomValue } from 'jotai';
import { isFirstLaunchState } from '../atom/app';

export const useLoggingSessionEvent = () => {
    const { pathname } = useLocation();

    const isFirstLaunch = useAtomValue(isFirstLaunchState);
    const rootPath = isFirstLaunch ? RoutePath.ONBOARDING : RoutePath.LIVE_SCREEN;

    useOnMount(() => {
        const isOnboarding = (path: string) => path === RoutePath.ONBOARDING;
        const isAtRootPath = pathname === '/';

        if (isOnboarding(pathname) || (isAtRootPath && isOnboarding(rootPath))) {
        }
    });

    return { rootPath };
};

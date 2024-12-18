export const RoutePath = {
    LIVE_SCREEN: '/live/:id',
    ERROR: '/error',
    ONBOARDING: '/onboarding',
} as const;
export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath];

export const RoutePath = {
    ONBOARDING: '/onboarding',
    HOME: '/',
    ERROR: '/error',
} as const;
export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath];

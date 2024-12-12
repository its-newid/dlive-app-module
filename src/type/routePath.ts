export const RoutePath = {
    ONBOARDING: '/onboarding',
    AGREEMENT: '/agreement',
    HOME: '/',
    ERROR: '/error'
} as const;
export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath];

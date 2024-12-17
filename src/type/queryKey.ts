export const QueryKeys = {
    SCHEDULE: 'schedule',
    APP: 'app',
} as const;
export type QueryKeys = (typeof QueryKeys)[keyof typeof QueryKeys];

export const QueryKeys = {
    SCHEDULE: 'schedule'
} as const;
export type QueryKeys = (typeof QueryKeys)[keyof typeof QueryKeys];

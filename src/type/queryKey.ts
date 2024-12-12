export const QueryKeys = {
    APP: 'app'
} as const;
export type QueryKeys = (typeof QueryKeys)[keyof typeof QueryKeys];

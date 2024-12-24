export const LegalType = {
    TERMS: 'terms',
    PRIVACY: 'privacy',
    SHARE: 'share',
} as const;
export type LegalType = (typeof LegalType)[keyof typeof LegalType];

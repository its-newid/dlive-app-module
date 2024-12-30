import { Selectable } from '@/type/common';
import { LegalType } from '@/type/legal';

export const AgreementFocusState = {
    MENU: 'menu',
    CONTENT: 'content',
    AGREE: 'agree',
} as const;
export type AgreementFocusState =
    (typeof AgreementFocusState)[keyof typeof AgreementFocusState];

// export const currentFocusState = atom<AgreementFocusState>(
//     AgreementFocusState.MENU,
// );

// export const canContentFocusState = atom(false);

export type LegalItem = Selectable & {
    type: LegalType;
};

export type TLegalMenuItem = LegalItem & {
    title: string;
};

// export const currentSelectedItemState = atom<Nullable<TLegalMenuItem>>(null);

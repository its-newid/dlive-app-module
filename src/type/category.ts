import { RowContent } from '@/type/common';

export const MyListCategory = {
    idx: -1,
    name: 'My List',
} as const;

export type Category = {
    idx: number;
    name: string;
    avod: RowContent[];
    linear: RowContent[];
};

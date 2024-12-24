import { RowContent } from '@/type/common';

export const MyListCategory = {
    idx: -1,
    name: '즐겨찾는 채널',
} as const;

export type Category = {
    idx: number;
    name: string;
    avod: RowContent[];
    linear: RowContent[];
};

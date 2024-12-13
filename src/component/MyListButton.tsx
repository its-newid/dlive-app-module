import { SVGProps } from 'react';
import MyListIcon from '@/asset/icMyList.svg';
import MyListFillIcon from '@/asset/icMyListFill.svg';

interface Props extends Pick<SVGProps<SVGSVGElement>, 'aria-label' | 'id'> {
    isMyList: boolean;
}

export function MyListButton({ isMyList, ...rest }: Props) {
    return isMyList ? <MyListFillIcon {...rest} /> : <MyListIcon {...rest} />;
}

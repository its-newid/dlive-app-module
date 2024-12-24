import { ReactNode } from 'react';
import { IExtendableStyledComponent } from '@/type/common';

export type ContainerComponent<T = IExtendableStyledComponent> = T & {
    children?: ReactNode;
};

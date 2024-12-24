import styled from 'styled-components';
import Icon from '@/asset/icArrowUpTail.svg?react';
import { IExtendableStyledComponent } from '@/type/common';

export function ArrowUpTail({ ...rest }: IExtendableStyledComponent) {
    return <Image {...rest} />;
}

export function ArrowLeftTail() {
    return <RotatedImage data-arrow-left={true} />;
}

const Image = styled(Icon)`
    width: 48rem;
    height: 48rem;
`;

const RotatedImage = styled(ArrowUpTail)`
    transform: rotate(270deg);
`;

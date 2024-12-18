import styled from 'styled-components';
import SVG from '@/asset/icArrowUp.svg?react';

function ArrowUp() {
    return <Image />;
}

function ArrowDown() {
    return <RotatedImage />;
}

export { ArrowUp, ArrowDown };

const Image = styled(SVG)`
    width: 48rem;
    height: 48rem;
`;

const RotatedImage = styled(Image)`
    transform: rotate(180deg);
`;

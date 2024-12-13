import styled, { keyframes } from 'styled-components';
import Spinner from '@/asset/icSpinner.png';
import { IExtendableStyledComponent } from '@/type/common';

type Props = IExtendableStyledComponent & {
    message?: string;
};

export function LoadingSpinner({ className }: Props) {
    return (
        <Container className={className} aria-live={'assertive'}>
            <Element src={Spinner} alt={'loading'} />
        </Container>
    );
}

const spin = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
`;

const Element = styled.img`
    position: absolute;
    top: 50%;
    left: 50%;
    animation: ${spin} 1s linear infinite;
    width: 108rem;
    height: 108rem;
`;

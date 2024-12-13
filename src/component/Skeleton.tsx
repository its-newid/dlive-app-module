import styled, { DefaultTheme, keyframes } from 'styled-components';
import { IExtendableStyledComponent } from '@/type/common';

type SkeletonProps = IExtendableStyledComponent;

export function Skeleton({ className }: SkeletonProps) {
    return <Container className={className} />;
}

const loading = (theme: DefaultTheme) => keyframes`
  0% {
    background-color: ${theme.colors.grey70};
  }
  100% {
    background-color: ${theme.colors.grey90};
  }
`;

const Container = styled.div`
    animation: ${({ theme }) => loading(theme)} 1s linear infinite alternate;
`;

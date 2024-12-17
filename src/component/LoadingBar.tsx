import styled, { css, DefaultTheme, keyframes } from 'styled-components';

interface LoadingBarProps {
    width?: string;
    height?: string;
    radius?: string;
}

const Animation = (theme: DefaultTheme) => keyframes`
    0% {
      transform: scaleX(0);
      background: linear-gradient(90deg, ${theme.colors.main2} 70%, ${theme.colors.main});
    }
  100% {
    transform: scaleX(100%);
    background: linear-gradient(90deg, ${theme.colors.main2} 70%, ${theme.colors.main});
  }
`;

const LoadingBarContainer = styled.div<LoadingBarProps>`
    ${(props: LoadingBarProps) => css`
        width: ${props.width ? props.width : '100%'};
        height: ${props.height ? props.height : '8rem'};
    `}
    background: rgba(255, 255, 255, 0.25);
    border-radius: ${(props) => (props.radius ? props.radius : 0)};
    & > * {
        border-radius: ${(props) => (props.radius ? props.radius : 0)};
    }
`;

const LoadingBarProgress = styled.div`
    width: 100%;
    height: 100%;
    transform-origin: left;
    will-change: transform;
    animation: ${({ theme }) => Animation(theme)} 1.5s ease-in-out infinite;
`;

export function LoadingBar({ ...rest }) {
    return (
        <LoadingBarContainer {...rest}>
            <LoadingBarProgress />
        </LoadingBarContainer>
    );
}

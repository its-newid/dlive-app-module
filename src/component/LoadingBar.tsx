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
    ${({ width, height, radius }) => css`
        width: ${width ? width : '100%'};
        height: ${height ? height : '8rem'};
        border-radius: ${radius ? radius : 0};
    `}
    background: rgba(255, 255, 255, 0.25);
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

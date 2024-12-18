import { keyframes } from 'styled-components';

const SlideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }

`;

const SlideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const FadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const AnimationType = {
    SLIDE_IN: 0,
    SLIDE_OUT: 1,
    FADE_IN: 2,
    FADE_OUT: 3,
} as const;

export type AnimationType = (typeof AnimationType)[keyof typeof AnimationType];

export const Group: Record<AnimationType, ReturnType<typeof keyframes>> = {
    [AnimationType.SLIDE_IN]: SlideIn,
    [AnimationType.SLIDE_OUT]: SlideOut,
    [AnimationType.FADE_IN]: FadeIn,
    [AnimationType.FADE_OUT]: FadeOut,
};

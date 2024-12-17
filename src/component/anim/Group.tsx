import { keyframes } from 'styled-components';
import { Keyframes } from 'styled-components/dist/types';

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

export const Animation = {
    SLIDE_IN: 0,
    SLIDE_OUT: 1,
    FADE_IN: 2,
    FADE_OUT: 3,
} as const;
export type Animation = (typeof Animation)[keyof typeof Animation];

export const Group: Record<Animation, Keyframes> = {
    [Animation.SLIDE_IN]: SlideIn,
    [Animation.SLIDE_OUT]: SlideOut,
    [Animation.FADE_IN]: FadeIn,
    [Animation.FADE_OUT]: FadeOut,
};

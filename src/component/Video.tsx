import { ForwardedRef, forwardRef } from 'react';
import styled from 'styled-components';
import { ERROR_VIDEO_URL } from '@/app/environment';

export type VideoConfig = {
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
};

type VideoProps = Partial<VideoConfig> & {
    src?: string;
};

function Video({ ...rest }: VideoProps, ref: ForwardedRef<HTMLVideoElement>) {
    return <StyledVideo {...rest} ref={ref} />;
}

export default forwardRef<HTMLVideoElement, VideoProps>(Video);

export function hasErrorVideoSrc(element: HTMLVideoElement) {
    return element.src === ERROR_VIDEO_URL;
}

const StyledVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

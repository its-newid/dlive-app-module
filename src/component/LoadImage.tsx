import { ForwardedRef, forwardRef, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Nullable } from '@/type/common';
import { useImageLoaded } from '@/hook/useImageLoaded';
import Clickable, { ClickableProps } from './Clickable';
import { theme } from '@/style/Theme';

type ImgProps = Pick<React.ComponentProps<'img'>, 'src' | 'alt'>;

export interface LoadImageProps extends ClickableProps, ImgProps {
    children?: ReactNode;
    placeholderColor?: string;
}

function LoadImage(
    { src, alt = '', placeholderColor = theme.colors.grey80, children, ...rest }: LoadImageProps,
    ref: ForwardedRef<HTMLDivElement>
) {
    const { isImgLoaded, setImgRef } = useImageLoaded(src ?? '');
    return (
        <Container {...rest} ref={ref}>
            {!isImgLoaded && <FallbackImage color={placeholderColor} />}
            <Image src={src} callbackRef={setImgRef} alt={alt} />
            {children && children}
        </Container>
    );
}

export default forwardRef<HTMLDivElement, LoadImageProps>(LoadImage);

type ImageProp = Pick<LoadImageProps, 'src' | 'alt'> & {
    callbackRef: (node: Nullable<HTMLImageElement>) => void;
};

function Image({ callbackRef, ...rest }: ImageProp) {
    return <Thumbnail {...rest} ref={callbackRef} />;
}

const Container = styled(Clickable)`
    position: relative;
`;

const DEFAULT_THUMBNAIL_STYLE = css`
    width: 100%;
    height: 100%;
    border-radius: 16rem;
`;

const FallbackImage = styled.div<{ color: string }>`
    position: absolute;
    ${DEFAULT_THUMBNAIL_STYLE};
    background-color: ${({ color }) => color};
`;

const Thumbnail = styled.img`
    ${DEFAULT_THUMBNAIL_STYLE};
    object-fit: cover;
`;

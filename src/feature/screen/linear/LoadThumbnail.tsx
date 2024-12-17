import LoadImage, { LoadImageProps } from '@/component/LoadImage';

export function LoadThumbnail({ ...rest }: LoadImageProps) {
    return <LoadImage {...rest} ref={null} />;
}

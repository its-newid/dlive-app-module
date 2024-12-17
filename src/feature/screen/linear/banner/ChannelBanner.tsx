import styled from 'styled-components';
import { Logo as StyledLogo } from '../../../../component/Logo';
import { Toolbar as BannerBottom } from './Toolbar';
import { ChannelBannerInfo as Info } from './ChannelBannerInfo';
import { useAtomValue } from 'jotai';
import { ArrowDown, ArrowUp } from '@/component/ArrowUpDown';
import { LoadThumbnail } from '../LoadThumbnail';
import { ThumbRatio, ThumbSizes } from '@/type/common';
import { channelNowState } from '@/atom/screen';
import { isFullDescriptionVisibleState } from '@/atom/screen/linear';

export function ChannelBanner() {
    return (
        <>
            <LogoLayer />
            <Logo />
            <BannerContainer>
                <BannerTop>
                    <Thumbnail />
                    <Info />
                </BannerTop>
                <BannerBottom />
            </BannerContainer>
        </>
    );
}

function Thumbnail() {
    const channelInfo = useAtomValue(channelNowState);
    const isFullDescriptionVisible = useAtomValue(isFullDescriptionVisibleState);
    const thumbUrl = channelInfo?.thumbUrl?.[ThumbRatio.WIDE]?.[ThumbSizes.SMALL];

    return (
        <ThumbContainer $isFullDescriptionVisible={isFullDescriptionVisible}>
            {!isFullDescriptionVisible && <ArrowUp />}
            <Thumb src={thumbUrl ?? ''} />
            {!isFullDescriptionVisible && <ArrowDown />}
        </ThumbContainer>
    );
}

const LogoLayer = styled.div`
    top: 0;
    left: 0;
    width: 100%;
    height: 216rem;
    position: absolute;
    background: linear-gradient(
        180deg,
        rgba(27, 28, 29, 0.8) 0%,
        rgba(27, 28, 29, 0.5) 50%,
        rgba(27, 28, 29, 0) 100%
    );
`;

const Logo = styled(StyledLogo)`
    position: absolute;
    top: 80rem;
    left: 72rem;
    width: 154rem;
    height: 56rem;
`;

const BannerContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 0;
    width: 100%;
`;

const BannerTop = styled.div`
    display: flex;
    width: 100%;
    height: 320rem;
    background: linear-gradient(
        180deg,
        rgba(27, 28, 29, 0) 0%,
        rgba(27, 29, 29, 0.5) 27.5%,
        rgba(27, 28, 29, 0.8) 68.23%,
        ${({ theme }) => theme.colors.grey90}
    );
`;

const ThumbContainer = styled.div<{ $isFullDescriptionVisible: boolean }>`
    display: flex;
    flex-direction: column;
    margin-top: ${({ $isFullDescriptionVisible }) =>
        $isFullDescriptionVisible ? `64rem` : `16rem`};
    margin-left: 68rem;
    align-items: center;
    min-width: fit-content;
    max-width: fit-content;
`;

const Thumb = styled(LoadThumbnail)`
    width: 288rem;
    height: 162rem;
    object-fit: cover;
    border-radius: 16rem;
`;

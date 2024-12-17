import { ThumbSizes } from '@/type/common';
import { Marquee } from '@/component/Marquee';
import { Channel, ChannelEpisode } from '@/type/linear';
import { useDeferredValue } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';
import styled from 'styled-components';
import { LoadThumbnail } from '../../LoadThumbnail';
import { ThumbRatio } from '@/type/common';
import Time from './Time';

const Info = ({ info }: { info: { schedule: ChannelEpisode; channel: Channel } }) => {
    const deferredValue = useDeferredValue(info);
    const { schedule, channel } = useDeferredValue(deferredValue);
    const { t } = useTranslation();

    return (
        <InfoContainer>
            <Thumbnail
                src={
                    info.schedule.thumbUrl ??
                    channel?.thumbUrl?.[ThumbRatio.WIDE]?.[ThumbSizes.SMALL]
                }
            />
            <Detail>
                <ChannelInfo>
                    <span>{t('guide_episode_info_channel_number', { no: channel?.no })}</span>
                    <span>{channel?.title}</span>
                </ChannelInfo>
                <>
                    <Title
                        delay={2}
                        text={schedule?.title ?? ''}
                        enabled={info === deferredValue}
                        animationStyle='oneWayReset'
                    />
                    <Description id={'ep-desc'}>{schedule.description}</Description>
                    <Time schedule={deferredValue.schedule} />
                </>
            </Detail>
        </InfoContainer>
    );
};

export default Info;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    overflow: hidden;
    margin-right: 224rem;
`;

const Thumbnail = styled(LoadThumbnail)`
    min-width: 448rem;
    width: 448rem;
    height: 252rem;
    margin-right: 64rem;
`;

const Detail = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ChannelInfo = styled.div`
    display: flex;
    width: inherit;

    span {
        font: ${({ theme }) =>
            `${theme.fonts.weight.bold} 30rem/38rem ${theme.fonts.family.pretendard}`};
        color: ${({ theme }) => theme.colors.whiteAlpha95};
    }

    > :last-child {
        margin-left: 16rem;
    }
`;

const Title = styled(Marquee)`
    width: 100%;
    margin-top: 16rem;
    font-size: 48rem;
    font-weight: ${({ theme }) => theme.fonts.weight.bold};
    line-height: 56rem;
    color: ${({ theme }) => theme.colors.whiteAlpha95};
`;

const lineClamp = css`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;
const textOverflow = css`
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
`;

const Description = styled.span`
    min-height: 64rem;
    max-height: 64rem;
    margin-top: 14rem;
    ${textOverflow};
    ${lineClamp};
    font-size: 24rem;
    line-height: 32rem;
    color: ${({ theme }) => theme.colors.whiteAlpha64};
`;

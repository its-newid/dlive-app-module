import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { ProgressBar } from '@/component/ProgressBar';
import { LoadingBar as StyledLoadingBar } from '@/component/LoadingBar';
import { MiniBannerLoader as Loading } from './MiniBannerLoader';
import { Marquee } from '@/component/Marquee';
import { useTimeRage } from '@/hook/useProgress';
import { LoadThumbnail } from '../LoadThumbnail';
import { Optional, ThumbRatio, ThumbSizes } from '@/type/common';
import { atom } from 'jotai';
import { ChannelEpisode } from '@/type/linear';
import { VideoState, videoState } from '@/atom/screen/linear';
import { channelNowState, onAirScheduleState } from '@/atom/screen';

export function MiniBanner() {
    const infoAtom = useMemo(() => {
        return atom((get) => {
            const channelInfo = get(channelNowState);
            const schedule = get(onAirScheduleState);
            return {
                channelInfo,
                schedule,
            };
        });
    }, []);
    const info = useAtomValue(infoAtom);

    const error = !info.channelInfo || !info.schedule;

    return (
        <Container>
            {error ? (
                <Loading />
            ) : (
                <Content>
                    <ChannelNo>Ch {info.channelInfo?.no}</ChannelNo>
                    <ChannelName>{info.channelInfo?.title}</ChannelName>
                    <EpisodeTitle
                        delay={2}
                        text={info.schedule?.title ?? ''}
                        animationStyle='oneWayReset'
                    />
                    <TimeInfo schedule={info.schedule} />
                </Content>
            )}
            <Thumbnail
                alt={''}
                src={
                    info.channelInfo?.thumbUrl?.[ThumbRatio.WIDE]?.[
                        ThumbSizes.SMALL
                    ] ?? ''
                }
            />
        </Container>
    );
}

function TimeInfo({ schedule }: { schedule: Optional<ChannelEpisode> }) {
    const state = useAtomValue(videoState);
    const { timeRange } = useTimeRage({ schedule });

    return state === VideoState.IDLE ? (
        <LoadingBar />
    ) : (
        <Progressbar timeRange={timeRange} />
    );
}

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

const Container = styled(Content).attrs({
    tabIndex: 0,
})`
    position: absolute;
    top: 30%;
    left: 0;
    padding: 40rem 40rem 42rem 76rem;
    overflow: hidden;
    border-top-right-radius: 16rem;
    border-bottom-right-radius: 16rem;
    background-color: rgba(17, 24, 39, 0.5);

    &:focus {
        outline: none;
    }
`;

const ChannelNo = styled.span`
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 56rem/66rem ${theme.fonts.family.pretendard}`};
    color: white;
`;

const ChannelName = styled.span`
    margin-top: 24rem;
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 24rem/32rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha77};
`;

const Thumbnail = styled(LoadThumbnail)`
    position: absolute;
    top: 0;
    right: 0;
    width: 144rem;
    height: 81rem;
    margin-top: 40rem;
    margin-right: 40rem;
    border-radius: 16rem;
    object-fit: cover;
`;

const EpisodeTitle = styled(Marquee)`
    width: 424rem;
    min-height: 38rem;
    max-height: 38rem;
    margin-top: 15rem;
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 30rem/38rem ${theme.fonts.family.pretendard}`};
    color: white;
`;

const Progressbar = styled(ProgressBar)`
    margin-top: 14rem;
`;

const LoadingBar = styled(StyledLoadingBar)`
    margin-top: 14rem;
`;

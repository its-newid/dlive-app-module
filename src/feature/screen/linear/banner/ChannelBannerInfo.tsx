import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { ChannelBannerLoader as Loading } from './ChannelBannerLoader';
import styled, { css } from 'styled-components';
import { LoadingBar as StyledLoadingBar } from '@/component/LoadingBar';
import { SimpleProgressBar } from '@/component/ProgressBar';
import { Marquee } from '@/component/Marquee';
import { SingleLineEllipsis } from '@/component/SingleLineEllipsis';
import { ScheduleRemainingTime } from '../ScheduleRemainingTime';
import { ScheduleDuration } from '../ScheduleDuration';
import { useScheduleProgress } from '@/hook/useProgress';
import { Optional } from '@/type/common';
import { atom } from 'jotai';
import { ChannelEpisode } from '@/type/linear';
import {
    isFullDescriptionVisibleState,
    videoState,
    VideoState,
} from '@/atom/screen/linear';
import { channelNowState, onAirScheduleState } from '@/atom/screen';

export function ChannelBannerInfo() {
    const isFullDescriptionVisible = useAtomValue(
        isFullDescriptionVisibleState,
    );

    const infoAtom = useMemo(() => {
        return atom((get) => {
            const channelInfo = get(channelNowState);
            const schedule = get(onAirScheduleState);
            console.log('channelInfo:', channelInfo, 'schedule:', schedule);
            return {
                channelInfo,
                schedule,
            };
        });
    }, []);
    const info = useAtomValue(infoAtom);
    const error = !info.channelInfo || !info.schedule;

    return error ? (
        <Loading />
    ) : (
        <Container>
            <ChannelInfo>
                <span>Ch {info.channelInfo?.no}</span>
                <span>{info.channelInfo?.title}</span>
            </ChannelInfo>
            <EpisodeInfo>
                <EpisodeName
                    delay={2}
                    text={info.schedule?.title ?? ''}
                    animationStyle='oneWayReset'
                />
                <EpisodeDescription
                    $isFullDescription={isFullDescriptionVisible}
                >
                    {info.schedule?.description}
                </EpisodeDescription>
            </EpisodeInfo>
            {!isFullDescriptionVisible && <TimeInfo schedule={info.schedule} />}
        </Container>
    );
}

function TimeInfo({ schedule }: { schedule: Optional<ChannelEpisode> }) {
    const { value, maxValue, remainingValue, timeRange } =
        useScheduleProgress(schedule);

    const state = useAtomValue(videoState);

    return (
        <>
            {state === VideoState.IDLE ? (
                <LoadingBar />
            ) : (
                <ProgressBar value={value} max={maxValue} />
            )}
            <EpisodeTime id={'time'}>
                <ScheduleDuration range={timeRange} />
                <ScheduleRemainingTime leftMillis={remainingValue} />
            </EpisodeTime>
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 56rem 0 0 60rem;
`;

const ChannelInfo = styled.div`
    display: flex;

    span {
        font-size: 30rem;
        font-weight: bold;
        line-height: 38rem;
        color: white;
    }
    span:last-child {
        margin-left: 16rem;
    }
`;

const EpisodeInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 8rem;
    width: 1204rem;
`;

const EpisodeName = styled(Marquee)`
    width: 100%;
    height: 66rem;
    font-size: 56rem;
    font-weight: bold;
    line-height: 66rem;
    color: white;
`;

type DescriptionProps = {
    $isFullDescription: boolean;
};

const EpisodeDescription = styled(SingleLineEllipsis)<DescriptionProps>`
    width: 100%;
    height: 36rem;
    margin-top: 4rem;
    font-size: 24rem;
    line-height: 32rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.whiteAlpha64};

    ${({ $isFullDescription }) =>
        $isFullDescription &&
        css`
            height: auto;
            white-space: normal;
            z-index: 1;
            @supports (display: -webkit-box) {
                display: -webkit-box;
                -webkit-line-clamp: 6;
                -webkit-box-orient: vertical;
            }
        `};
`;

const EpisodeTime = styled.div`
    display: flex;
    width: 720rem;
    margin-top: 16rem;
    justify-content: space-between;

    > span {
        font-size: 28rem;
        line-height: 36rem;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.whiteAlpha77};
    }
`;

const barStyle = css`
    width: 720rem;
    margin-top: 16rem;
`;

const LoadingBar = styled(StyledLoadingBar)`
    ${barStyle};
`;

const ProgressBar = styled(SimpleProgressBar)`
    ${barStyle};
`;

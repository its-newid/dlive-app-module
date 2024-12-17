import React, { useDeferredValue, useEffect, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Logo } from '../../../../component/Logo';
import { EpisodeInfoLoader as InfoLoading } from '@/feature/screen/linear/guide/EpisodeInfoLoader';
// import useRes from '../../../../hook/useRes';
import { SimpleProgressBar } from '../../../../component/ProgressBar';
// import { ScheduleRemainingTime } from '../ScheduleRemainingTime';
// import { ScheduleDuration } from '../ScheduleDuration';
import { useScheduleProgress } from '../../../../hook/useProgress';
import { ErrorMessage, ThumbRatio, ThumbSizes } from '../../../../type/common';
import { Marquee } from '../../../../component/Marquee';
import { atom, useAtomValue } from 'jotai';
// import { LoadThumbnail } from '../LoadThumbnail';
import { Channel, ChannelEpisode } from '../../../../type/linear';
import {
    currentScheduleState,
    findChannelSelector,
} from '../../../../atom/screen';
import { useTranslation } from 'react-i18next';
import { LoadThumbnail } from '../LoadThumbnail';
import { ScheduleRemainingTime } from '../ScheduleRemainingTime';
import { ScheduleDuration } from '../ScheduleDuration';

function EpisodeInfo() {
    const mountRef = useRef(false);
    const { current: isMount } = mountRef;
    const { t } = useTranslation();

    const readInfoAtom = useMemo(() => {
        return atom((get) => {
            const schedule = get(currentScheduleState);
            if (!schedule) return null;

            const channel = get(findChannelSelector(schedule));
            return !channel ? null : { schedule, channel };
        });
    }, []);
    const info = useAtomValue(readInfoAtom);

    useEffect(() => {
        if (!isMount) {
            mountRef.current = true;
        }
    }, []);

    const content = info ? (
        <Info info={info} />
    ) : !isMount ? (
        <InfoLoading />
    ) : (
        <InfoLoading message={t(ErrorMessage.NO_DATA_AVAILABLE)} />
    );

    return (
        <Container>
            <RightTopLogo />
            {content}
        </Container>
    );
}
export default EpisodeInfo;

function Info({
    info,
}: {
    info: { schedule: ChannelEpisode; channel: Channel };
}) {
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
                    <span>
                        {t('guide_episode_info_channel_number', {
                            no: channel?.no,
                        })}
                    </span>
                    <span>{channel?.title}</span>
                </ChannelInfo>
                <>
                    <Title
                        delay={2}
                        text={schedule?.title ?? ''}
                        enabled={info === deferredValue}
                        animationStyle='oneWayReset'
                    />
                    <Description id={'ep-desc'}>
                        {schedule.description}
                    </Description>
                    <Time schedule={deferredValue.schedule} />
                </>
            </Detail>
        </InfoContainer>
    );
}

function Time({ schedule }: { schedule: ChannelEpisode }) {
    const { value, maxValue, remainingValue, timeRange } =
        useScheduleProgress(schedule);

    const isOnAir = useMemo(() => {
        const current = Date.now();
        const start = timeRange.start;
        const end = timeRange.end;
        return current >= start && current <= end;
    }, [timeRange]);

    return (
        <TimeContainer id={'ep-time'}>
            {isOnAir ? (
                <>
                    <ProgressBar value={value} max={maxValue} />
                    <TimeLeft leftMillis={remainingValue} />
                </>
            ) : (
                <Duration range={timeRange} />
            )}
        </TimeContainer>
    );
}

const Container = styled.div`
    position: relative;
    margin: 80rem 64rem 54rem 64rem;
`;

const RightTopLogo = styled(Logo)`
    position: absolute;
    right: 0;
    width: 154rem;
    height: 56rem;
    opacity: 0.7;
`;

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

const TimeContainer = styled.div`
    display: flex;
    margin-top: 16rem;
    align-items: center;
`;

const ProgressBar = styled(SimpleProgressBar)`
    width: 320rem;
`;

const TimeLeft = styled(ScheduleRemainingTime)`
    margin-left: 16rem;
`;

const Duration = styled(ScheduleDuration)`
    font-size: 24rem;
    color: ${({ theme }) => theme.colors.whiteAlpha89};
`;

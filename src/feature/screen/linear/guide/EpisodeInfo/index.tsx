import { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { atom, useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import Logo from '@/component/Logo';
import { EpisodeInfoLoader as InfoLoading } from '@/feature/screen/linear/guide/EpisodeInfoLoader';
import Info from '@/feature/screen/linear/guide/EpisodeInfo/Info';
import { currentScheduleState, findChannelSelector } from '@/atom/screen';
import { ErrorMessage } from '@/type/common';

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

const Container = styled.div`
    position: relative;
    margin: 80rem 64rem 54rem 64rem;
`;

const RightTopLogo = styled(Logo)`
    position: absolute;
    right: 0;
    width: 140rem;
    height: 48rem;
    opacity: 0.7;
`;

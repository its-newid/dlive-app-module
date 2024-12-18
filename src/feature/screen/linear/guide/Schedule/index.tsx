import React, { useLayoutEffect, Suspense, useEffect } from 'react';
import styled from 'styled-components';
import { useSetAtom } from 'jotai';
import { Nav } from '@/feature/screen/linear/guide/Nav';
// import { CategoryBar } from '@/feature/screen/linear/guide/CategoryBar';
import {
    currentScheduleFocusState,
    LiveScreenOverlayType,
    openingMillisState,
    ScheduleFocusState,
} from '@/atom/screen/linear';

import { ESCAPE } from '@/util/eventKey';
import { Timeline as Header } from '@/feature/screen/linear/guide/Schedule/Timeline';
import { Indicator } from '@/feature/screen/linear/guide/Schedule/Indicator';
import { ListingsLoader } from '@/feature/screen/linear/guide/ListingsLoader';
import { floorToNearest30Minutes } from '../../hook/useTimeline';
import useOverlay from '../../hook/useOverlay';
const Listings = React.lazy(
    () => import('@/feature/screen/linear/guide/Listings'),
);

const Schedule = () => {
    const setOpeningMillis = useSetAtom(openingMillisState);
    const setScheduleFocus = useSetAtom(currentScheduleFocusState);
    const { showOverlay } = useOverlay();

    useLayoutEffect(() => {
        setOpeningMillis(floorToNearest30Minutes().getTime());
        return () => setScheduleFocus(ScheduleFocusState.LISTINGS);
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            event.preventDefault();

            if (event.keyCode === ESCAPE) {
                event.stopPropagation();
                showOverlay({ type: LiveScreenOverlayType.CHANNEL_BANNER });
            } else {
                showOverlay({
                    type: LiveScreenOverlayType.GUIDE,
                    needDelay: true,
                });
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <Container>
            <Header />
            <Main />
        </Container>
    );
};

export default Schedule;

const Main = () => {
    return (
        <MainContainer>
            <Shadow />
            <Nav />
            {/* <CategoryBar /> */}
            <Suspense fallback={<ListingsLoader />}>
                <Listings />
                <Indicator />
            </Suspense>
        </MainContainer>
    );
};

const Container = styled.div`
    background: ${({ theme }) => theme.colors.grey90};
    height: calc(100% - 386rem);
`;

const MainContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
`;

const Shadow = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 40rem;
    background: linear-gradient(
        180deg,
        ${({ theme }) => theme.colors.grey90},
        rgba(28, 28, 28, 0)
    );
    z-index: 1;
`;

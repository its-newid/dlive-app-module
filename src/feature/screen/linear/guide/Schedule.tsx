import React, { useLayoutEffect, Suspense, useEffect } from 'react';
import styled from 'styled-components';
import { floorToNearest30Minutes } from '../hook/useTimeline';
import { useSetAtom } from 'jotai';
import {
    currentScheduleFocusState,
    LiveScreenOverlayType,
    openingMillisState,
    ScheduleFocusState,
} from '@/atom/screen/linear';
import useOverlay from '../hook/useOverlay';
import { ESCAPE } from '@/util/eventKey';
import { Indicator, Timeline as Header } from './Timeline';
import { ListingsLoader } from './ListingsLoader';
import { Nav } from './Nav';
const Listings = React.lazy(() => import('./Listings'));

function Schedule() {
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
}
export default Schedule;

function Main() {
    return (
        <MainContainer>
            <Nav />
            <Suspense fallback={<ListingsLoader />}>
                <Listings />
                <Indicator />
            </Suspense>
        </MainContainer>
    );
}

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

    &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 40rem;
        background: linear-gradient(
            180deg,
            ${({ theme }) => theme.colors.grey90},
            rgba(20, 20, 21, 0)
        );
    }
`;

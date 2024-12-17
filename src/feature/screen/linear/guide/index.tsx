import styled from 'styled-components';
// import EpisodeInfo from './EpisodeInfo';
// import Schedule from './Schedule';
import { useAtomValue } from 'jotai';
import {
    liveScreenOverlayState,
    LiveScreenOverlayType,
} from '@/atom/screen/linear';
import EpisodeInfo from '@/feature/screen/linear/guide/EpisodeInfo';

function Guide() {
    const currentOverlay = useAtomValue(liveScreenOverlayState);

    return (
        currentOverlay === LiveScreenOverlayType.GUIDE && (
            <Container>
                <EpisodeInfo />
                {/* <Schedule /> */}
            </Container>
        )
    );
}
export default Guide;

const Container = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2;
`;

import styled from 'styled-components';
import { LoadingBar as StyledLoadingBar } from '../../../../component/LoadingBar';
import { t } from 'i18next';

export function ChannelBannerLoader() {
    return (
        <Container>
            <ChannelTitle />
            <EpisodeName>{t('live_screen_channel_banner_loading')}</EpisodeName>
            <EpisodeDescription />
            <LoadingBar />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    margin-top: 60rem;
    overflow: hidden;
    margin-left: 72rem;
    flex-direction: column;
`;

const ChannelTitle = styled.div`
    min-height: 38rem;
    max-height: 38rem;
`;

const EpisodeName = styled.span`
    height: 66rem;
    color: white;
    margin-top: 8rem;
    font-size: 56rem;
    font-weight: bold;
    line-height: 66rem;
    white-space: nowrap;
`;

const EpisodeDescription = styled.div`
    min-height: 36rem;
    max-height: 36rem;
    margin-top: 4rem;
`;

const LoadingBar = styled(StyledLoadingBar)`
    width: 720rem;
    margin-top: 16rem;
`;

import styled from 'styled-components';
import { LoadingBar as StyledLoadingBar } from '@/component/LoadingBar';
import { t } from 'i18next';

export function MiniBannerLoader() {
    return (
        <>
            <Title>{t('live_screen_mini_banner_loading')}</Title>
            <LoadingBar />
        </>
    );
}

const Title = styled.span`
    color: white;
    font-size: 56rem;
    font-weight: bold;
    line-height: 66rem;
`;

const LoadingBar = styled(StyledLoadingBar)`
    width: 424rem;
    margin-top: 122rem;
`;

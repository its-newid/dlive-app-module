import styled from 'styled-components';
import { Navigate } from 'react-router';
import Banner from '@/feature/screen/linear/banner';
import Guide from '@/feature/screen/linear/guide';
import { useAtomValue } from 'jotai';
import { isFirstLaunchState } from '@/atom/app.ts';
import { RoutePath } from '@/type/routePath.ts';
import LiveScreen from '@/feature/screen/linear';

const LinearLayout = () => {
    // const isFirstLaunch = useAtomValue(isFirstLaunchState);

    // todo 추후 onboarding 페이지 추가시
    //  !isFirstLaunch 에서 isFirstLaunch로 변경 예정

    // if (isFirstLaunch) {
    //     return <Navigate to={RoutePath.ONBOARDING} replace />;
    // }

    return (
        <Container>
            <LiveScreen />
            <Banner />
            <Guide />
        </Container>
    );
};

export default LinearLayout;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.grey90};
`;

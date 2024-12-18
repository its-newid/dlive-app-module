import styled from 'styled-components';
import { Outlet } from 'react-router';
import { theme } from '@/style/theme';
import Banner from '@/feature/screen/linear/banner';
import Guide from '@/feature/screen/linear/guide';
// import { useAtomValue } from 'jotai';
// import { isFirstLaunchState } from '@/atom/app';
// import { RoutePath } from '@/type/routePath';

const LinearLayout = () => {
    // const isFirstLaunch = useAtomValue(isFirstLaunchState);

    // if (isFirstLaunch) {
    //     return <Navigate to={RoutePath.ONBOARDING} replace />;
    // }

    return (
        <Container>
            <Outlet />
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
    background-color: ${theme.colors.grey90};
`;

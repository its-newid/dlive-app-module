import styled from 'styled-components';
import Banner from '@/feature/screen/linear/banner';
import Guide from '@/feature/screen/linear/guide';
import LiveScreen from '@/feature/screen/linear';

const LinearLayout = () => {
    // const isFirstLaunch = useAtomValue(isFirstLaunchState);
    //
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

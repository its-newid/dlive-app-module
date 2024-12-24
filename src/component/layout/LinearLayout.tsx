import Banner from '@/feature/screen/linear/banner';
import Guide from '@/feature/screen/linear/guide';
import LiveScreen from '@/feature/screen/linear/LiveScreen';

const LinearLayout = () => {
    // const isFirstLaunch = useAtomValue(isFirstLaunchState);

    // if (isFirstLaunch) {
    //     return <Navigate to={RoutePath.ONBOARDING} replace />;
    // }

    return (
        <>
            <LiveScreen />
            <Banner />
            <Guide />
        </>
    );
};

export default LinearLayout;

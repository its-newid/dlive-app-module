import { useParams } from 'react-router';

const LiveScreen = () => {
    const { id } = useParams();

    return <h1>LiveScreen {id}</h1>;
};

export default LiveScreen;

import styled from 'styled-components';
import { Skeleton } from '@/component/Skeleton';
import { useItemNumbersInListings } from '../hook/useListingsTable';

export function ListingsLoader() {
    const { itemNumbers, setRef } = useItemNumbersInListings();

    const skeletonImpl = Array.from({ length: itemNumbers }).map((_, index) => {
        const rowImpl = Array.from({ length: 5 }).map((_, index) => (
            <Episode key={index} />
        ));

        return (
            <ChannelRow key={index}>
                <ChannelNumber />
                <ChannelThumbnail />
                {rowImpl}
            </ChannelRow>
        );
    });

    return <Container ref={setRef}>{skeletonImpl}</Container>;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    margin: 40rem 0 32rem 24rem;
`;

const ChannelRow = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 20rem;
`;

const ChannelNumber = styled(Skeleton)`
    width: 118rem;
    height: 90rem;
    margin-right: 10rem;
    border-radius: 16rem;
`;

const ChannelThumbnail = styled(Skeleton)`
    width: 160rem;
    height: 90rem;
    margin-right: 10rem;
    border-radius: 16rem;
`;

const Episode = styled(Skeleton)`
    width: 312rem;
    height: 90rem;
    margin-right: 8rem;
    border-radius: 16rem;
`;

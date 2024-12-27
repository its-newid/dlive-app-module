import styled from 'styled-components';

export function EpisodeInfoLoader({ message }: { message?: string }) {
    return (
        <Container>
            <Thumbnail />
            {message && <Title>{message}</Title>}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

const Thumbnail = styled.div`
    width: 448rem;
    height: 252rem;
    margin-right: 64rem;
    border-radius: 16rem;
    background: ${({ theme }) => theme.colors.grey80};
`;

const Title = styled.span`
    font-size: 48rem;
    font-weight: bold;
    line-height: 56rem;
    color: ${({ theme }) => theme.colors.whiteAlpha95};
`;

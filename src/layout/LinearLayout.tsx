import styled from 'styled-components';
import { Outlet } from 'react-router';

const LinearLayout = () => {
    return (
        <Container>
            <Outlet />
            <h1>LinearLayout</h1>
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
    background-color: #d1ffb8;
`;

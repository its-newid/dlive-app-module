import styled from 'styled-components';
import { ContainerComponent } from './layout';
import { IExtendableStyledComponent } from '@/type/common';

type MenubarLayoutProps = IExtendableStyledComponent & {
    onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
};

function MenubarLayout({
    className,
    children,
    ...rest
}: ContainerComponent<MenubarLayoutProps>) {
    return (
        <Container className={className} {...rest}>
            {children}
        </Container>
    );
}

export default MenubarLayout;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    background-color: transparent;
`;

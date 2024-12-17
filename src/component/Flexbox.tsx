import { IExtendableStyledComponent } from '../type/common';
import React, { ForwardedRef, forwardRef } from 'react';
import styled from 'styled-components';

type Props<T> = IExtendableStyledComponent & {
    items: T[];
    render: (item: T, index: number) => React.ReactNode;
};

function InnerBox<T>(
    { items, render, className, ...rest }: Props<T>,
    ref: ForwardedRef<HTMLDivElement>
) {
    return (
        <Container className={className} ref={ref} {...rest}>
            {items.map((item, index) => render(item, index))}
        </Container>
    );
}

export const Flexbox = forwardRef(InnerBox) as <T>(
    props: Props<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof InnerBox>;

const Container = styled.div.attrs({ tabIndex: 0 })`
    display: flex;
`;

import React, { useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { IExtendableStyledComponent } from '@/type/common';

type FlexboxProps<T> = IExtendableStyledComponent & {
    items: T[];
    render: (item: T, index: number) => React.ReactNode;
    innerRef?: React.Ref<HTMLDivElement>;
};

const Flexbox = <T,>({ items, render, className, innerRef, ...rest }: FlexboxProps<T>) => {
    const localRef = useRef<HTMLDivElement | null>(null);

    // useImperativeHandle을 사용하여 외부에서 ref 접근 가능하도록 설정
    useImperativeHandle(innerRef, () => localRef.current as HTMLDivElement, [localRef]);

    return (
        <Container className={className} ref={localRef} {...rest}>
            {items.map((item, index) => render(item, index))}
        </Container>
    );
};

const Container = styled.div.attrs({
    tabIndex: 0,
    role: 'list' // 접근성을 위한 role 추가
})`
    display: flex;
`;

export default Flexbox;

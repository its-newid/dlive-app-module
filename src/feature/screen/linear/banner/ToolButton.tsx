import React, { ForwardedRef, forwardRef } from 'react';
import Clickable, { ClickableProps } from '@/component/Clickable';
import styled, { css } from 'styled-components';

export const ButtonType = {
    ICON_ONLY: 'onlyIcon',
    TEXT_ONLY: 'onlyText',
    BOTH: 'both',
} as const;
export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];

export type Child = {
    type: ButtonType;
    elements: React.ReactNode;
};

type Props = ClickableProps & {
    item: Child;
};

export const ToolButton = forwardRef<HTMLDivElement, Props>(function Button(
    { item, ...rest }: Props,
    ref: ForwardedRef<HTMLDivElement>,
) {
    return (
        <StyledButton type={item.type} {...rest} ref={ref}>
            {item.elements}
        </StyledButton>
    );
});

const toolButtonStyle = {
    [ButtonType.ICON_ONLY]: css`
        padding: 12rem;
    `,
    [ButtonType.TEXT_ONLY]: css`
        padding: 14rem 30rem;
    `,
    [ButtonType.BOTH]: css`
        padding: 12rem 30rem 12rem 20rem;
    `,
};

const StyledButton = styled(Clickable)<{ type: ButtonType }>`
    display: flex;
    line-height: 44rem;
    font-weight: bold;
    flex-direction: row;
    align-items: center;
    border-radius: 36rem;
    color: ${({ theme }) => theme.colors.whiteAlpha95};
    font-family: ${({ theme }) => theme.fonts.family.pretendard};
    ${({ type }) => toolButtonStyle[type]};

    svg {
        color: ${({ theme }) => theme.colors.grey10};
        width: 48rem;
        height: 48rem;
    }
    svg:not(:only-child) {
        margin-right: 12rem;
    }

    span {
        font-size: 36rem;
    }

    &:hover:not(:focus) {
        outline: none;
        background: ${({ theme }) => theme.colors.grey50};
    }
    &:focus {
        outline: none;
        color: ${({ theme }) => theme.colors.grey90};
        background: ${({ theme }) => theme.colors.main};
        svg {
            color: ${({ theme }) => theme.colors.grey90};
        }
    }
`;

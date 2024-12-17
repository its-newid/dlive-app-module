import { IExtendableStyledComponent } from '@/type/common';
import Clickable, { ClickableProps } from './Clickable';
import { ForwardedRef, forwardRef } from 'react';
import useRes from '@/hook/useRes';
import { R } from '@/lang/resoureces';
import styled from 'styled-components';

type AgreeButtonProps = IExtendableStyledComponent & ClickableProps;

export const AgreeButton = forwardRef<HTMLDivElement, AgreeButtonProps>(function AgreeButton(
    { className, ...rest }: AgreeButtonProps,
    ref: ForwardedRef<HTMLDivElement>
) {
    const setLang = useRes();

    return (
        <Container className={className} {...rest} ref={ref}>
            <span id={'agree-btn'}>{setLang(R.id.onboarding_agree)}</span>
        </Container>
    );
});

const Container = styled(Clickable)`
    width: fit-content;
    border-radius: 37rem;
    background-color: ${({ theme }) => theme.colors.grey10};

    :hover {
        background-color: ${({ theme }) => theme.colors.main};
    }
    :focus {
        background-color: ${({ theme }) => theme.colors.main};
    }

    span {
        font-size: 38rem;
        font-weight: ${({ theme }) => theme.fonts.weight.bold};
        color: ${({ theme }) => theme.colors.grey90};
    }
`;

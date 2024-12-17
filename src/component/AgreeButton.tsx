import { IExtendableStyledComponent } from '@/type/common';
import Clickable, { ClickableProps } from './Clickable';
import { ForwardedRef, forwardRef } from 'react';
import styled from 'styled-components';
import { t } from 'i18next';

type AgreeButtonProps = IExtendableStyledComponent & ClickableProps;

export const AgreeButton = forwardRef<HTMLDivElement, AgreeButtonProps>(
    function AgreeButton(
        { className, ...rest }: AgreeButtonProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) {
        return (
            <Container className={className} {...rest} ref={ref}>
                <span id={'agree-btn'}>{t('onboarding_agree')}</span>
            </Container>
        );
    },
);

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

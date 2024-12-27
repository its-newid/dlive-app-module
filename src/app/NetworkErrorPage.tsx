import { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ENTER, ESCAPE, LEFT, onDefaultUIEvent, RIGHT } from '@/util/eventKey';
import { Optional } from '@/type/common';
import { t } from 'i18next';
import { closeApp } from '@/util/closeApp.ts';
import { userAgent } from '@/util/userAgent';

export const Menu = {
    HOME: 0,
    EXIT: 1,
} as const;

export function NetworkErrorPage({ onConnected }: { onConnected: () => void }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [currentFocus, setCurrentFocus] = useState<number>(Menu.EXIT);
    const buttonRefs: RefObject<Optional<HTMLElement | null>>[] = [
        useRef(null),
        useRef(null),
    ];

    const handleGoHome = () => {
        if (!isOnline) return;
        setCurrentFocus(Menu.HOME);
        onConnected();
    };
    const handleExit = () => closeApp(userAgent.type);

    const handleEscapeKeyDown = (event: React.KeyboardEvent) => {
        event.keyCode === ESCAPE && handleExit();
    };

    const handleExitButtonKeyDown = (event: React.KeyboardEvent) => {
        const { keyCode } = event;

        if (keyCode === RIGHT) {
            isOnline && setCurrentFocus(Menu.HOME);
        }

        if (keyCode === ENTER) {
            event.stopPropagation();
            handleExit();
        }
    };

    const handleHomeButtonKeyDown = (event: React.KeyboardEvent) => {
        const { keyCode } = event;

        if (keyCode === LEFT) {
            setCurrentFocus(Menu.EXIT);
        }

        if (keyCode === ENTER) {
            event.stopPropagation();
            handleGoHome();
        }
    };

    useEffect(() => {
        const handleStatusChange = () => setIsOnline(true);
        window.addEventListener('online', handleStatusChange);
        return () => window.removeEventListener('online', handleStatusChange);
    }, [isOnline]);

    useEffect(() => {
        buttonRefs[currentFocus].current?.focus({ preventScroll: true });
    }, [currentFocus]);

    return (
        <Container onKeyDown={onDefaultUIEvent(handleEscapeKeyDown)}>
            <Column
                aria-live={'polite'}
                aria-labelledby={`title desc btn-${currentFocus}`}
            >
                <Title id={'title'}>{t('network_error_title')}</Title>
                <Description id={'desc'}>
                    {t('network_error_description')}
                </Description>
                <Row>
                    <Button
                        role={'button'}
                        onKeyDown={onDefaultUIEvent(handleExitButtonKeyDown)}
                        onClick={handleExit}
                        enabled
                        ref={(node) => {
                            if (node) {
                                buttonRefs[Menu.EXIT].current = node;
                            }
                        }}
                    >
                        <span id={'btn-0'}>{t('network_error_exit')}</span>
                    </Button>
                    <Button
                        role={'button'}
                        enabled={isOnline}
                        onKeyDown={onDefaultUIEvent(handleHomeButtonKeyDown)}
                        onClick={handleGoHome}
                        ref={(node) => {
                            if (node) {
                                buttonRefs[Menu.HOME].current = node;
                            }
                        }}
                    >
                        <span id={'btn-1'}>{t('network_error_back')}</span>
                    </Button>
                </Row>
            </Column>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: ${({ theme }) => theme.colors.grey90};
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.span`
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 76rem/96rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha95};
`;

const Description = styled.span`
    margin-top: 24rem;
    font: ${({ theme }) =>
        `${theme.fonts.weight.normal} 36rem/44rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha64};
    white-space: pre-wrap;
`;

const Row = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const Button = styled.div.attrs({ tabIndex: 0 })<{
    enabled: boolean;
}>`
    margin-top: 162rem;
    width: fit-content;
    border-radius: 36rem;
    outline: none;
    padding: 14rem 30rem;

    &:first-child {
        margin-right: 24rem;
    }

    > span {
        text-align: center;
        height: 44rem;
        font: ${({ theme }) =>
            `${theme.fonts.weight.bold} 36rem/44rem ${theme.fonts.family.pretendard}`};
        color: ${({ theme, enabled }) =>
            enabled ? theme.colors.whiteAlpha95 : theme.colors.whiteAlpha50};
    }

    &:focus {
        > span {
            color: ${({ theme }) => theme.colors.grey90};
        }

        background: ${({ theme }) => theme.colors.main};
    }

    &:hover:not(:focus) {
        > span {
            color: ${({ theme, enabled }) =>
                enabled && theme.colors.whiteAlpha95};
        }

        background-color: ${({ theme, enabled }) =>
            enabled && theme.colors.grey50};
    }
`;

import { useCallback } from 'react';
import styled from 'styled-components';
import { ENTER, onDefaultUIEvent } from '@/util/eventKey';
import { t } from 'i18next';

export function ErrorPage() {
    const handleExit = () => window.close();

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const { keyCode } = event;

        if (keyCode === ENTER) {
            event.stopPropagation();
            handleExit();
        }
    };

    const callbackRef = useCallback((node: HTMLDivElement) => {
        if (node) {
            node.focus();
        }
    }, []);

    return (
        <Container>
            <Column>
                <Title id={'desc'}>{t('app_query_error_message')}</Title>
                <Row>
                    <Button
                        role={'button'}
                        aria-labelledby={'desc btn-title'}
                        onKeyDown={onDefaultUIEvent(handleKeyDown)}
                        onClick={handleExit}
                        ref={callbackRef}
                    >
                        <span id={'btn-title'}>{t('network_error_exit')}</span>
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
    padding: 0 384rem;
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

    :after {
        content: ' :(';
        color: ${({ theme }) => theme.colors.main};
    }
`;

const Row = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Button = styled.div.attrs({ tabIndex: 0 })`
    margin-top: 178rem;
    width: fit-content;
    border-radius: 36rem;
    outline: none;
    padding: 14rem 30rem;

    :first-child {
        margin-right: 24rem;
    }

    > span {
        text-align: center;
        font: ${({ theme }) =>
            `${theme.fonts.weight.bold} 36rem/44rem ${theme.fonts.family.pretendard}`};
        color: ${({ theme }) => theme.colors.whiteAlpha95};
    }

    :focus {
        > span {
            color: ${({ theme }) => theme.colors.grey90};
        }

        background: ${({ theme }) => theme.colors.main};
    }

    :hover:not(:focus) {
        > span {
            color: ${({ theme }) => theme.colors.whiteAlpha95};
        }

        background-color: ${({ theme }) => theme.colors.grey50};
    }
`;

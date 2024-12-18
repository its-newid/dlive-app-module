import { useCallback } from 'react';
import { Nullable } from '@/type/common';
import { ENTER } from '@/util/eventKey';
import PlayIcon from '@/asset/icPlay.svg?react';
import styled from 'styled-components';

export function PlayOverlay({ onPlay }: { onPlay: () => void }) {
    const callbackRef = useCallback((node: Nullable<HTMLElement>) => {
        if (node) {
            node?.focus();
        }
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        event.preventDefault();

        if (event.keyCode === ENTER) {
            onPlay();
        }
    };

    return (
        <Container onClick={onPlay}>
            <Button onKeyDown={handleKeyDown} ref={callbackRef}>
                <PlayIcon />
            </Button>
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const Button = styled.div.attrs({ tabIndex: 0 })`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: fit-content;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 48rem;
    outline: none;

    svg {
        width: 64rem;
        height: 64rem;
        padding: 16rem;
        color: ${({ theme }) => theme.colors.grey10};
    }
`;

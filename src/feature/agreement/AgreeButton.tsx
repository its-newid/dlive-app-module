import { useCallback, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import styled from 'styled-components';
import { AgreeButton as StyledAgreeButton } from '@/component/AgreeButton';
import { LEFT, UP } from '@/util/eventKey';
import { usePrevious } from '@/hook/usePrevious';
import { KeyboardEventListener } from '@/type/common';
import { AgreementFocusState, currentFocusState } from '@/atom/onboarding';
import { isToastVisibleState } from '@/atom/screen/linear';

export default function AgreeButton({ onAgree }: { onAgree: () => void }) {
    const [currentFocus, setCurrentFocus] = useAtom(currentFocusState);
    const prevFocus = usePrevious(currentFocus, () => !enabled);
    const isToastVisible = useAtomValue(isToastVisibleState);

    const enabled = useMemo(
        () => currentFocus === AgreementFocusState.AGREE,
        [currentFocus],
    );

    const agreeRef = useCallback(
        (node: HTMLDivElement) => {
            if (isToastVisible) {
                node?.blur();
            } else {
                enabled && node?.focus();
            }
        },
        [enabled, isToastVisible],
    );

    const handleArrowKeyDown: KeyboardEventListener = (event) => {
        switch (event.keyCode) {
            case UP:
                setCurrentFocus(prevFocus);
                break;
            case LEFT:
                setCurrentFocus(AgreementFocusState.MENU);
                break;
        }
    };

    return (
        <Button
            onClick={onAgree}
            onArrowKeyDown={handleArrowKeyDown}
            isToastVisible={isToastVisible}
            ref={agreeRef}
        />
    );
}

const Button = styled(StyledAgreeButton)<{ isToastVisible: boolean }>`
    width: 100%;
    padding: 14rem 0;
    margin-top: 64rem;
    background-color: ${({ theme, isToastVisible }) =>
        isToastVisible ? '#3c3c3d' : theme.colors.grey10};

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${({ theme, isToastVisible }) =>
            isToastVisible ? theme.colors.whiteAlpha25 : theme.colors.grey90};
    }

    :hover:not(:focus) {
        background-color: ${({ theme }) => theme.colors.grey50};

        span {
            color: ${({ theme }) => theme.colors.whiteAlpha95};
        }
    }

    :focus {
        background-color: ${({ theme }) => theme.colors.main};
    }
`;

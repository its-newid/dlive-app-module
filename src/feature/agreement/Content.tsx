import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import styled from 'styled-components';
import { DOWN, LEFT } from '@/util/eventKey';
import { KeyboardEventListener } from '@/type/common';
import {
    AgreementFocusState,
    currentFocusState,
    currentSelectedItemState,
} from '@/atom/onboarding';
import AgreeButton from './AgreeButton';
import { LegalContent } from './LegalContent';
import legal from '../../../legal.json';

function Content({ onAgree }: { onAgree: () => void }) {
    const [isReachedBottom, setIsReachedBottom] = useState(false);
    const setFocus = useSetAtom(currentFocusState);
    const selectedMenu = useAtomValue(currentSelectedItemState);

    const handleKeyDown: KeyboardEventListener = (event) => {
        event.preventDefault();

        const { keyCode } = event;

        if (keyCode === DOWN) {
            isReachedBottom && setFocus(AgreementFocusState.AGREE);
        }

        if (keyCode === LEFT) {
            setFocus(AgreementFocusState.MENU);
        }
    };

    const legalComponent = Object.entries(legal).map(([title, data], index) => (
        <LegalContent
            key={index}
            title={title}
            content={data.content}
            setIsReachedBottom={setIsReachedBottom}
        />
    ));

    return (
        <Container onKeyDown={handleKeyDown}>
            {legalComponent}
            {selectedMenu && <AgreeButton onAgree={onAgree} />}
        </Container>
    );
}

export default Content;

const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 1248rem;
    margin: 124rem 96rem 96rem 58rem;
`;

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FocusableAndScrollableContent } from '../../component/FocusableAndScrollableContent';
import { useAtom, useAtomValue } from 'jotai';
import { ScrollInfo } from '../../component/ScrollableContent';
import {
    AgreementFocusState,
    canContentFocusState,
    currentFocusState,
    currentSelectedItemState,
} from '@/atom/onboarding';
import { t } from 'i18next';

type LegalContentProps = {
    title: string;
    content: string;
    setIsReachedBottom: (isReachedBottom: boolean) => void;
};

export function LegalContent({
    title,
    content,
    setIsReachedBottom,
}: LegalContentProps) {
    const [scrollOffset, setScrollOffset] = useState<number>(0);
    const [currentFocus, setFocus] = useAtom(currentFocusState);
    const [canContentFocus, setCanContentFocus] = useAtom(canContentFocusState);
    const selectedMenu = useAtomValue(currentSelectedItemState);

    const isVisible = selectedMenu?.type === title;
    const enabled = currentFocus === AgreementFocusState.CONTENT;

    const handleScroll = (info: ScrollInfo) => {
        const { scrollTop, scrollHeight, clientHeight } = info;
        const hasScrollReachedBottom =
            Math.floor(scrollHeight - scrollTop) <= clientHeight;
        setIsReachedBottom(hasScrollReachedBottom);
    };

    const handleMouseDown = () => {
        if (canContentFocus) {
            !enabled && setFocus(AgreementFocusState.CONTENT);
        }
    };

    useEffect(() => {
        selectedMenu && setIsReachedBottom(false);
    }, [selectedMenu]);

    return (
        <>
            {isVisible && (
                <Container onMouseDown={handleMouseDown} enabled={enabled}>
                    <Title id={'title'}>{t(`${selectedMenu?.title}`)}</Title>
                    <Description
                        content={content}
                        $enabled={enabled}
                        onFocusable={setCanContentFocus}
                        scrollOffset={scrollOffset}
                        setScrollOffset={setScrollOffset}
                        onScroll={handleScroll}
                    />
                </Container>
            )}
        </>
    );
}

const Container = styled.div<{ enabled: boolean }>`
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 272rem);

    :hover > {
        .scrollable-div:not(:focus) {
            ::-webkit-scrollbar-thumb {
                background-color: ${({ theme }) => theme.colors.grey10};
            }
        }
    }

    .scrollable-div {
        pointer-events: ${({ enabled }) => (enabled ? 'auto' : 'none')};
    }
`;

const Title = styled.span`
    width: 100%;
    padding-top: 40rem;
    padding-bottom: 64rem;
    font-size: 48rem;
    color: ${({ theme }) => theme.colors.whiteAlpha95};
    font-weight: ${({ theme }) => theme.fonts.weight.bold};
`;

const Description = styled(FocusableAndScrollableContent)`
    height: 558rem;
`;

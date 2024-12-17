import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import MenubarLayout from '@/component/layout/Menubar';
import { Logo } from '@/component/Logo';
import Clickable from '@/component/Clickable';
import { KeyboardEventListener, Selectable } from '@/type/common';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { DOWN, RIGHT, UP } from '@/util/eventKey';
import { coerceIn } from '@/util/common';
import {
    AgreementFocusState,
    canContentFocusState,
    currentFocusState,
    currentSelectedItemState,
    TLegalMenuItem,
} from '@/atom/onboarding';
import { isToastVisibleState } from '@/atom/screen/linear';
import { t } from 'i18next';

function Menubar({ list }: { list: TLegalMenuItem[] }) {
    const [selectedItem, setSelectedItem] = useAtom(currentSelectedItemState);
    const [currentFocus, setCurrentFocus] = useAtom(currentFocusState);
    const canContentFocus = useAtomValue(canContentFocusState);
    const isToastVisible = useAtomValue(isToastVisibleState);

    const enabled = useMemo(
        () => currentFocus === AgreementFocusState.MENU,
        [currentFocus],
    );

    const menuRef = useRef(new Map<TLegalMenuItem, HTMLDivElement>());

    const items = list.map((item) => {
        return (
            <MenuItem
                key={item.type}
                item={item}
                ref={(node) => {
                    if (node) {
                        menuRef.current.set(item, node);
                    }
                }}
            />
        );
    });

    const changeSelectedItem = (index: number) => {
        const targetIndex = coerceIn(index, 0, list.length - 1);
        setSelectedItem(list[targetIndex]);
    };

    const handleKeyDown: KeyboardEventListener = (event) => {
        event.preventDefault();

        if (!selectedItem) return;

        const currentIndex = list.findIndex((item) => item === selectedItem);

        switch (event.keyCode) {
            case UP:
                changeSelectedItem(currentIndex - 1);
                break;
            case DOWN:
                if (currentIndex === list.length - 1) {
                    setCurrentFocus(AgreementFocusState.AGREE);
                    return;
                }
                changeSelectedItem(currentIndex + 1);
                break;

            case RIGHT:
                setCurrentFocus(
                    canContentFocus
                        ? AgreementFocusState.CONTENT
                        : AgreementFocusState.AGREE,
                );
                break;
        }
    };

    useEffect(() => {
        if (!enabled || !selectedItem) {
            return;
        }
        if (isToastVisible) {
            isToastVisible && menuRef.current.get(selectedItem)?.blur();
        } else {
            enabled && menuRef.current.get(selectedItem)?.focus();
        }
    }, [enabled, selectedItem, isToastVisible]);

    useEffect(() => {
        if (currentFocus !== AgreementFocusState.MENU) {
            return;
        }

        function handleWheel(event: WheelEvent) {
            const currentIndex = list.findIndex(
                (item) => item === selectedItem,
            );
            const delta = event.deltaY < 0 ? -1 : 1;
            changeSelectedItem(currentIndex + delta);
        }

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [currentFocus, selectedItem]);

    return (
        <Container onKeyDown={handleKeyDown}>
            <Header />
            <Menu>{items}</Menu>
        </Container>
    );
}
export default Menubar;

type MenuItemProps = {
    item: TLegalMenuItem;
};

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
    ({ item }: MenuItemProps, ref) => {
        const [currentItem, setCurrentItem] = useAtom(currentSelectedItemState);
        const setCurrentFocus = useSetAtom(currentFocusState);

        const isSelected = useMemo(() => item === currentItem, [currentItem]);

        const handleClick = () => {
            setCurrentFocus(AgreementFocusState.MENU);
            setCurrentItem(item);
        };

        return (
            <Item selected={isSelected} onClick={handleClick} ref={ref}>
                <ItemText>{t(`${item.title}`)}</ItemText>
            </Item>
        );
    },
);
MenuItem.displayName = 'MenuItem';

const Container = styled(MenubarLayout)`
    width: 536rem;
`;

const Header = styled(Logo)`
    width: 197rem;
    height: 72rem;
    margin-top: 168rem;
    margin-left: 128rem;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 64rem;
    margin-left: 96rem;
    width: max-content;
    max-width: 442rem;
`;

const Item = styled(Clickable)<Selectable>`
    display: flex;
    padding: 14rem 30rem;
    background: ${({ theme, selected }) =>
        selected ? theme.colors.grey70 : theme.colors.transparent};
    border-radius: 41rem;
    outline: none;
    color: ${({ theme }) => theme.colors.whiteAlpha95};

    :focus {
        background: ${({ theme }) => theme.colors.main};
        color: ${({ theme }) => theme.colors.grey90};
    }

    :hover:not(:focus) {
        background: ${({ theme }) => theme.colors.grey50};
    }

    :not(:last-child) {
        margin-bottom: 16rem;
    }
`;

const ItemText = styled.span`
    font-size: 38rem;
    font-weight: ${({ theme }) => theme.fonts.weight.bold};
    line-height: 44rem;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

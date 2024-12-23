import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import {
    selectedScheduleCategoryIdxState,
    currentScheduleFocusState,
    scheduleCategories,
    ScheduleCategory,
    ScheduleFocusState,
    LiveScreenOverlayType,
} from '@/atom/screen/linear';
import { ENTER, LEFT, onDefaultUIEvent, RIGHT } from '@/util/eventKey';
import { Flexbox } from '@/component/Flexbox';
import useOverlay from '@/feature/screen/linear/hook/useOverlay';
import { selectedChannelSelector, totalChannelState } from '@/atom/screen';
import { Selectable } from '@/type/common';
import { MyListCategory } from '@/type/category';
import { SingleLineEllipsis } from '@/component/SingleLineEllipsis';
import { useFlexBox } from '@/hook/useFlexBox';

export function CategoryBar() {
    const { t } = useTranslation();
    const { showOverlay } = useOverlay();

    const channelsAtom = useMemo(() => {
        return atom((get) =>
            Array.from(get(totalChannelState).values()).flat(),
        );
    }, []);
    const channels = useAtomValue(channelsAtom);

    const [currentScheduleFocus, setScheduleFocus] = useAtom(
        currentScheduleFocusState,
    );
    const categories = useAtomValue(scheduleCategories);
    const selectedCategoryIdx = useAtomValue(selectedScheduleCategoryIdxState);
    const writeChannel = useSetAtom(selectedChannelSelector);

    const isFocused = useMemo(
        () => currentScheduleFocus === ScheduleFocusState.CATEGORY,
        [currentScheduleFocus],
    );

    const { setBoxRef, getSelectedItemIndex, selectItem } = useFlexBox({
        items: categories,
        enabled: isFocused,
    });

    useEffect(() => {
        const selectedItemIndex = getSelectedItemIndex();
        const focusIndex = categories.findIndex(
            (category) => category.idx === selectedCategoryIdx,
        );

        if (selectedItemIndex !== focusIndex) {
            selectItem({ by: focusIndex, isAnimate: false });
        }
    }, [selectedCategoryIdx, isFocused]);

    const changeCategory = (item: ScheduleCategory) => {
        const channel = channels.find(
            (channel) => channel.categoryIdx === item.idx,
        );
        channel && writeChannel(channel);
    };

    const renderItem = (item: ScheduleCategory) => {
        const handleClick = () => {
            showOverlay({
                type: LiveScreenOverlayType.GUIDE,
                needDelay: true,
            });
            changeCategory(item);
            !isFocused && setScheduleFocus(ScheduleFocusState.CATEGORY);
        };

        const handleKeyDown = (event: React.KeyboardEvent) => {
            const { keyCode } = event;

            if (keyCode === LEFT) {
                setScheduleFocus(ScheduleFocusState.NAV);
            }

            if (keyCode === RIGHT) {
                setScheduleFocus(ScheduleFocusState.LISTINGS);
            }

            if (keyCode === ENTER) {
                event.stopPropagation();
                changeCategory(item);
            }
        };

        const name = item.idx !== MyListCategory.idx ? item.name : t('My List');

        return (
            <Category
                key={item.idx}
                onClick={onDefaultUIEvent(handleClick)}
                onKeyDown={onDefaultUIEvent(handleKeyDown)}
                selected={selectedCategoryIdx === item.idx}
                role={'button'}
                aria-labelledby={
                    selectedCategoryIdx === item.idx
                        ? `list category-${item.idx}`
                        : ''
                }
            >
                <Title id={`category-${item.idx}`}>{name}</Title>
            </Category>
        );
    };

    return (
        <Container id={'list'} aria-label={'category'}>
            <List items={categories} render={renderItem} ref={setBoxRef} />
        </Container>
    );
}

const Container = styled.div`
    width: 282rem;
    min-width: 282rem;
    height: 100%;
    padding-left: 31rem;
    padding-right: 31rem;
    overflow-y: hidden;
    box-sizing: content-box;
    background: ${({ theme }) => theme.colors.grey90};
`;

const List = styled(Flexbox<ScheduleCategory>)`
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 60rem 0;
`;

const Category = styled.div.attrs({ tabIndex: 0 })<Selectable>`
    display: flex;
    padding: 14rem 28rem;
    margin-bottom: 20rem;
    border-radius: 37rem;
    background: ${({ theme, selected }) =>
        selected ? theme.colors.grey70 : theme.colors.transparent};

    :hover:not(:focus) {
        outline: none;
        background: ${({ theme }) => theme.colors.grey50};
    }
    :focus {
        outline: none;
        background: ${({ theme }) => theme.colors.main};
    }
`;

const Title = styled(SingleLineEllipsis)`
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 30rem/38rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha95};

    ${Category}:focus & {
        color: ${({ theme }) => theme.colors.grey90};
    }
`;

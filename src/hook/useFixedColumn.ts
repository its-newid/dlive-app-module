import { RefObject, useCallback, useLayoutEffect, useRef } from 'react';
import { CustomKeyboardEvent, FlexDirection, Nullable, Optional } from '@/type/common';
import { coerceIn, isItemEmpty } from '@/util/common';
import { DOWN, ENTER, UP } from '@/util/eventKey';
import { containTabIndex, getChildrenOfElement } from '@/util/getChildrenOfElement';
import { makeKeyboardEvent } from '@/util/makeKeyboardEvent';
import { ElementStyle } from '@/hook/useFlexBox';
import { getElementStyle } from '@/util/getElementStyle';
import { getTransformMatrixValues } from '@/util/getTransformMaxrixValues';

type Props<T> = {
    items: T[];
    enabled: boolean;
    onClick: (item: T) => void;
    onFocus?: (item: T) => void;
    selectedIndex: number;
    rowsInNumber: Optional<number>;
};

type SelectItemProps = {
    by: number | HTMLElement;
    isAnimate?: boolean;
};

type Return = {
    selectItem: (props: SelectItemProps) => void;
    getSelectedItemIndex: () => number;
    getItemIndex: (item: HTMLElement) => number;
    setListRef: (node: Nullable<HTMLElement>) => void;
    setFocusRef: (node: Nullable<HTMLDivElement>) => void;
    stateRef: RefObject<State>;
};

export function useFixedColumn<T>({
    items,
    enabled,
    onClick,
    onFocus,
    selectedIndex,
    rowsInNumber
}: Props<T>): Return {
    const containerRef = useRef<Nullable<HTMLElement>>(null);
    const fixedFocusRef = useRef<Nullable<HTMLDivElement>>(null);
    const selectedItemRef = useRef<Nullable<HTMLElement>>(null);
    const stateRef = useRef(defaultState);

    const itemsRef = useRef<T[]>([]);

    const getItemIndex = (item: HTMLElement) => {
        return stateRef.current.list.elements.indexOf(item);
    };

    const getItem = (index: number) => {
        if (!isItemEmpty(stateRef.current.list.elements, index)) {
            return stateRef.current.list.elements[index];
        }
        return null;
    };

    const getSelectedItemIndex = () => {
        const { current: item } = selectedItemRef;
        return item ? getItemIndex(item) : -1;
    };

    const updateOffset = () => {
        if (!selectedItemRef.current || !stateRef.current.itemsInNumber) return;

        const index = getItemIndex(selectedItemRef.current);

        const { height, gap } = stateRef.current.element;
        const borderBox = height + gap;
        const offset = -borderBox * index;

        if (containerRef.current) {
            containerRef.current.style.transform = `translateY(${offset}px)`;
        }
    };

    const selectItem = ({ by }: SelectItemProps) => {
        if (stateRef.current.transitionState.size > 0) return;

        let item: Nullable<HTMLElement>;

        if (typeof by === 'number') {
            item = getItem(by);
        } else {
            item = by;
        }

        selectedItemRef.current = item;
        if (item) {
            const items = itemsRef.current;
            onFocus?.(items[getItemIndex(item)]);
        }
    };

    useLayoutEffect(() => {
        stateRef.current.enabled = enabled;
    }, [enabled]);

    const handleKeyDown = useCallback((event: CustomKeyboardEvent) => {
        event.preventDefault();

        if (!stateRef.current.enabled || !selectedItemRef.current) {
            return;
        }

        const selectedColumnIndex = stateRef.current.list.elements.indexOf(selectedItemRef.current);

        const { keyCode } = event;
        if ([UP, DOWN].includes(keyCode)) {
            const delta = keyCode === UP ? -1 : 1;
            const targetIndex = coerceIn(
                selectedColumnIndex + delta,
                0,
                stateRef.current.list.elements.length - 1
            );

            selectItem({ by: targetIndex });
        }

        if (keyCode === ENTER) {
            const items = itemsRef.current;
            const item = items[selectedColumnIndex];
            onClick(item);
        }
    }, []);

    const handleWheel = useCallback((event: WheelEvent) => {
        if (stateRef.current.enabled) {
            handleKeyDown(makeKeyboardEvent('keydown')(event));
        }
    }, []);

    useLayoutEffect(() => {
        fixedFocusRef.current?.addEventListener('keydown', handleKeyDown);

        if (!enabled || !stateRef.current || !containerRef.current) return;

        const { current: state } = stateRef;
        if (state) {
            state.enabled = enabled;
        }

        return () => {
            fixedFocusRef.current?.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled]);

    const setFocusRef = useCallback(
        (node: Nullable<HTMLDivElement>) => {
            if (!node) return;

            fixedFocusRef.current = node;

            if (enabled) {
                node.focus({ preventScroll: true });
            } else {
                node.blur();
            }
        },
        [enabled]
    );

    const setListRef = useCallback(
        (node: Nullable<HTMLElement>) => {
            if (!items.length || !node || !fixedFocusRef.current || !rowsInNumber) return;

            itemsRef.current = items;
            containerRef.current = node;
            window.addEventListener('wheel', handleWheel, {
                passive: false
            });

            const elements = getChildrenOfElement(node);
            const focusableElements = elements
                .map((child) => {
                    return getChildrenOfElement(child).find((element) => containTabIndex(element));
                })
                .filter((element): element is HTMLElement => element !== undefined);

            const representativeItem = focusableElements?.[0];
            if (!representativeItem) return;

            const elementStyle = getElementStyle(representativeItem, FlexDirection.COLUMN);

            const [translateX, translateY] = getTransformMatrixValues(fixedFocusRef.current);
            const borderWidth =
                (fixedFocusRef.current?.offsetWidth - fixedFocusRef.current?.clientWidth) / 2;

            fixedFocusRef.current.style.cssText = `
            top: ${elementStyle.top + node.offsetTop}px;
            left: ${node.offsetLeft}px;
            width: ${elementStyle.width + (translateX - borderWidth) * 2}px;
            height: ${elementStyle.height + (translateY - borderWidth) * 2}px;
        `;

            stateRef.current = {
                element: elementStyle,
                list: {
                    elements: focusableElements
                },
                enabled,
                transitionState: new Set(),
                itemsInNumber: rowsInNumber
            };

            const selectedItem = focusableElements.find(
                (element) => element === focusableElements[selectedIndex]
            );
            if (!selectedItem) return;

            selectedItemRef.current = selectedItem;

            updateOffset();
        },
        [items, enabled, selectedIndex, rowsInNumber]
    );

    return {
        setListRef,
        setFocusRef,
        selectItem,
        getSelectedItemIndex,
        getItemIndex,
        stateRef
    };
}

type ListStyle = {
    elements: HTMLElement[];
};

type State = {
    element: ElementStyle;
    list: ListStyle;
    enabled: boolean;
    transitionState: Set<HTMLElement>;
    itemsInNumber: Optional<number>;
};

const defaultElementStyle: ElementStyle = {
    width: 0,
    height: 0,
    gap: 0,
    top: 0
};

const defaultListStyle: ListStyle = {
    elements: []
};

const defaultState: State = {
    element: defaultElementStyle,
    list: defaultListStyle,
    enabled: false,
    transitionState: new Set(),
    itemsInNumber: undefined
};

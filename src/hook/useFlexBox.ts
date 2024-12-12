import { useCallback, useLayoutEffect, useRef } from 'react';
import { CustomKeyboardEvent, FlexDirection, Nullable, Optional } from '@/type/common';
import { coerceIn, isItemEmpty } from '@/util/common';
import {
    calculateViewportItemNumbers,
    getFlexDirection
} from '@/util/calculateViewportItemNumbers';
import { DOWN, LEFT, RIGHT, UP } from '@/util/eventKey';
import { getChildrenOfElement } from '@/util/getChildrenOfElement';
import { makeKeyboardEvent } from '@/util/makeKeyboardEvent';
import { getElementStyle } from '@/util/getElementStyle';

type Props<T> = {
    items: T[];
    enabled: boolean;
};

type SelectItemProps = {
    by: number | HTMLElement;
    isAnimate?: boolean;
};

export type OffsetState = {
    value: number;
    isTransition: boolean;
};

type Return = {
    selectItem: (props: SelectItemProps) => void;
    getSelectedItemIndex: () => number;
    setBoxRef: (node: Nullable<HTMLElement>) => void;
};

export function useFlexBox<T>({ items, enabled }: Props<T>): Return {
    const containerRef = useRef<Optional<HTMLElement>>(undefined);
    const selectedItemRef = useRef<Nullable<HTMLElement>>(null);
    const stateRef = useRef(defaultState);

    const getItem = (index: number) => {
        if (!isItemEmpty(stateRef.current.elements, index)) {
            return stateRef.current.elements[index];
        }
        return null;
    };

    const getItemIndex = (item: HTMLElement) => {
        return stateRef.current.elements.indexOf(item);
    };

    const getSelectedItemIndex = () => {
        const { current: item } = selectedItemRef;
        return item ? getItemIndex(item) : -1;
    };

    const getVisibleItemIndex = (): [number, number] => {
        const { current: state } = stateRef;
        if (state.itemsInContainer === 0 || !selectedItemRef.current) {
            return [0, 0];
        }

        const targetIndex = getItemIndex(selectedItemRef.current) + 1 - state.itemsInContainer;
        const firstItemIndex = coerceIn(targetIndex, 0, state.elements.length - 1);
        const lastItemIndex = firstItemIndex + state.itemsInContainer - 1;
        return [firstItemIndex, lastItemIndex];
    };

    const updateTransform = (offset: OffsetState) => {
        if (!containerRef.current) return;

        const { value, isTransition } = offset;
        containerRef.current.style.transition = `${isTransition ? 'transform 300ms' : 'none'}`;
        const isRow = stateRef.current.style.direction === FlexDirection.ROW;
        containerRef.current.style.transform = `translate${isRow ? 'X' : 'Y'}(${value}px)`;
    };

    const selectItem = ({ by, isAnimate = true }: SelectItemProps) => {
        let item: Nullable<HTMLElement>;

        if (typeof by === 'number') {
            item = getItem(by);
        } else {
            item = by;
        }

        if (!item) return;
        selectedItemRef.current = item;

        const { current: state } = stateRef;
        state.enabled && item.focus({ preventScroll: true });

        const [firstItemIndex] = getVisibleItemIndex();
        const offset = calculateTranslateOffset({
            elementStyle: state.style.element,
            index: firstItemIndex,
            direction: state.style.direction
        });
        updateTransform({
            value: offset,
            isTransition: isAnimate
        });
    };

    useLayoutEffect(() => {
        stateRef.current.enabled = enabled;
    }, [enabled]);

    const handleKeyDown = useCallback((event: CustomKeyboardEvent) => {
        event.preventDefault();

        if (!stateRef.current.enabled || !selectedItemRef.current) return;

        const { keyCode } = event;
        const { current: state } = stateRef;

        let delta = 0;
        if (state.style.direction === FlexDirection.ROW) {
            if (keyCode === LEFT || keyCode === RIGHT) {
                delta = keyCode === LEFT ? -1 : 1;
            }
        } else {
            if (keyCode === UP || keyCode === DOWN) {
                delta = keyCode === UP ? -1 : 1;
            }
        }

        const targetIndex = coerceIn(
            getItemIndex(selectedItemRef.current) + delta,
            0,
            state.elements.length - 1
        );

        selectItem({ by: targetIndex });
    }, []);

    const handleWheel = useCallback((event: WheelEvent) => {
        if (stateRef.current.enabled) {
            handleKeyDown(makeKeyboardEvent('keydown')(event));
        }
    }, []);

    const setBoxRef = useCallback(
        (node: Nullable<HTMLElement>) => {
            if (!items.length || !node) return;

            containerRef.current = node;
            node.addEventListener('keydown', handleKeyDown);

            const direction = getFlexDirection(node);
            if (direction === FlexDirection.COLUMN) {
                window.addEventListener('wheel', handleWheel, {
                    passive: false
                });
            }

            const elements = getChildrenOfElement(node);
            const representativeItem = elements[0];
            if (!representativeItem) return;

            const elementStyle = getElementStyle(representativeItem, direction);
            const [firstVisibleItemIndex] = getVisibleItemIndex();
            const itemsInContainer = calculateViewportItemNumbers({
                container: node,
                gap: elementStyle.gap,
                firstVisibleItemIndex,
                direction
            });
            stateRef.current = {
                elements: elements,
                style: {
                    element: elementStyle,
                    direction
                },
                firstVisibleItemIndex,
                itemsInContainer,
                enabled
            };

            const selectedItem = elements.find((element) => element === selectedItemRef.current);

            if (enabled) {
                selectItem({
                    by: selectedItem ?? representativeItem
                });
            }
        },
        [items, enabled]
    );

    return {
        setBoxRef,
        selectItem,
        getSelectedItemIndex
    };
}

export function calculateTranslateOffset({
    elementStyle,
    index,
    direction
}: {
    elementStyle: ElementStyle;
    index: number;
    direction: FlexDirection;
}) {
    const { width, height, gap } = elementStyle;
    const dimension = direction === FlexDirection.ROW ? width : height;
    const borderBox = dimension + gap;
    return -borderBox * index;
}

export type ElementStyle = {
    width: number;
    height: number;
    gap: number;
    top: number;
};

type State = {
    elements: HTMLElement[];
    style: {
        element: ElementStyle;
        direction: FlexDirection;
    };
    firstVisibleItemIndex: number;
    itemsInContainer: number;
    enabled: boolean;
};

const defaultState: State = {
    elements: [],
    style: {
        element: {
            width: 0,
            height: 0,
            gap: 0,
            top: 0
        },
        direction: FlexDirection.ROW
    },
    firstVisibleItemIndex: 0,
    itemsInContainer: 0,
    enabled: false
};

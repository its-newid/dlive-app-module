import {
    CustomKeyboardEvent,
    FlexDirection,
    Nullable,
    Optional,
} from '@/type/common';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { coerceAtLeast, coerceAtMost, coerceIn } from '@/util/common';
import {
    calculateViewportItemNumbers,
    getFlexDirection,
} from '@/util/calculateViewportItemNumbers';
import { DOWN, LEFT, RIGHT, UP } from '@/util/eventKey';
import { getChildrenOfElement } from '@/util/getChildrenOfElement';
import { makeKeyboardEvent } from '@/util/makeKeyboardEvent';
import { ElementStyle, OffsetState } from '@/hook/useFlexBox';

type Props<T> = {
    items: T[];
    enabled: boolean;
};

type SelectItemProps = {
    by: number | HTMLElement;
    isAnimate?: boolean;
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

    function isEmptyEl<T>(array: T[], i: number): boolean {
        return !array[i];
    }

    const getItem = (index: number) => {
        if (!isEmptyEl(stateRef.current.elements, index)) {
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

    const getFirstVisibleItemIndex = () => {
        if (!selectedItemRef.current) return 0;

        const targetIndex =
            getItemIndex(selectedItemRef.current) + 1 - getItemNumbers();
        return coerceIn(targetIndex, 0, stateRef.current.elements.length - 1);
    };
    const getLastVisibleItemIndex = () => {
        return stateRef.current.firstVisibleItemIndex + getItemNumbers() - 1;
    };

    const getItemNumbers = () => {
        if (!containerRef.current || !stateRef.current) return 0;
        const { current: state } = stateRef;

        return calculateViewportItemNumbers({
            container: containerRef.current,
            gap: state.style.element.gap,
            firstVisibleItemIndex: state.firstVisibleItemIndex,
            direction: state.style.direction,
        });
    };

    const updateTransform = (offset: OffsetState) => {
        const { current: container } = containerRef;
        if (!container) return;

        const { value, isTransition } = offset;
        container.style.transition = `${isTransition ? 'transform 300ms' : 'none'}`;
        const isRow = stateRef.current.style.direction === FlexDirection.ROW;
        container.style.transform = `translate${isRow ? 'X' : 'Y'}(${value}px)`;
    };

    function calculateTranslateOffset() {
        const { current: state } = stateRef;

        return state.elements
            .slice(0, state.firstVisibleItemIndex)
            .reduce((sum, element) => {
                const dimension =
                    state.style.direction === FlexDirection.ROW
                        ? element.offsetWidth
                        : element.offsetHeight;

                return sum - dimension - state.style.element.gap;
            }, 0);
    }

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

        const offset = calculateTranslateOffset();
        updateTransform({
            value: offset,
            isTransition: isAnimate,
        });
    };

    useLayoutEffect(() => {
        stateRef.current.enabled = enabled;
    }, [enabled]);

    const handleKeyDown = useCallback((event: CustomKeyboardEvent) => {
        event.preventDefault();

        const { current: state } = stateRef;
        if (!state.enabled || !selectedItemRef.current || !containerRef.current)
            return;

        const { keyCode } = event;

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
            state.elements.length - 1,
        );

        const firstItemIndex = state.firstVisibleItemIndex;
        if (targetIndex > getLastVisibleItemIndex()) {
            state.firstVisibleItemIndex = coerceAtMost(
                firstItemIndex + 1,
                stateRef.current.elements.length - 1,
            );
        } else if (targetIndex < firstItemIndex) {
            state.firstVisibleItemIndex = coerceAtLeast(firstItemIndex - 1, 0);
        }

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
                    passive: false,
                });
            }

            const elements = getChildrenOfElement(node);
            const representativeItem = elements[0];
            if (!representativeItem) return;

            const gap = getGap(representativeItem, direction);

            stateRef.current = {
                style: {
                    element: {
                        gap,
                    },
                    direction,
                },
                elements,
                firstVisibleItemIndex:
                    stateRef.current.firstVisibleItemIndex ??
                    getFirstVisibleItemIndex(),
                enabled,
            };

            const selectedItem = elements.find(
                (element) => element === selectedItemRef.current,
            );

            if (enabled) {
                selectItem({
                    by: selectedItem ?? representativeItem,
                });
            }
        },
        [items, enabled],
    );

    return {
        setBoxRef,
        selectItem,
        getSelectedItemIndex,
    };
}

const getGap: (element: HTMLElement, direction: FlexDirection) => number = (
    element,
    direction,
) => {
    const gapAttribute = window.getComputedStyle(element);
    const gap =
        direction === FlexDirection.ROW
            ? gapAttribute.marginRight
            : gapAttribute.marginBottom;

    return parseInt(gap);
};

type State = {
    elements: HTMLElement[];
    style: {
        element: Pick<ElementStyle, 'gap'>;
        direction: FlexDirection;
    };
    firstVisibleItemIndex: number;
    enabled: boolean;
};

const defaultState: State = {
    elements: [],
    style: {
        element: {
            gap: 0,
        },
        direction: FlexDirection.ROW,
    },
    firstVisibleItemIndex: 0,
    enabled: false,
};

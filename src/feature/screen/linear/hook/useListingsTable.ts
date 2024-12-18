import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {
    CustomKeyboardEvent,
    FlexDirection,
    Nullable,
    Optional,
} from '@/type/common';
import {
    containTabIndex,
    getChildrenOfElement,
} from '@/util/getChildrenOfElement';
import { DOWN, LEFT, RIGHT, UP } from '@/util/eventKey';
import { coerceIn, getRem, TableIndex } from '@/util/common';
import { TimeBarOffsetValues } from '@/atom/screen/linear';
import { useViewportSize } from '@/hook/useViewportSize';
// import { makeKeyboardEvent } from '@/util/makeKeyboardEvent';
import { getTransformMatrixValues } from '@/util/getTransformMaxrixValues';

export const COMMON_SELECTED_ROW_INDEX = 2;

type Props<T> = {
    items: T[];
    enabled: boolean;
    selectedColumnIndex: number;
    timeBarOffsetValues: TimeBarOffsetValues;
};

type Return = {
    offset: number;
    getSelectedItemIndex: () => Nullable<TableIndex>;
    selectItem: (index: TableIndex) => void;
    setListRef: (node: Nullable<HTMLElement>) => void;
};

type State = {
    enabled: boolean;
    timeBarOffsetValues: Nullable<TimeBarOffsetValues>;
    selectedColumnItem: Nullable<HTMLElement>;
    selectedIndex: Nullable<TableIndex>;
};

type Style = {
    columns: HTMLElement[];
    rows: HTMLElement[][];
};

export function useListingsTable<T>({
    items,
    enabled,
    selectedColumnIndex,
    timeBarOffsetValues,
}: Props<T>): Return {
    const containerRef = useRef<Optional<HTMLElement>>(undefined);
    const styleRef = useRef(defaultStyle);
    const stateRef = useRef(defaultState);
    const [offset, setOffset] = useState(0);

    const getSelectedItemIndex = () => stateRef.current.selectedIndex;

    const selectItem = (index: TableIndex) => {
        stateRef.current.selectedIndex = index;

        const [columnIndex, rowIndex] = index;
        const rows = styleRef.current.rows?.[columnIndex];
        const item = rows?.[coerceIn(rowIndex, 0, rows?.length - 1)];
        item?.focus({ preventScroll: true });
    };

    const updateOffset = () => {
        const { current: state } = stateRef;
        const index = state.selectedIndex;
        if (!index || !containerRef.current) return;

        const [columnIndex] = index;
        const targetColumn = styleRef.current.columns[columnIndex];
        if (!targetColumn) return;

        const fixedIndex = columnIndex - 2;

        const [_, translateY] = getTransformMatrixValues(containerRef.current);
        const isInViewport = isElementInViewport({
            item: targetColumn,
            container: containerRef.current,
            offset: translateY,
        });

        const adjustedIndex = isInViewport ? fixedIndex : fixedIndex + 1;
        const offset = -110 * coerceIn(adjustedIndex, 0, 3);
        setOffset(offset);
    };

    useLayoutEffect(() => {
        stateRef.current.enabled = enabled;
    }, [enabled]);

    const handleKeyDown = useCallback((event: CustomKeyboardEvent) => {
        event.preventDefault();

        const { keyCode } = event;

        const { current: style } = styleRef;
        const { current: state } = stateRef;
        const { selectedColumnItem, selectedIndex } = state;

        if (!selectedColumnItem || !selectedIndex) return;
        const selectedColumnIndex = style.columns.indexOf(selectedColumnItem);

        if (keyCode === UP || keyCode === DOWN) {
            const delta = keyCode === UP ? -1 : 1;
            const [, rowIndex] = selectedIndex;
            const targetColumnIndex = coerceIn(
                selectedColumnIndex + delta,
                0,
                style.columns.length - 1,
            );

            stateRef.current.selectedColumnItem =
                style.columns[targetColumnIndex];
            const targetRowIndex = Math.min(
                Math.min(2, rowIndex),
                style.rows.length - 1,
            );
            selectItem([targetColumnIndex, targetRowIndex]);
        }

        if (keyCode === LEFT || keyCode === RIGHT) {
            const delta = keyCode === LEFT ? -1 : 1;

            const { timeBarOffsetValues } = state;
            if (!timeBarOffsetValues) return;

            const [, rowIndex] = selectedIndex;
            const {
                value: offset,
                min: minOffset,
                max: maxOffset,
            } = timeBarOffsetValues;

            const targetIndex = rowIndex + delta;
            let minIndex;
            if (offset > minOffset) {
                minIndex = 2;
            } else if (targetIndex === -1) {
                minIndex = 1;
            } else {
                minIndex = 0;
            }
            const maxIndex = style.rows[selectedColumnIndex].length - 1;

            const shouldChangeBeginningOfRow = targetIndex > maxIndex;
            const isLastRowReached = offset >= maxOffset;

            const targetRowIndex = coerceIn(
                targetIndex,
                minIndex,
                isLastRowReached
                    ? maxIndex
                    : shouldChangeBeginningOfRow
                      ? 2
                      : maxIndex,
            );
            selectItem([selectedColumnIndex, targetRowIndex]);
        }
    }, []);

    // const handleWheel = useCallback((event: WheelEvent) => {
    //     if (stateRef.current.enabled) {
    //         handleKeyDown(makeKeyboardEvent('keydown')(event));
    //     }
    // }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        // window.addEventListener('wheel', handleWheel);
        containerRef.current.addEventListener('keydown', handleKeyDown);
        return () => {
            // window.removeEventListener('wheel', handleWheel);
            containerRef.current?.removeEventListener('keydown', handleKeyDown);
        };
    }, [containerRef]);

    const setListRef = useCallback(
        (node: Nullable<HTMLElement>) => {
            if (!node || !items.length) return;

            containerRef.current = node;

            const columns = getChildrenOfElement(node).filter((child) =>
                containTabIndex(child),
            );
            const rows = columns
                .map((element) => findFocusableItem(element))
                .filter((arr) => arr.length);
            styleRef.current = {
                columns,
                rows,
            };

            const { current: state } = stateRef;
            const { selectedIndex } = state;
            let newIndex: TableIndex;
            if (selectedIndex) {
                const [, selectedRowIndex] = selectedIndex;
                newIndex = [selectedColumnIndex, selectedRowIndex];
            } else {
                newIndex = [selectedColumnIndex, COMMON_SELECTED_ROW_INDEX];
            }
            stateRef.current = {
                selectedIndex: newIndex,
                selectedColumnItem: columns[selectedColumnIndex],
                timeBarOffsetValues,
                enabled,
            };

            enabled && selectItem(newIndex);
            updateOffset();
        },
        [enabled, timeBarOffsetValues, selectedColumnIndex, items],
    );

    return {
        setListRef,
        offset,
        selectItem,
        getSelectedItemIndex,
    };
}

export function findFocusableItem(item: HTMLElement): HTMLElement[] {
    if (!item) return [];

    function findFocusable(node: HTMLElement) {
        if (node.tabIndex === 0) {
            focusableElements.push(node);
        }
        getChildrenOfElement(node).forEach((el) => findFocusable(el));
    }

    const focusableElements: HTMLElement[] = [];
    getChildrenOfElement(item).forEach((el) => findFocusable(el));
    return focusableElements;
}

const defaultState: State = {
    enabled: false,
    timeBarOffsetValues: null,
    selectedColumnItem: null,
    selectedIndex: null,
};

const defaultStyle: Style = {
    columns: [],
    rows: [],
};

export function useItemNumbersInListings() {
    const [itemNumbers, setItemNumbers] = useState(0);

    const { ref, setRef, size } = useViewportSize(FlexDirection.COLUMN);

    useLayoutEffect(() => {
        if (!ref.current) return;
        const { current: node } = ref;

        let focusableItem: Optional<HTMLElement> = undefined;

        const table = getChildrenOfElement(node)?.[0];
        if (table) {
            focusableItem = getChildrenOfElement(table).find((child) =>
                containTabIndex(child),
            );
        }

        const itemHeight = focusableItem
            ? focusableItem.offsetHeight
            : (110 * getRem()) / 100;

        const itemNumbers = Math.round(size / itemHeight);
        setItemNumbers(itemNumbers);
    }, [size]);

    return { itemNumbers, setRef };
}

function isElementInViewport({
    container,
    item,
    offset,
}: {
    container: HTMLElement;
    item: HTMLElement;
    offset: number;
}) {
    const parent = container.parentElement;
    if (!parent || !item) return false;

    const parentRect = parent.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const adjustedItemTop = itemRect.top + offset;
    const adjustedItemBottom = itemRect.bottom + offset;

    return (
        adjustedItemTop >= parentRect.top &&
        adjustedItemBottom <= parentRect.bottom
    );
}

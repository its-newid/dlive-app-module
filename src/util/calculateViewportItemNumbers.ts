import { FlexDirection } from '@/type/common';
import { userAgent } from '@/util/userAgent';

type Props = {
    container: HTMLElement;
    gap: number;
    firstVisibleItemIndex: number;
    direction: FlexDirection;
};

export function calculateViewportItemNumbers({
    container,
    gap,
    firstVisibleItemIndex,
    direction
}: Props) {
    const isRow = direction === FlexDirection.ROW;
    const actualDimension = getActualDimension({ container, direction });
    const children = Array.from(container.children)
        .slice(firstVisibleItemIndex)
        .map((element) => element);

    const lastIndex = children.length - 1;
    let overflowDimension = 0;

    for (let i = 0; i <= lastIndex; i++) {
        const element = children[i];
        const dimension = isRow ? element.clientWidth : element.clientHeight;

        const offsetDimension = i === lastIndex ? dimension : dimension + gap;
        overflowDimension += offsetDimension;
        if (overflowDimension > actualDimension) return i;
    }

    return children.length;
}

export function getFlexDirection(container: HTMLElement): FlexDirection {
    const attribute = window.getComputedStyle(container);
    const flexDirection = attribute.flexDirection;

    if (flexDirection.includes('row')) {
        return FlexDirection.ROW;
    } else if (flexDirection.includes('column')) {
        return FlexDirection.COLUMN;
    } else {
        throw new Error(`Unexpected value for flexDirection: ${attribute.flexDirection}`);
    }
}

export function getActualDimension({
    container,
    direction
}: Pick<Props, 'container' | 'direction'>) {
    const isRow = direction === FlexDirection.ROW;
    const computedStyle = window.getComputedStyle(container);
    const { marginLeft, marginRight, marginTop, marginBottom } = computedStyle;

    const margin = (isRow ? [marginLeft, marginRight] : [marginTop, marginBottom])
        .map(parseFloat)
        .reduce((acc, val) => acc + val, 0);

    return isRow
        ? Math.min(userAgent.screenSize.getScreenWidth(), container.clientWidth - margin)
        : Math.min(userAgent.screenSize.getScreenHeight(), container.clientHeight - margin);
}

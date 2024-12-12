import { FlexDirection } from '@/type/common';

export const getElementStyle = (
    element: HTMLElement,
    direction: FlexDirection = FlexDirection.ROW
) => {
    const { offsetWidth: width, offsetHeight: height, offsetLeft: left, offsetTop: top } = element;
    const elementStyle = window.getComputedStyle(element);
    const gapAttribute =
        direction === FlexDirection.ROW ? elementStyle.marginRight : elementStyle.marginBottom;
    const gap = parseFloat(gapAttribute);

    return {
        width,
        height,
        top,
        left,
        gap
    };
};

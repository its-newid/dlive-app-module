export function getChildrenOfElement(el: HTMLElement) {
    const collection = el.children;
    return Array.from(collection) as HTMLElement[];
}

export const containTabIndex = (node: HTMLElement): boolean => {
    if (node.tabIndex === 0) {
        return true;
    }

    const children = node.children;
    return children ? getChildrenOfElement(node).some((child) => containTabIndex(child)) : false;
};

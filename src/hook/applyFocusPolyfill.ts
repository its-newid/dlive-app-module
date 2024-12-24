let supported = false;
document.createElement('i').focus({
    get preventScroll() {
        supported = true;
        return false;
    },
});

export const applyFocusPolyfill = () => {
    if (supported) return;

    const originalFocus = HTMLElement.prototype.focus;

    HTMLElement.prototype.focus = function () {
        // eslint-disable-next-line
        let p: Node | null = this;
        const map = new Map<Node, [number, number]>();
        while ((p = p.parentNode)) {
            if (p instanceof Element) {
                map.set(p, [p.scrollLeft, p.scrollTop]);
            }
        }
        originalFocus.apply(this);
        map.forEach((pos, el) => {
            if (el instanceof Element) {
                el.scrollLeft = pos[0];
                el.scrollTop = pos[1];
            }
        });
    };
};

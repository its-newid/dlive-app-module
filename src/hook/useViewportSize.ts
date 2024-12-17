import { RefObject, useCallback, useRef, useState } from 'react';
import { userAgent } from '@/util/userAgent';
import { FlexDirection, Optional } from '@/type/common';

type Return = {
    ref: RefObject<Optional<HTMLDivElement>>;
    setRef: (node: HTMLDivElement) => void;
    size: number;
};

export const useViewportSize = (direction: FlexDirection): Return => {
    const [size, setSize] = useState(0);

    const ref = useRef<HTMLDivElement>(undefined);

    const setRef = useCallback(
        (node: HTMLDivElement) => {
            if (!node) return;
            ref.current = node;

            const { getScreenWidth, getScreenHeight } = userAgent.screenSize;
            const rect = node.getBoundingClientRect();
            const viewportSize =
                direction === FlexDirection.ROW
                    ? getScreenWidth() - rect.left
                    : getScreenHeight() - rect.top;
            setSize(viewportSize);
        },
        [direction],
    );

    return { ref, setRef, size };
};

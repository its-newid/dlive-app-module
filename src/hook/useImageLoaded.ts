import { useCallback, useEffect, useRef, useState } from 'react';
import { Nullable } from '@/type/common';

export const useImageLoaded = (src: string) => {
    const ref = useRef<HTMLImageElement>(null);
    const [isImgLoaded, setImgLoaded] = useState(false);

    const handleImageLoaded = () => setImgLoaded(true);

    const setImgRef = useCallback(
        (node: Nullable<HTMLImageElement>) => {
            setImgLoaded(false);

            if (node) {
                ref.current = node;
                node.addEventListener('load', handleImageLoaded);
            }
        },
        [src],
    );

    useEffect(() => {
        const { current: node } = ref;
        if (node) {
            node.style.display = isImgLoaded ? 'inline-block' : 'none';
        }
    }, [isImgLoaded, src]);

    return { isImgLoaded, setImgRef };
};

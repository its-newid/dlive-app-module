import { useCallback, useRef } from 'react';
import { Nullable } from '@/type/common';

const useAriaLabelUpdater = () => {
    const ariaLabelRef = useRef<Nullable<HTMLDivElement>>(null);
    const timeJobRef = useRef<Nullable<number>>(null);

    const updateAriaLabel = useCallback((title: string, delay = 300) => {
        clearJob();

        timeJobRef.current = window.setTimeout(() => {
            if (ariaLabelRef.current) {
                ariaLabelRef.current.innerText = title;
                clearJob();
            }
        }, delay);
    }, []);

    const clearJob = () => {
        if (timeJobRef.current) {
            window.clearTimeout(timeJobRef.current);
            timeJobRef.current = null;
        }
    };

    return {
        ariaLabelRef,
        updateAriaLabel
    };
};

export default useAriaLabelUpdater;

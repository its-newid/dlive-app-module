import { useEffect, useRef } from 'react';

export function usePrevious<T>(
    value: T,
    condition: (prev: T | undefined, current: T) => boolean = () => true
): T | undefined {
    const ref = useRef<T | undefined>(undefined);
    const previousRef = useRef<T | undefined>(undefined);

    useEffect(() => {
        if (condition(previousRef.current, value)) {
            previousRef.current = ref.current;
            ref.current = value;
        }
    }, [value, condition]);
    return previousRef.current;
}

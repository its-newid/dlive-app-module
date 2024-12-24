import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T, condition = () => true) {
    const ref = useRef<T>(value);

    useEffect(() => {
        if (condition()) {
            ref.current = value;
        }
    }, [value]);
    return ref.current;
}

import { useEffect, useRef } from 'react';

type IntervalOptions = {
    callback: () => void;
    delay: number | null;
};

export function useInterval({ callback, delay }: IntervalOptions) {
    const handler = useRef<() => void>(null);

    useEffect(() => {
        handler.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (handler.current) {
                handler.current();
            }
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

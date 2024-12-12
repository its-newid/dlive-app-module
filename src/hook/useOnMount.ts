import { useEffect, useRef } from 'react';

export const useOnMount = (effect: () => void) => {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            effect();
        }
    }, []);
};

import { useEffect } from 'react';

export const usePreventFocusLoss = () => {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => event.preventDefault();
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);
};

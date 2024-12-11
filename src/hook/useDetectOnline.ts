import { useState, useEffect } from 'react';

export const useDetectOnline = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const setOnline = () => setIsOnline(true);

    useEffect(() => {
        const handleStatusChange = () => setIsOnline(false);
        window.addEventListener('offline', handleStatusChange);

        return () => {
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    return { isOnline, setOnline };
};

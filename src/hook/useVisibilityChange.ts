import { useEffect, useState } from 'react';

export function useVisibility() {
    const [visible, setVisibility] = useState(true);

    useEffect(() => {
        function handleVisibility() {
            setVisibility(!document.hidden);
        }

        window.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return visible;
}

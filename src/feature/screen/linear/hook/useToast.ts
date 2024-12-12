import { useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { isToastVisibleState } from '@/atom/screen/linear';

export const TOAST_ANIMATION = {
    DURATION: 500,
    DELAY: 2500
};

const useToast = () => {
    const [isToastVisible, setIsToastVisible] = useAtom(isToastVisibleState);
    const [message, setMessage] = useState('');
    const timerSet = useRef(new Set<number>());

    const setTimer = (timeout: number) => (handler: () => void) => {
        const timer = window.setTimeout(handler, timeout);
        timerSet.current.add(timer);
    };

    const clearAllTimer = () => {
        timerSet.current.forEach((id) => {
            window.clearTimeout(id);
            timerSet.current.delete(id);
        });
    };

    const showToast = (message: string) => {
        clearAllTimer();

        setMessage(message);
        setIsToastVisible(true);

        setTimer(TOAST_ANIMATION.DELAY)(() => setTimer(TOAST_ANIMATION.DURATION)(removeToast));
    };

    const removeToast = () => {
        clearAllTimer();
        setIsToastVisible(false);
        setMessage('');
    };

    return { isToastVisible, message, showToast, removeToast };
};

export default useToast;

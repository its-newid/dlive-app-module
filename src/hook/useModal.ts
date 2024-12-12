import { useCallback, useState } from 'react';

export interface IModal {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useModal = (): IModal => {
    const [isOpen, setOpen] = useState(false);

    const onOpen = useCallback(() => setOpen(true), []);
    const onClose = useCallback(() => setOpen(false), []);

    return {
        isOpen,
        onOpen,
        onClose
    };
};

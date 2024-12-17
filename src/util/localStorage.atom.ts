import { atom } from 'jotai';

export const atomWithLocalStorage = <T>(key: string, initialValue: T) => {
    const getInitialValue = () => {
        const item = localStorage.getItem(key);
        if (item !== null) {
            return JSON.parse(item) as T;
        }
        return initialValue;
    };

    const baseAtom = atom(getInitialValue());

    return atom(
        (get) => get(baseAtom),
        (get, set, update) => {
            const nextValue: T =
                typeof update === 'function' ? update(get(baseAtom)) : update;
            set(baseAtom, nextValue);
            localStorage.setItem(key, JSON.stringify(nextValue));
        },
    );
};

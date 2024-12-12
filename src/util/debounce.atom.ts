import { atom, SetStateAction } from 'jotai/index';

export default function atomWithDebounce<T>(
    initialValue: T,
    delayMilliseconds = 500,
    shouldDebounceOnReset = false
) {
    const prevTimeoutAtom = atom<ReturnType<typeof setTimeout> | undefined>(undefined);

    const _currentValueAtom = atom(initialValue);
    const isDebouncingAtom = atom(false);

    const debouncedValueAtom = atom(initialValue, (get, set, update: SetStateAction<T>) => {
        clearTimeout(get(prevTimeoutAtom));

        const prevValue = get(_currentValueAtom);
        const nextValue =
            typeof update === 'function' ? (update as (prev: T) => T)(prevValue) : update;

        const onDebounceStart = () => {
            set(_currentValueAtom, nextValue);
            set(isDebouncingAtom, true);
        };

        const onDebounceEnd = () => {
            set(debouncedValueAtom, nextValue);
            set(isDebouncingAtom, false);
        };

        onDebounceStart();

        if (!shouldDebounceOnReset && nextValue === initialValue) {
            onDebounceEnd();
            return;
        }

        const nextTimeoutId = setTimeout(() => {
            onDebounceEnd();
        }, delayMilliseconds);

        set(prevTimeoutAtom, nextTimeoutId);
    });

    const clearTimeoutAtom = atom(null, (get, set) => {
        clearTimeout(get(prevTimeoutAtom));
        set(isDebouncingAtom, false);
    });

    const initialAtom = atom(null, (_, set) => {
        set(clearTimeoutAtom);
        set(_currentValueAtom, initialValue);
        set(debouncedValueAtom, initialValue);
    });

    return {
        currentValueAtom: atom((get) => get(_currentValueAtom)),
        isDebouncingAtom,
        clearTimeoutAtom,
        debouncedValueAtom,
        initialAtom
    };
}

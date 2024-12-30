import { atomWithLocalStorage } from '../util/localStorage.atom';
import { PrimitiveAtom, useAtom } from 'jotai';
import { ContentType } from '../type/common';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useCallback } from 'react';

export type TMyListContents = {
    [val in ContentType]: string[];
};

export const uuidState = atomWithLocalStorage('uuid', '');

// export const isFirstLaunchState = atomWithLocalStorage('isFirstLaunch', true);

const initialMyListContent = Object.values(ContentType).reduce((acc, val) => {
    return { ...acc, [val]: [] };
}, {} as TMyListContents);

export const mylistState = atomWithStorage<TMyListContents>(
    'favorite',
    initialMyListContent,
);

export const lastUpdatedTimeState = atomWithStorage<number>(
    'lastUpdatedTime',
    0,
    createJSONStorage(() => sessionStorage),
);

export function useReducerAtom<Value, Action>(
    anAtom: PrimitiveAtom<Value>,
    reducer: (v: Value, a: Action) => Value,
) {
    const [state, setState] = useAtom(anAtom);
    const dispatch = useCallback(
        (action: Action) => setState((prev) => reducer(prev, action)),
        [setState, reducer],
    );
    return [state, dispatch] as const;
}

import { atomWithLocalStorage } from '../util/localStorage.atom';
import { atom } from 'jotai';
import { ContentType } from '../type/common';
import { ChannelEpisode } from '../type/linear';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { PrimitiveAtom } from 'jotai/vanilla';
import { useCallback } from 'react';

export type TMyListContents = {
    [val in ContentType]: string[];
};

export type LinearWatchHistory = Pick<ChannelEpisode, 'contentId'>;

export type TWatchedContent = {
    linear: LinearWatchHistory[];
};

export const uuidState = atomWithLocalStorage('uuid', '');

export const isFirstLaunchState = atomWithLocalStorage('isFirstLaunch', true);

const initialMyListContent = Object.values(ContentType).reduce((acc, val) => {
    return { ...acc, [val]: [] };
}, {} as TMyListContents);

export const mylistState = atomWithStorage<TMyListContents>(
    'favorite',
    initialMyListContent,
);

const initialWatchHistoryContent: TWatchedContent = {
    linear: [],
};

export const watchHistoryState = atomWithStorage<TWatchedContent>(
    'watch',
    initialWatchHistoryContent,
);

const MAX_WATCH_HISTORY_COUNT = 30;

export const writeWatchHistory = atom(
    null,
    (
        get,
        set,
        item: {
            content: LinearWatchHistory;
            type: ContentType;
        },
    ) => {
        const watchedContents = get(watchHistoryState);
        const { content, type } = item;

        const history = watchedContents[type];
        if (!history) return;

        const existingIndex = history.findIndex(
            (item) => item.contentId === content.contentId,
        );

        if (existingIndex !== -1) {
            const updatedHistory = [...history];
            updatedHistory.splice(existingIndex, 1);

            if (updatedHistory.length >= MAX_WATCH_HISTORY_COUNT) {
                updatedHistory.shift();
            }
            updatedHistory.push(content);

            set(watchHistoryState, {
                ...watchedContents,
                [type]: updatedHistory,
            });
        } else {
            const updatedHistory = [...history];

            if (updatedHistory.length >= MAX_WATCH_HISTORY_COUNT) {
                updatedHistory.shift();
            }
            updatedHistory.push(content);

            set(watchHistoryState, {
                ...watchedContents,
                [type]: updatedHistory,
            });
        }
    },
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

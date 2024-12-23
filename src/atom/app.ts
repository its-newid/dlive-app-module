import { atom, useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { ContentKind, ContentType } from '@/type/common';
import { ChannelEpisode } from '@/type/linear';
import { PrimitiveAtom } from 'jotai/vanilla';
import { useCallback } from 'react';
// import { DEFAULT_LOCALE } from '@/app/environment';
// import { getLanguage, splitLanguageAndCountry } from '@/hook/loadLocaleMessage';

// type TLocale = {
//     lang: string;
//     country: string;
// };

export type TMyListContents = {
    [val in ContentType]: string[];
};

export type LinearWatchHistory = Pick<ChannelEpisode, 'contentId'>;
export type TWatchedContent = {
    linear: LinearWatchHistory[];
};

export const uuidState = atomWithStorage('uuid', '');

// const getInitialLocale = (): TLocale => {
//     const [language, country] = splitLanguageAndCountry(navigator.language);
//     return {
//         lang: getLanguage(language) ?? DEFAULT_LOCALE.lang,
//         country: country ?? DEFAULT_LOCALE.country
//     };
// };

// export const localeState = atomWithStorage<TLocale>('locale', getInitialLocale());

// export const languageSelector = atom(
//     (get) => {
//         const locale = get(localeState);
//         return locale.lang;
//     },
//     (get, set, code: string) => {
//         const lang = getLanguage(code) ?? DEFAULT_LOCALE.lang;
//         const locale = get(localeState);
//         set(localeState, {
//             ...locale,
//             lang: lang
//         });
//     }
// );

export const isFirstLaunchState = atomWithStorage('isFirstLaunch', true);

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
            type: ContentKind<ContentType>;
        },
    ) => {
        const watchedContents = get(watchHistoryState);
        const { content, type } = item;

        const history = watchedContents.linear;
        if (!history) return;
        const filteredHistory = history.filter(
            (item) => item.contentId !== content.contentId,
        );
        const updatedHistory = [
            ...filteredHistory.slice(-(MAX_WATCH_HISTORY_COUNT - 1)),
            content,
        ];

        set(watchHistoryState, {
            ...watchedContents,
            [type]: updatedHistory,
        });
    },
);

export const deleteWatchHistory = atom(
    null,
    (
        get,
        set,
        item: {
            content: LinearWatchHistory;
            type: ContentKind<ContentType>;
        },
    ) => {
        const history = get(watchHistoryState);

        const existingIndex = history.linear?.findIndex(
            (history) => history.contentId === item.content.contentId,
        );
        if (existingIndex === -1) return;

        set(watchHistoryState, {
            ...history,
            linear: history.linear.filter(
                (vod) => item.content.contentId !== vod.contentId,
            ),
        });
    },
);

export const clearWatchHistoryAtom = atom(
    null,
    (get, set, type: ContentKind<ContentType>) => {
        const history = get(watchHistoryState);

        set(watchHistoryState, {
            ...history,
            [type]: [],
        });
    },
);

export const clearAllWatchHistoryAtom = atom(null, (_, set) => {
    set(watchHistoryState, initialWatchHistoryContent);
});

export const lastUpdatedTimeState = atomWithStorage<number>(
    'lastUpdatedTime',
    0,
    createJSONStorage(() => sessionStorage),
);

export const ipState = atomWithStorage<string>(
    'ip',
    '',
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

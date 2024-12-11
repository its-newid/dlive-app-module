// import { getLanguage, splitLanguageAndCountry } from '@/hook/loadLocaleMessage';
import { atom } from 'jotai';
// import { DEFAULT_LOCALE } from '@/app/environment';
import { ContentKind, ContentType } from '@/type/common';
import { ChannelEpisode } from '@/type/linear';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

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
export const mylistState = atomWithStorage<TMyListContents>('favorite', initialMyListContent);

const initialWatchHistoryContent: TWatchedContent = {
    linear: []
};
export const watchHistoryState = atomWithStorage<TWatchedContent>(
    'watch',
    initialWatchHistoryContent
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
        }
    ) => {
        const watchedContents = get(watchHistoryState);
        const { content, type } = item;

        const history = watchedContents.linear;
        if (!history) return;

        const existingIndex = history.findIndex((item) => item.contentId === content.contentId);

        if (existingIndex !== -1) {
            const updatedHistory = [...history];
            updatedHistory.splice(existingIndex, 1);

            if (updatedHistory.length >= MAX_WATCH_HISTORY_COUNT) {
                updatedHistory.shift();
            }
            updatedHistory.push(content);

            set(watchHistoryState, {
                ...watchedContents,
                [type]: updatedHistory
            });
        } else {
            const updatedHistory = [...history];

            if (updatedHistory.length >= MAX_WATCH_HISTORY_COUNT) {
                updatedHistory.shift();
            }
            updatedHistory.push(content);

            set(watchHistoryState, {
                ...watchedContents,
                [type]: updatedHistory
            });
        }
    }
);

export const deleteWatchHistory = atom(
    null,
    (
        get,
        set,
        item: {
            content: LinearWatchHistory;
            type: ContentKind<ContentType>;
        }
    ) => {
        const history = get(watchHistoryState);

        const existingIndex = history.linear?.findIndex(
            (history) => history.contentId === item.content.contentId
        );
        if (existingIndex === -1) return;

        set(watchHistoryState, {
            ...history,
            linear: history.linear.filter((vod) => item.content.contentId !== vod.contentId)
        });
    }
);

export const clearWatchHistoryAtom = atom(null, (get, set, type: ContentKind<ContentType>) => {
    const history = get(watchHistoryState);

    set(watchHistoryState, {
        ...history,
        [type]: []
    });
});

export const clearSearchHistoryAtom = atom(null, (_, set) => {
    set(searchKeywordHistoryState, []);
});

export const clearAllWatchHistoryAtom = atom(null, (_, set) => {
    set(watchHistoryState, initialWatchHistoryContent);
});

export const searchKeywordHistoryState = atomWithStorage<string[]>('searchKeywords', []);

const MAX_SEARCH_HISTORY_COUNT = 10;
export const searchKeywordHistorySelector = atom(
    (get) => {
        const list = get(searchKeywordHistoryState);
        return [...list].reverse();
    },
    (get, set, keyword: string) => {
        const histories = get(searchKeywordHistoryState);

        if (histories.includes(keyword)) {
            const index = histories.indexOf(keyword);
            histories.splice(index, 1);
        }

        if (histories.length >= MAX_SEARCH_HISTORY_COUNT) {
            histories.shift();
        }

        set(searchKeywordHistoryState, [...histories, keyword]);
    }
);

export const lastUpdatedTimeState = atomWithStorage<number>(
    'lastUpdatedTime',
    0,
    createJSONStorage(() => sessionStorage)
);

export const ipState = atomWithStorage<string>(
    'ip',
    '',
    createJSONStorage(() => sessionStorage)
);

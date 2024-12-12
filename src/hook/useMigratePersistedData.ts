import { useSetAtom } from 'jotai';
import {
    mylistState,
    isFirstLaunchState,
    TMyListContents,
    TWatchedContent,
    uuidState,
    watchHistoryState
} from '@/atom/app';
import { ContentType } from '@/type/common';

const OLD_PERSISTED_KEY = 'persist:root';
const OLD_WATCH_HISTORY_KEY = 'recentlyWatchedContent';
const OLD_FAVORITE_KEY = 'favorites';

export function useMigratePersistedData() {
    const setWatchHistory = useSetAtom(watchHistoryState);
    const setFavorite = useSetAtom(mylistState);
    const setFirstLaunch = useSetAtom(isFirstLaunchState);
    const setUUID = useSetAtom(uuidState);

    const persistedData = localStorage.getItem(OLD_PERSISTED_KEY);
    const recentlyWatchedContentData = localStorage.getItem(OLD_WATCH_HISTORY_KEY);
    const favorites = localStorage.getItem(OLD_FAVORITE_KEY);

    async function migrate() {
        if (persistedData) {
            const parsedData = parse(persistedData);

            const favorites = parse(parsedData?.['favorites']);
            setFavorite(favorites);
            const onboarding = parse(parsedData?.['onboarding']);
            const isFirstLaunch = onboarding?.['isFirstLaunch'];
            setFirstLaunch(isFirstLaunch);

            const locales = parse(parsedData?.['locales']);
            const uuid = locales.info?.['uuid'];
            setUUID(uuid);

            localStorage.removeItem(OLD_PERSISTED_KEY);
        }

        if (recentlyWatchedContentData) {
            const parsedData = parse(recentlyWatchedContentData);
            const linear = parsedData?.['liveTV'];
            if (linear) {
                setWatchHistory((prev: TWatchedContent) => {
                    return {
                        ...prev,
                        [ContentType.LINEAR]: [{ contentId: linear }]
                    };
                });
            }
            localStorage.removeItem(OLD_WATCH_HISTORY_KEY);
        }

        if (favorites) {
            const linear = parse(favorites);
            setFavorite((prev: TMyListContents) => {
                return { ...prev, [ContentType.LINEAR]: [...linear] };
            });
            localStorage.removeItem(OLD_FAVORITE_KEY);
        }
    }

    return {
        shouldMigrate:
            persistedData !== null || recentlyWatchedContentData !== null || favorites !== null,
        migrate
    };
}

function parse(data: string) {
    return JSON.parse(data);
}

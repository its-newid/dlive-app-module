import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { Channel, ChannelEpisode } from '@/type/linear';
import { ContentType, Nullable, Optional } from '@/type/common';
import { mylistState, watchHistoryState } from '@/atom/app';
// import { scheduleCategories, selectedScheduleCategoryIdxState } from '@/atom/screen/linear';

export const channelsState = atom<Channel[]>([]);
export const channelNowState = atom<Optional<Channel>>(undefined);
export const channelSelector = atomFamily((id: string) =>
    atom((get) => {
        const channels = get(channelsState);
        return channels.find((channel) => channel.contentId === id);
    })
);

export const onAirScheduleState = atom<Optional<ChannelEpisode>>(undefined);
export const onAirScheduleEndTimeState = atom<number>(-1);
export const episodeSelector = atomFamily((id: string) =>
    atom((get) => {
        const channels = get(channelsState);
        return channels
            .flatMap((channel) => channel.schedule)
            .find((schedule) => schedule.contentId === id);
    })
);

export const findChannelSelector = atomFamily((episode: ChannelEpisode) =>
    atom((get) => {
        const channels = get(channelsState);

        return channels.find((channel) =>
            channel.schedule.some((ep) => {
                return ep === episode;
            })
        );
    })
);

export const findChannelByIdSelector = atomFamily((id: string) =>
    atom((get) => {
        const channels = get(channelsState);
        return channels.find((channel) => channel.contentId === id);
    })
);

export const selectedChannelState = atom<Nullable<ScheduleChannel>>(null);

export const selectedChannelSelector = atom(
    (get) => get(selectedChannelState),
    (get, set, selectedChannel: ScheduleChannel | string) => {
        const channelMap = get(totalChannelState);
        const channels = Array.from(channelMap.values()).flat();

        let targetChannel: Optional<ScheduleChannel>;

        if (typeof selectedChannel === 'string') {
            targetChannel = channels.find(
                (ch) => ch.contentId === selectedChannel // && ch.categoryIdx !== MyListCategory.idx
            );
        } else {
            // const isInMyList = selectedChannel.categoryIdx === MyListCategory.idx;
            // if (isInMyList) {
            //     targetChannel = channels.find((ch) => {
            //         return ch.contentId === selectedChannel.contentId;
            //     });
            // } else {
            targetChannel = channels.find((ch) => {
                return (
                    ch.contentId === selectedChannel.contentId
                    // && ch.categoryIdx === selectedChannel.categoryIdx
                );
            });
            // }
        }

        if (!targetChannel) return;

        set(selectedChannelState, targetChannel);
        // set(selectedScheduleCategoryIdxState, targetChannel.categoryIdx ?? -1);
    }
);
export const currentScheduleState = atom<Nullable<ChannelEpisode>>(null);

export type ScheduleChannel = Pick<Channel, 'contentId' | 'no' | 'thumbUrl' | 'title'>;

// export const EmptyMyListItem: ScheduleChannel = {
//     contentId: '',
//     no: -1,
//     categoryIdx: MyListCategory.idx,
//     thumbUrl: {},
//     title: ''
// };

export const channelsByPriorityState = atom<ScheduleChannel[]>((get) => {
    const channels = get(channelsState);
    return channels;
    // const categories = get(linearCategoriesState);

    // return categories?.flatMap((category) =>
    //     channels.filter((channel) => channel.categoryIdx === category.idx)
    // );
});

export const myListChannelsState = atom<ScheduleChannel[]>((get) => {
    const channels = get(channelsState);
    const myLists = get(mylistState)?.[ContentType.LINEAR];
    const reversed = [...myLists].reverse();
    const newChannels = reversed.map((id) => {
        const origin = channels.find((channel) => channel.contentId === id);
        if (!origin) return undefined;

        // const categoryIdx = MyListCategory.idx;
        return {
            ...origin
            // categoryIdx: categoryIdx
        };
    });

    const result = newChannels.filter((ch) => ch !== undefined) as Channel[];
    return result.map(({ contentId, no, thumbUrl, title }) => ({
        contentId,
        no,
        // categoryIdx,
        thumbUrl,
        title
    }));
});

export const totalChannelState = atom<Map<number, ScheduleChannel[]>>((_) => {
    // const allChannel = get(channelsState).map(({ contentId, no, thumbUrl, title }) => {
    //     return {
    //         contentId,
    //         no,
    //         // categoryIdx,
    //         thumbUrl,
    //         title
    //     };
    // });
    // const myListChannels = get(myListChannelsState);
    // const categories = get(scheduleCategories);

    const map = new Map<number, ScheduleChannel[]>();

    // for (const category of categories) {
    //     if (category.idx === MyListCategory.idx) {
    //         if (myListChannels.length) {
    //             map.set(category.idx, myListChannels);
    //         } else {
    //             map.set(category.idx, [EmptyMyListItem]);
    //         }
    //         continue;
    //     }

    //     const channels: ScheduleChannel[] = allChannel.filter(
    //         (channel) => channel.categoryIdx === category.idx
    //     );
    //     map.set(category.idx, channels);
    // }
    return map;
});

export const scheduleEnabledState = atom(false);

type PromotionContent = { contentId: string; type: ContentType };
export const promotionState = atom<Nullable<PromotionContent>>(null);

export const readInitialChannel = atom((get) => {
    const channels = get(channelsState);
    const watchHistory = get(watchHistoryState);

    const recentlyWatchedChannelId = watchHistory[ContentType.LINEAR]?.slice(-1)?.[0]?.contentId;

    const initialChannel = channels.find(
        (channel) => channel.contentId === recentlyWatchedChannelId
    );

    return initialChannel || channels?.[0];
});

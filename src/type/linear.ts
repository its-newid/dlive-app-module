import { Optional, Episode, ThumbType } from '@/type/common';

export type Channel = {
    contentId: string;
    title: string;
    description: string;
    no: number;
    logoUrl: string;
    detailUrl: string;
    liveUrl: string;
    schedule: ChannelEpisode[];
    categoryIdx: Optional<number>;
    thumbUrl: ThumbType;
    tag: string;
};

export type ChannelEpisode = Episode & {
    channelId: string;
    thumbUrl: string;
    startAt: number;
    endAt: number;
};

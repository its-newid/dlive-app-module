import { Episode, ThumbType } from './common';

export type Channel = {
    contentId: string;
    title: string;
    description: string;
    no: number;
    logoUrl: string;
    detailUrl: string;
    streamUrl: string;
    schedule: ChannelEpisode[];
    // categoryIdx: Optional<number>;
    thumbUrl: ThumbType;
    tag: string;
};

export type ChannelEpisode = Episode & {
    startAt: number;
    endAt: number;
    thumbUrl: string;
    channelId: string;
};

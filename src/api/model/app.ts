import { ThumbType } from '@/type/common';

export type LinearResponse = {
    no: number;
    contentId: string;
    title: string;
    description: string;
    thumbUrl: ThumbType;
    logoUrl: string;
    detailUrl: string;
    liveUrl: string;
    schedule: ScheduleResponse[];
    tag: string;
};

export type ScheduleResponse = {
    contentId: string;
    title: string;
    description: string;
    thumbUrl: string;
    duration: number;
    startAt: number;
    endAt: number;
};
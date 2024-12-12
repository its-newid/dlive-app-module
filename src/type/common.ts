import React, { UIEvent } from 'react';

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type EventListener<E extends UIEvent> = (event: E) => void;
export type MouseEventListener = EventListener<React.MouseEvent>;
export type KeyboardEventListener = EventListener<React.KeyboardEvent>;
export type WheelEventListener = EventListener<React.WheelEvent>;

export interface CustomKeyCodeEventInit extends CustomEventInit {
    keyCode: number;
}
export class CustomKeyCodeEvent extends CustomEvent<CustomKeyCodeEventInit> {
    keyCode: number;
    constructor(type: string, options: CustomKeyCodeEventInit) {
        super(type, options);
        this.keyCode = options.keyCode;
    }
}
export type CustomKeyboardEvent = KeyboardEvent | CustomKeyCodeEvent;

export interface IExtendableStyledComponent {
    className?: string;
}

export interface Selectable {
    selected: boolean;
}

export interface Enable {
    enabled: boolean;
}

export const FlexDirection = {
    ROW: 'row',
    COLUMN: 'column'
} as const;
export type FlexDirection = (typeof FlexDirection)[keyof typeof FlexDirection];

export const ErrorMessage = {
    NO_DATA_AVAILABLE: 'info_error_message'
} as const;

export type Badge = {
    idx: number;
    widthRatio: number;
    horizontal: string;
    vertical: string;
    imageUrl: string;
};

export const ContentType = {
    LINEAR: 'linear',
    BLANK: 'blank'
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export type ContentKind<T extends string> = T;

export const ThumbSizes = {
    BASE: 'base',
    SMALL: 'small',
    LARGE: 'large'
} as const;
export type ThumbSizes = (typeof ThumbSizes)[keyof typeof ThumbSizes];

export const ThumbRatio = {
    POSTER: 'poster',
    WIDE: 'wide'
} as const;
export type ThumbRatio = (typeof ThumbRatio)[keyof typeof ThumbRatio];

export type ThumbType = {
    [key in ThumbRatio]?: {
        [val in ThumbSizes]: string;
    };
};

export interface Episode {
    contentId: string;
    title: string;
    description: string;
    duration: number;
}

export interface RowContent {
    idx: number;
    contentId: string;
    type: ContentType;
    thumbUrl: ThumbType;
    title: string;
}

export type ScreenOverlayConfig = { state: 'infinite' } | { state: 'delayed'; duration: number };

export const VideoReadyState = {
    HAVE_NOTHING: 0,
    HAVE_METADATA: 1,
    HAVE_CURRENT_DATA: 2,
    HAVE_FUTURE_DATA: 3,
    HAVE_ENOUGH_DATA: 4
} as const;

export const VideoErrorName = {
    // play() 요청이 중단되었을때
    // 일반적으로 새로운 로드 요청이나 요소가 DOM에서 제거될 때 발생
    ABORT_ERROR: 'AbortError',
    // autoplay 요청이 허용되지 않았을때
    // 일반적으로 사용자 설정이나 브라우저 제한으로 인해 발생
    AUTOPLAY_NOT_ALLOWED: 'NotAllowedError'
} as const;

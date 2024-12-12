import { UIEvent } from 'react';
import { userAgent } from '@/util/userAgent';
import { EventListener } from '@/type/common';

export const ENTER = userAgent.keyCodeMap.enter,
    ESCAPE = userAgent.keyCodeMap.back,
    UP = userAgent.keyCodeMap.arrowUp,
    DOWN = userAgent.keyCodeMap.arrowDown,
    LEFT = userAgent.keyCodeMap.arrowLeft,
    RIGHT = userAgent.keyCodeMap.arrowRight,
    CHANNEL_UP = userAgent.keyCodeMap.channelUp,
    CHANNEL_DOWN = userAgent.keyCodeMap.channelDown;

export type DefaultUIEventHandler = <E extends UIEvent>(
    func: EventListener<E>
) => (event: E) => void;

export const onDefaultUIEvent: DefaultUIEventHandler = (func) => (event) => {
    event.preventDefault();
    func(event);
};

import { DOWN, UP } from '@/util/eventKey';
import { CustomKeyCodeEvent, CustomKeyCodeEventInit } from '../type/common';

function createKeyboardEvent(type: string, initDict: CustomKeyCodeEventInit): CustomKeyCodeEvent {
    return new CustomKeyCodeEvent(type, initDict);
}

export const makeKeyboardEvent = (type: string) => (wheelEvent: WheelEvent) => {
    const direction = wheelEvent.deltaY < 0 ? UP : DOWN;
    return createKeyboardEvent(type, {
        keyCode: direction
    } as CustomKeyCodeEventInit);
};

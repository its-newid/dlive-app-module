import { userAgent } from './userAgent';

export function coerceAtLeast(value: number, minimumValue: number) {
    return value < minimumValue ? minimumValue : value.valueOf();
}

export function coerceAtMost(value: number, maximumValue: number) {
    return value > maximumValue ? maximumValue : value.valueOf();
}

export function coerceIn(value: number, minimumValue: number, maximumValue: number) {
    return Math.max(minimumValue, Math.min(value, maximumValue));
}

export function mod(value: number, n: number) {
    return ((value % n) + n) % n;
}

export function lerp(a: number, b: number, alpha: number) {
    return a + alpha * (b - a);
}

export function toTimestamp(date: number) {
    return Math.floor(date / 1000);
}

export function toMillis(timeStamp: number) {
    return timeStamp * 1000;
}

export function toDate(timeStamp: number) {
    return new Date(toMillis(timeStamp));
}

export const getRem = () => {
    return userAgent.screenSize.getScreenHeight() * 0.0926;
};

export const zeroPad = (num: number) => String(num).padStart(2, '0');

export function isItemEmpty<T>(array: T[], at: number): boolean {
    return !array[at];
}

export type TableIndex = [column: number, row: number];

export function extractTimeComponents(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return { hrs, min, sec };
}

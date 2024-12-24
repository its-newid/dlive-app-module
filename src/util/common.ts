import { userAgent } from '@/util/userAgent';

export function coerceAtLeast(value: number, minimumValue: number) {
    return value < minimumValue ? minimumValue : value.valueOf();
}

export function coerceAtMost(value: number, maximumValue: number) {
    return value > maximumValue ? maximumValue : value.valueOf();
}

export function coerceIn(
    value: number,
    minimumValue: number,
    maximumValue: number,
) {
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

export const getRem = () => {
    return userAgent.screenSize.getScreenHeight() * 0.0926;
};

export function isItemEmpty<T>(array: T[], at: number): boolean {
    return !array[at];
}

export type TableIndex = [column: number, row: number];


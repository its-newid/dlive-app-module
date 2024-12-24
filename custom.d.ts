declare module '*.jpg';
declare module '*.png';

declare module 'uuid' {
    const v4: () => string;
    const validate: (str: string) => boolean;

    export { v4, validate };
}

interface ExitInterface {
    exit(): void;
}
declare let Android: ExitInterface;

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

declare module '*.svg' {
    import { FC, SVGProps } from 'react';
    const content: FC<SVGProps<SVGSVGElement>>;
    export default content;
}

declare module '*.svg?url' {
    const content: string;
    export default content;
}

import { useCallback } from 'react';
import ScrollableContent, {
    ScrollableContentProps,
} from '@/component/ScrollableContent';

export type FocusableScrollContentProps = ScrollableContentProps & {
    onFocusable: (canFocus: boolean) => void;
};

export function FocusableAndScrollableContent({
    onFocusable,
    ...rest
}: FocusableScrollContentProps) {
    const callbackRef = useCallback((node: HTMLDivElement) => {
        onFocusable(node.scrollHeight > node.clientHeight);
    }, []);

    return <ScrollableContent {...rest} ref={callbackRef} />;
}

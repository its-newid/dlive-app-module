import {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import styled from 'styled-components';
import {
    Enable,
    IExtendableStyledComponent,
    KeyboardEventListener,
    Nullable,
} from '@/type/common';
import { userAgent } from '@/util/userAgent';
import { DOWN, UP } from '@/util/eventKey';
import { coerceAtLeast, coerceAtMost, coerceIn } from '@/util/common';
import { UserAgentOS } from '@/type/userAgent';

const MIN_HEIGHT = 0;

export type ScrollInfo = {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
};

type Props = {
    content: string;
    onScroll?: (info: ScrollInfo) => void;
};

export type ScrollableContentProps = Props &
    IExtendableStyledComponent &
    Enable & {
        scrollOffset: number;
        setScrollOffset: (offset: number) => void;
    };

const ScrollableContent: ForwardRefRenderFunction<
    HTMLDivElement,
    ScrollableContentProps
> = (
    {
        className,
        content,
        $enabled,
        onScroll,
        scrollOffset,
        setScrollOffset,
        ...rest
    }: ScrollableContentProps,
    callbackRef,
) => {
    const scrollRef = useRef<Nullable<HTMLDivElement>>(null);
    const contentRef = useCallback(
        (node: HTMLDivElement) => {
            $enabled ? node?.focus() : node?.blur();
        },
        [$enabled],
    );

    const scrollHeight = scrollRef.current?.scrollHeight ?? 0;
    const clientHeight = scrollRef.current?.clientHeight ?? 0;
    const maxHeight = useMemo(
        () => scrollHeight - clientHeight || clientHeight,
        [scrollHeight, clientHeight],
    );
    const scrollStep: number = useMemo(() => clientHeight / 2, [clientHeight]);

    const wheelEnabled = useMemo(() => {
        const { DEFAULT } = UserAgentOS;
        return [DEFAULT].some((os) => os === userAgent.type);
    }, [userAgent]);

    const [up, down] = [UP, DOWN];
    const handleKeys = {
        [up]: coerceAtLeast(scrollOffset - scrollStep, MIN_HEIGHT),
        [down]: coerceAtMost(scrollOffset + scrollStep, maxHeight),
    };

    const executeScroll = (offset: number) => {
        if (scrollRef.current !== null) {
            scrollRef.current.scrollTop = offset;
        }
    };

    const handleScroll = (offset: number, scrollInfo: ScrollInfo) => {
        setScrollOffset(offset);
        onScroll?.(scrollInfo);
    };

    const handleKeyDown: KeyboardEventListener = (event) => {
        event.preventDefault();

        if (Object.keys(handleKeys).includes(String(event.keyCode))) {
            const target: HTMLDivElement = event.target as HTMLDivElement;
            const newOffset = handleKeys[event.keyCode];
            handleScroll(newOffset, target);
        }
    };

    useEffect(() => executeScroll(scrollOffset), [scrollOffset]);

    useEffect(() => {
        if (!wheelEnabled) return;

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();

            if (
                !scrollRef.current ||
                document.activeElement !== scrollRef.current
            ) {
                return;
            }

            const newOffset = coerceIn(
                scrollRef.current.scrollTop + event.deltaY,
                MIN_HEIGHT,
                maxHeight,
            );
            handleScroll(newOffset, {
                scrollTop: newOffset,
                scrollHeight,
                clientHeight,
            });
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [wheelEnabled, scrollHeight, clientHeight]);

    return (
        <Container
            className={`${className} scrollable-div`}
            onKeyDown={handleKeyDown}
            {...rest}
            ref={(node) => {
                if (!node) {
                    return;
                }
                scrollRef.current = node;
                contentRef(node);
                if (typeof callbackRef === 'function') {
                    callbackRef(node);
                }
            }}
        >
            <TextArea id={'content'}>{content}</TextArea>
        </Container>
    );
};

export default forwardRef<HTMLDivElement, ScrollableContentProps>(
    ScrollableContent,
);

const Container = styled.div.attrs({ tabIndex: 0 })`
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding-right: 48rem;
    &:focus {
        outline: none;
    }

    &:focus::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.main};
    }

    &::-webkit-scrollbar {
        width: 12rem;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 6rem;
        background-color: ${({ theme }) => theme.colors.grey50};
    }

    &::-webkit-scrollbar-track {
        border-radius: 6rem;
        background-color: rgba(255, 255, 255, 0.25);
    }
`;

const TextArea = styled.span`
    font-size: 28rem;
    color: ${({ theme }) => theme.colors.whiteAlpha95};
    white-space: pre-wrap;
    line-height: 36rem;
`;

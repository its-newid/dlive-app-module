import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
    memo
} from 'react';
import styled from 'styled-components';
import { IExtendableStyledComponent, Nullable } from '@/type/common';

export interface IMarqueeHandle {
    setTitle: (text: string) => void;
}

interface MarqueeProps extends IExtendableStyledComponent {
    enabled?: boolean;
    id?: string;
    delay: number;
    text?: string;
    truncateIfNeeded?: boolean;
    animationStyle?: 'oneWay' | 'comeback' | 'loop' | 'oneWayReset';
}

const MarqueeUtils = {
    // 초당 이동할 픽셀 수 (px/s)
    // 이 값을 조절하여 전체적인 속도 조절 가능
    MOVE_SPEED: 100,

    calculateDuration: (scrollWidth: number, containerWidth: number) => {
        // 이동해야 할 실제 거리
        const distance = scrollWidth - containerWidth;
        // 단순히 거리를 속도로 나누어 시간 계산
        return distance / MarqueeUtils.MOVE_SPEED;
    },

    setInitialOffset: (element: HTMLElement) => {
        if (element) {
            element.style.cssText = `
                transition: none;
                transform: translate3d(0, 0, 0);
                will-change: transform;
            `;
        }
    },

    setTranslate: ({
        x: offset,
        to: element,
        duration,
        delay = 0
    }: {
        x: number;
        to: HTMLElement;
        duration?: number;
        delay?: number;
    }) => {
        element.style.cssText = duration
            ? `
                transition: transform ${duration}s linear ${delay}s;
                transform: translate3d(${offset}px, 0, 0);
                will-change: transform;
            `
            : `
                transition: none;
                transform: translate3d(${offset}px, 0, 0);
                will-change: transform;
            `;
    }
};

const AnimationHandlers = {
    loop: (element: HTMLSpanElement, containerWidth: number, cleanup: () => void) => {
        let isAnimating = true;

        const startIteration = () => {
            if (!isAnimating) return;

            const duration = MarqueeUtils.calculateDuration(element.scrollWidth, containerWidth);

            requestAnimationFrame(() => {
                if (!isAnimating) return;

                MarqueeUtils.setTranslate({
                    x: containerWidth,
                    to: element
                });

                requestAnimationFrame(() => {
                    if (!isAnimating) return;

                    MarqueeUtils.setTranslate({
                        x: -element.scrollWidth,
                        duration,
                        to: element
                    });
                });
            });
        };

        const onEndLoop = () => {
            if (isAnimating) {
                startIteration();
            }
        };

        element.addEventListener('transitionend', onEndLoop);
        startIteration();

        return () => {
            isAnimating = false;
            element.removeEventListener('transitionend', onEndLoop);
            cleanup();
        };
    },

    oneWay: (element: HTMLSpanElement, width: number, containerWidth: number, delay: number) => {
        const duration = MarqueeUtils.calculateDuration(element.scrollWidth, containerWidth);

        MarqueeUtils.setTranslate({
            x: -width,
            duration,
            delay,
            to: element
        });
    },

    comeback: (element: HTMLSpanElement, width: number, containerWidth: number, delay: number) => {
        let isAnimating = true;
        const duration = MarqueeUtils.calculateDuration(element.scrollWidth, containerWidth);

        const onEndComeback = () => {
            if (!element || !isAnimating) return;

            requestAnimationFrame(() => {
                if (!isAnimating) return;

                MarqueeUtils.setTranslate({
                    x: 0,
                    duration,
                    delay,
                    to: element
                });
            });

            element.removeEventListener('transitionend', onEndComeback);
        };

        element.addEventListener('transitionend', onEndComeback);

        MarqueeUtils.setTranslate({
            x: -width,
            duration,
            delay,
            to: element
        });

        return () => {
            isAnimating = false;
            element.removeEventListener('transitionend', onEndComeback);
        };
    },

    oneWayReset: (
        element: HTMLSpanElement,
        width: number,
        containerWidth: number,
        delay: number
    ) => {
        let isAnimating = true;
        const duration = MarqueeUtils.calculateDuration(element.scrollWidth, containerWidth);

        const onEndReset = () => {
            if (!element || !isAnimating) return;

            // 1초 대기 후 원위치 이동
            setTimeout(() => {
                if (!isAnimating) return;

                element.style.cssText = `
                    transition: none;
                    transform: translate3d(0, 0, 0);
                    will-change: transform;
                `;
            }, 1000);

            element.removeEventListener('transitionend', onEndReset);
        };

        element.addEventListener('transitionend', onEndReset);

        // translate 애니메이션
        MarqueeUtils.setTranslate({
            x: -width,
            duration,
            delay,
            to: element
        });

        return () => {
            isAnimating = false;
            element.removeEventListener('transitionend', onEndReset);
        };
    }
};

export const Marquee = memo(
    forwardRef<IMarqueeHandle, MarqueeProps>(
        (
            {
                className,
                id,
                delay,
                enabled = true,
                truncateIfNeeded = false,
                text = '',
                animationStyle = 'oneWay'
            },
            ref
        ) => {
            const [displayText, setDisplayText] = useState(text);
            const spanRef = useRef<HTMLSpanElement>(null);
            const containerRef = useRef<HTMLDivElement>(null);
            const timeoutId = useRef<Nullable<number>>(null);
            const animationCleanupRef = useRef<(() => void) | null>(null);

            const updateTruncateState = useCallback(() => {
                if (!spanRef.current) return;

                if (truncateIfNeeded) {
                    spanRef.current.classList.add('truncate');
                } else {
                    spanRef.current.classList.remove('truncate');
                }
                MarqueeUtils.setInitialOffset(spanRef.current);
            }, [truncateIfNeeded]);

            const animateText = useCallback(() => {
                if (!spanRef.current || !containerRef.current) return;

                if (animationCleanupRef.current) {
                    animationCleanupRef.current();
                    animationCleanupRef.current = null;
                }

                const containerWidth = containerRef.current.offsetWidth;
                const width = spanRef.current.scrollWidth - containerWidth;

                if (animationStyle === 'loop') {
                    animationCleanupRef.current = AnimationHandlers.loop(
                        spanRef.current,
                        containerWidth,
                        () => {
                            animationCleanupRef.current = null;
                        }
                    );
                } else if (animationStyle === 'comeback') {
                    animationCleanupRef.current = AnimationHandlers.comeback(
                        spanRef.current,
                        width,
                        containerWidth,
                        delay
                    );
                } else if (animationStyle === 'oneWayReset') {
                    animationCleanupRef.current = AnimationHandlers.oneWayReset(
                        spanRef.current,
                        width,
                        containerWidth,
                        delay
                    );
                } else if (animationStyle === 'oneWay') {
                    AnimationHandlers.oneWay(spanRef.current, width, containerWidth, delay);
                }
            }, [animationStyle, delay]);

            const handleMarquee = useCallback((): Nullable<number> => {
                if (!containerRef.current || !spanRef.current) return null;

                const { scrollWidth } = spanRef.current;
                const { offsetWidth } = containerRef.current;
                const overflowed = scrollWidth > offsetWidth;

                if (!overflowed) return null;

                if (truncateIfNeeded) {
                    return window.setTimeout(() => {
                        if (spanRef.current) {
                            spanRef.current.classList.remove('truncate');
                            animateText();
                        }
                    }, delay * 1000);
                }

                animateText();
                return null;
            }, [animateText, delay, truncateIfNeeded]);

            useImperativeHandle(
                ref,
                () => ({
                    setTitle(text: string) {
                        setDisplayText((prevText) => {
                            if (prevText === text && spanRef.current) {
                                updateTruncateState();
                                timeoutId.current = handleMarquee();
                            }
                            return text;
                        });
                    }
                }),
                [handleMarquee, updateTruncateState]
            );

            useLayoutEffect(() => {
                updateTruncateState();
            }, [displayText, updateTruncateState]);

            useEffect(() => {
                setDisplayText(text);
            }, [text]);

            useEffect(() => {
                if (!enabled) return;
                timeoutId.current = handleMarquee();

                return () => {
                    if (animationCleanupRef.current) {
                        animationCleanupRef.current();
                        animationCleanupRef.current = null;
                    }
                    if (timeoutId.current) {
                        window.clearTimeout(timeoutId.current);
                    }
                };
            }, [enabled, handleMarquee, displayText]);

            return (
                <Container ref={containerRef}>
                    <Content id={id} className={className} ref={spanRef}>
                        {displayText}
                    </Content>
                </Container>
            );
        }
    )
);

Marquee.displayName = 'Marquee';

const Container = styled.div`
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    will-change: transform;

    & > .truncate {
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const Content = styled.span`
    white-space: nowrap;
    display: inline-block;
    transform: translate3d(0, 0, 0);
    will-change: transform;
`;

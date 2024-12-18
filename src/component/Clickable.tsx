import { ForwardedRef, forwardRef, useMemo } from 'react';
import styled from 'styled-components';
import {
    IExtendableStyledComponent,
    KeyboardEventListener,
} from '../type/common';
import { userAgent } from '@/util/userAgent';
import { ENTER, onDefaultUIEvent } from '../util/eventKey';
import { UserAgentOS } from '../type/userAgent';
import { ContainerComponent } from '@/type/layout';

export interface ClickableProps
    extends Omit<
            React.ComponentProps<'div'>,
            | 'onClick'
            | 'onMouseEnter'
            | 'onMouseLeave'
            | 'onArrowKeyDown'
            | 'onFocus'
            | 'tabIndex'
        >,
        IExtendableStyledComponent {
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onArrowKeyDown?: KeyboardEventListener;
    onFocus?: (event: React.FocusEvent) => void;
}

function Clickable(
    {
        className,
        children,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onArrowKeyDown,
        onFocus,
        ...rest
    }: ContainerComponent<ClickableProps>,
    ref: ForwardedRef<HTMLDivElement>,
) {
    const enabled = useMemo(() => {
        return userAgent.type !== UserAgentOS.ANDROID;
    }, [userAgent]);

    const handleClick = () => onClick?.();
    const handleMouseEnter = () => onMouseEnter?.();
    const handleMouseLeave = () => onMouseLeave?.();
    const handleFocus = (event: React.FocusEvent) => onFocus?.(event);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.keyCode === ENTER) {
            event.stopPropagation();
            onClick?.();
        } else {
            onArrowKeyDown?.(event);
        }
    };

    return (
        <Container
            className={className}
            onClick={enabled ? onDefaultUIEvent(handleClick) : undefined}
            onMouseEnter={onDefaultUIEvent(handleMouseEnter)}
            onMouseLeave={onDefaultUIEvent(handleMouseLeave)}
            onKeyDown={onDefaultUIEvent(handleKeyDown)}
            onFocus={handleFocus}
            role='button'
            {...rest}
            ref={ref}
        >
            {children}
        </Container>
    );
}

export default forwardRef<HTMLDivElement, ContainerComponent<ClickableProps>>(
    Clickable,
);

const Container = styled.div.attrs({ tabIndex: 0 })`
    :focus {
        outline: none;
    }
`;

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import {
    currentScheduleFocusState,
    LiveScreenOverlayType,
    ScheduleFocusState
} from '@/atom/screen/linear';
import CloseIcon from '@/asset/icClose.svg?react';
import Clickable from '@/component/Clickable';
import { coerceIn } from '@/util/common';
import { DOWN, RIGHT, UP } from '@/util/eventKey';
import { KeyboardEventListener } from '@/type/common';
import useOverlay from '@/feature/screen/linear/hook/useOverlay';

const NavMenu = {
    SCREEN: 0
} as const;
type NavMenu = (typeof NavMenu)[keyof typeof NavMenu];

type MenuItem = {
    type: NavMenu;
    render: () => React.ReactNode;
};

const getIcon = {
    [NavMenu.SCREEN]: {
        src: CloseIcon,
        alt: 'close'
    }
};

const menuList: MenuItem[] = Object.entries(NavMenu).reduce((acc, [, value]) => {
    const icon = getIcon[value];
    const Component = icon.src;
    return [
        ...acc,
        {
            type: value,
            render: () => <Component aria-label={icon.alt} />
        }
    ];
}, [] as MenuItem[]);

export function Nav() {
    const menuRef = useRef<HTMLDivElement[]>([]);

    const [selectedItemIndex, setItemIndex] = useState<number>(NavMenu.SCREEN);
    const [currentScheduleFocus, setScheduleFocus] = useAtom(currentScheduleFocusState);

    const { showOverlay } = useOverlay();

    const getAction = {
        [NavMenu.SCREEN]: () => {
            showOverlay({ type: LiveScreenOverlayType.IDLE });
        }
    };

    const isFocused = useMemo(
        () => currentScheduleFocus === ScheduleFocusState.NAV,
        [currentScheduleFocus]
    );

    const handleKeyDown: KeyboardEventListener = (event) => {
        event.preventDefault();

        const { keyCode } = event;

        if (keyCode === RIGHT) {
            setScheduleFocus(ScheduleFocusState.LISTINGS);
        }

        if (keyCode === UP || keyCode === DOWN) {
            const delta = keyCode === UP ? -1 : 1;
            const targetIndex = coerceIn(selectedItemIndex + delta, 0, menuList.length - 1);
            setItemIndex(targetIndex);
        }
    };

    useEffect(() => {
        if (!isFocused) return;
        menuRef.current[selectedItemIndex]?.focus();
    }, [isFocused, selectedItemIndex]);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (!isFocused) return;

            const delta = event.deltaY < 0 ? -1 : 1;
            const targetIndex = coerceIn(selectedItemIndex + delta, 0, menuList.length - 1);
            setItemIndex(targetIndex);
        };

        window.addEventListener('wheel', handleWheel);
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isFocused]);

    return (
        <NavContainer onKeyDown={handleKeyDown}>
            {menuList.map((menu) => {
                return (
                    <MenuButton
                        key={menu.type}
                        item={menu}
                        onClick={() => getAction[menu.type]()}
                        menuRef={menuRef}
                    />
                );
            })}
        </NavContainer>
    );
}

type Props = {
    item: MenuItem;
    onClick: () => void;
    menuRef: RefObject<HTMLDivElement[]>;
};

function MenuButton({ onClick, item, menuRef }: Props) {
    const callbackRef = useCallback((node: HTMLDivElement) => {
        menuRef.current[item.type] = node;
    }, []);

    return (
        <Button onClick={onClick} ref={callbackRef}>
            {item.render()}
        </Button>
    );
}

// const NavMask = css`
//     position: absolute;
//     top: 0;
//     left: 120rem;
//     width: 32rem;
//     height: 100%;
//     background: linear-gradient(90deg, rgba(0, 0, 0, 0.5), transparent);
// `;

const NavContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 120rem;
    width: 120rem;
    height: 100%;
    align-items: center;
    background: ${({ theme }) => theme.colors.grey90};

    :first-child {
        /* padding-top: 36rem; */
        /* border: 1px solid blue; */
    }

    /* :after {
        content: '';
        z-index: 1;
    } */
`;

const Button = styled(Clickable)`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72rem;
    height: 72rem;
    border-radius: 36rem;
    margin-bottom: 36rem;
    margin-top: 36rem;
    &:hover:not(:focus) {
        background: ${({ theme }) => theme.colors.grey50};
    }

    svg {
        width: 48rem;
        height: 48rem;
        color: ${({ theme }) => theme.colors.grey10};
    }

    &:focus {
        background: ${({ theme }) => theme.colors.main};
        outline: none;

        svg {
            color: ${({ theme }) => theme.colors.grey90};
        }
    }
`;

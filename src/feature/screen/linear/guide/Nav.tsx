import {
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useAtom } from 'jotai';
import CloseIcon from '@/asset/icClose.svg';
import HomeIcon from '@/asset/icHome.svg';
import styled, { css } from 'styled-components';
import Clickable from '@/component/Clickable';
import { KeyboardEventListener } from '@/type/common';
import { coerceIn } from '@/util/common';
import { DOWN, RIGHT, UP } from '@/util/eventKey';
import useOverlay from '../hook/useOverlay';
import { useNavigate } from 'react-router';
import { RoutePath } from '@/type/routePath';
import {
    currentScheduleFocusState,
    LiveScreenOverlayType,
    ScheduleFocusState,
} from '@/atom/screen/linear';

const NavMenu = {
    SCREEN: 0,
    HOME: 1,
} as const;
type NavMenu = (typeof NavMenu)[keyof typeof NavMenu];

type MenuItem = {
    type: NavMenu;
    render: () => React.ReactNode;
};

const getIcon = {
    [NavMenu.SCREEN]: {
        src: CloseIcon,
        alt: 'close',
    },
    [NavMenu.HOME]: {
        src: HomeIcon,
        alt: 'home',
    },
};

const menuList: MenuItem[] = Object.entries(NavMenu).reduce(
    (acc, [, value]) => {
        const icon = getIcon[value];
        const Component = icon.src;
        return [
            ...acc,
            {
                type: value,
                render: () => <Component />,
            },
        ];
    },
    [] as MenuItem[],
);

export function Nav() {
    const menuRef = useRef<HTMLDivElement[]>([]);

    const [selectedItemIndex, setItemIndex] = useState<number>(NavMenu.SCREEN);
    const [currentScheduleFocus, setScheduleFocus] = useAtom(
        currentScheduleFocusState,
    );

    const navigate = useNavigate();
    const { showOverlay, removeOverlay } = useOverlay();

    const getAction = {
        [NavMenu.SCREEN]: () => {
            showOverlay({ type: LiveScreenOverlayType.IDLE });
        },
        [NavMenu.HOME]: () => {
            removeOverlay();
            navigate(RoutePath.HOME);
        },
    };

    const isFocused = useMemo(
        () => currentScheduleFocus === ScheduleFocusState.NAV,
        [currentScheduleFocus],
    );

    const handleKeyDown: KeyboardEventListener = (event) => {
        event.preventDefault();

        const { keyCode } = event;

        if (keyCode === RIGHT) {
            setScheduleFocus(ScheduleFocusState.LISTINGS);
        }

        if (keyCode === UP || keyCode === DOWN) {
            const delta = keyCode === UP ? -1 : 1;
            const targetIndex = coerceIn(
                selectedItemIndex + delta,
                0,
                menuList.length - 1,
            );
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
            const targetIndex = coerceIn(
                selectedItemIndex + delta,
                0,
                menuList.length - 1,
            );
            setItemIndex(targetIndex);
        };

        window.addEventListener('wheel', handleWheel);
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isFocused]);

    return (
        <NavContainer onKeyDown={handleKeyDown}>
            <MenuButton
                key={menuList[0].type}
                item={menuList[0]}
                onClick={() => getAction[menuList[0].type]()}
                menuRef={menuRef}
            />
        </NavContainer>
    );
}

type Props = {
    item: MenuItem;
    onClick: () => void;
    menuRef: MutableRefObject<HTMLDivElement[]>;
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

const NavMask = css`
    position: absolute;
    top: 0;
    left: 120rem;
    width: 32rem;
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.5), transparent);
`;

const NavContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 120rem;
    height: 100%;
    align-items: center;
    background: ${({ theme }) => theme.colors.grey90};

    &:first-child {
        padding-top: 36rem;
    }

    &:after {
        content: '';
        z-index: 1;
        ${NavMask};
    }
`;

const Button = styled(Clickable)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72rem;
    height: 72rem;
    margin-bottom: 36rem;
    border-radius: 36rem;

    svg {
        width: 48rem;
        height: 48rem;
        color: ${({ theme }) => theme.colors.grey10};
    }

    &:hover:not(:focus) {
        background: ${({ theme }) => theme.colors.grey50};
    }

    &:focus {
        background: ${({ theme }) => theme.colors.main};

        svg {
            color: ${({ theme }) => theme.colors.grey90};
        }
    }
`;

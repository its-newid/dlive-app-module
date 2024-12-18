import {
    Children,
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import styled from 'styled-components';
import Clickable, { ClickableProps } from './Clickable';
import { LEFT, onDefaultUIEvent, RIGHT } from '@/util/eventKey';
import { coerceIn } from '@/util/common';
import { Nullable } from '@/type/common';
import { AnimationType, Group } from './anim/Group';
import { IModal } from '@/hook/useModal';

interface ModalTitleProps {
    children?: ReactNode;
}
function ModalTitle({ children }: ModalTitleProps) {
    return <Title>{children}</Title>;
}
const ModalTitleType = (<ModalTitle />).type;
function getModalTitle(children: ReactNode): ReactElement | null {
    const titleChild = Children.toArray(children).find(
        (child): child is ReactElement =>
            isValidElement(child) && child.type === ModalTitleType,
    );
    return titleChild || null;
}

interface ModalDescriptionProps {
    children?: ReactNode;
}
function ModalDescription({ children }: ModalDescriptionProps) {
    return <Description>{children}</Description>;
}
const ModalDescriptionType = (<ModalDescription />).type;
function getModalDescription(children: ReactNode): ReactElement | null {
    const descriptionChild = Children.toArray(children).find(
        (child): child is ReactElement =>
            isValidElement(child) && child.type === ModalDescriptionType,
    );
    return descriptionChild || null;
}

interface ModalButtonProps extends Pick<ClickableProps, 'onClick'> {
    children?: ReactNode;
}
const ModalButton = forwardRef<HTMLDivElement, ModalButtonProps>(
    function ModalButton({ children, onClick }: ModalButtonProps, ref) {
        const { onClose } = useModalContext();

        const handleToggle = () => {
            onClick?.();
            onClose();
        };

        return (
            <Button onClick={handleToggle} ref={ref}>
                {children}
            </Button>
        );
    },
);
const ModalButtonType = (<ModalButton />).type;
function getModalButtons(children: ReactNode): ReactElement[] {
    return Children.toArray(children)
        .filter(
            (child): child is ReactElement =>
                isValidElement(child) && child.type === ModalButtonType,
        )
        .slice(0, 2);
}

interface ModalContextProps extends IModal {
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw 'ModalContext is not provided.';
    }

    return context;
};

interface ModalRootProps {
    children?: ReactNode;
    initialButtonIndex?: number;
    context: IModal;
}

function ModalRoot({
    children,
    initialButtonIndex = -1,
    context,
}: ModalRootProps) {
    const buttonRefs = useRef<Nullable<HTMLDivElement>[]>([]);

    const [selectedIndex, setSelectedIndex] = useState(initialButtonIndex);
    const { isOpen } = context;

    const providerValue = {
        selectedIndex,
        setSelectedIndex,
        ...context,
    };

    const modalTitle = getModalTitle(children);
    const modalDescription = getModalDescription(children);
    const modalButtons = getModalButtons(children);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!modalButtons?.length) return;

        const { keyCode } = event;
        if ([LEFT, RIGHT].includes(keyCode)) {
            const delta = keyCode === LEFT ? -1 : 1;

            setSelectedIndex((prevState) =>
                coerceIn(prevState + delta, 0, modalButtons.length - 1),
            );
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        buttonRefs.current[selectedIndex]?.focus();
    }, [selectedIndex, isOpen]);

    useEffect(() => {
        return () => {
            !isOpen && setSelectedIndex(initialButtonIndex);
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <ModalContext.Provider value={providerValue}>
            <Container onKeyDown={onDefaultUIEvent(handleKeyDown)}>
                <Inner>
                    <MessageContainer id={'modal-msg'}>
                        {modalTitle}
                        {modalDescription}
                    </MessageContainer>
                    {modalButtons.length && (
                        <ButtonContainer>
                            {modalButtons.map((button, index) =>
                                cloneElement(button, {
                                    key: index,
                                    ref: (el: HTMLDivElement) =>
                                        (buttonRefs.current[index] = el),
                                } as ModalButtonProps),
                            )}
                        </ButtonContainer>
                    )}
                </Inner>
            </Container>
        </ModalContext.Provider>
    );
}

export const Modal = Object.assign(ModalRoot, {
    Title: ModalTitle,
    Description: ModalDescription,
    Button: ModalButton,
});

const Container = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(27, 28, 29, 0.4) 0.01%,
        rgba(27, 28, 29, 0.3) 0.02%,
        #000000 70.83%
    );
    animation: ${Group[AnimationType.FADE_IN]} 300ms ease-out;
`;

const Inner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
`;

const Title = styled.span`
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 36rem/44rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha89};
    width: 100%;
`;

const Description = styled.span`
    width: 100%;
    padding-top: 8rem;
    font: ${({ theme }) =>
        `${theme.fonts.weight.normal} 28rem/36rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha64};
`;

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 1184rem;
    margin-right: auto;
    margin-bottom: 66rem;
    margin-left: 186rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    margin-right: 128rem;
    margin-bottom: 112rem;
`;

const Button = styled(Clickable)`
    width: fit-content;
    padding: 14rem 30rem;
    border-radius: 37rem;
    outline: none;
    align-self: center;
    color: ${({ theme }) => theme.colors.whiteAlpha95};
    background: ${({ theme }) => theme.colors.transparent};

    :focus {
        color: ${({ theme }) => theme.colors.grey90};
        background: ${({ theme }) => theme.colors.main};
    }

    :hover:not(:focus) {
        color: ${({ theme }) => theme.colors.whiteAlpha95};
        background: ${({ theme }) => theme.colors.grey50};
    }

    :first-child {
        margin-right: 16em;
    }

    span {
        font-size: 30rem;
        font-family: ${({ theme }) => theme.fonts.family.pretendard};
        font-weight: ${({ theme }) => theme.fonts.weight.bold};
    }
`;

import styled, { css } from 'styled-components';
import { KeyboardEventHandler } from 'react';
import { SingleLineEllipsis } from '../../../../component/SingleLineEllipsis';
import { MouseEventListener } from '../../../../type/common';

export const RowState = {
    IDLE: 'idle',
    SELECTED: 'selected',
    FOCUSED: 'focused',
    SELECTED_AND_FOCUSED: 'selectedAndFocused'
} as const;
export type RowState = (typeof RowState)[keyof typeof RowState];

type EpisodeCellStyleProps = {
    states: RowState[];
    width: string;
};

export type EpisodeCellEventProps = {
    onFocus?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
};

export type EpisodeCellProps = EpisodeCellStyleProps &
    EpisodeCellEventProps & {
        title: string;
    };

export const rowStyle = (states: RowState[]) => {
    if (states.some((state) => state === RowState.FOCUSED)) {
        return {
            backgroundColor: css`
                background-color: ${({ theme }) => theme.colors.grey70};
            `
        };
    } else {
        return {
            backgroundColor: css`
                background-color: ${({ theme }) => theme.colors.grey80};
            `
        };
    }
};

export default function EpisodeCell({ states, width, title, onClick, ...rest }: EpisodeCellProps) {
    const handleClick: MouseEventListener = (event) => {
        event.preventDefault();
        onClick?.();
    };

    return (
        <Container
            role={'button'}
            width={width}
            states={states}
            {...rest}
            onClick={handleClick}
            aria-describedby={'ep-desc ep-time'}
        >
            <Title states={states}>{title}</Title>
        </Container>
    );
}

const Container = styled.div.attrs<EpisodeCellStyleProps>((props) => ({
    tabIndex: 0,
    style: {
        width: `${props.width}`,
        maxWidth: `${props.width}`
    }
}))<EpisodeCellStyleProps>`
    margin: 10rem 8rem 10rem 0;
    border-radius: 16rem;
    ${({ states }) => rowStyle(states).backgroundColor};
    overflow: hidden;

    &:hover:not(:focus) {
        outline: none;
        background: ${({ theme }) => theme.colors.grey50};
    }

    &:focus {
        outline: none;
        background: ${({ theme }) => theme.colors.main};

        span {
            color: ${({ theme }) => theme.colors.grey90};
            font-weight: ${({ theme }) => theme.fonts.weight.bold};
        }
    }
`;

const Title = styled(SingleLineEllipsis)<{ states: RowState[] }>`
    display: inline-block;
    width: 100%;
    height: 36rem;
    padding: 27rem 32rem;
    border-radius: 16rem;
    font-size: 28rem;
    font-family: ${({ theme }) => theme.fonts.family.pretendard};
    color: ${({ theme }) => theme.colors.whiteAlpha95};
`;

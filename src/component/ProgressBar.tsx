import styled from 'styled-components';
import { useProgress } from '@/hook/useProgress';
import { IExtendableStyledComponent } from '@/type/common';

export type TimeRange = {
    start: number;
    end: number;
    duration?: number;
};

export type ProgressBarProps = IExtendableStyledComponent & {
    timeRange: TimeRange;
};

export function ProgressBar({ timeRange, ...rest }: ProgressBarProps) {
    const { value, max } = useProgress({
        timeRange,
    });
    return <SimpleProgressBar value={value} max={max} {...rest} />;
}

export type SimpleProgressBarProps = {
    max: number;
    value: number;
};

export function SimpleProgressBar({ ...rest }: SimpleProgressBarProps) {
    return <StyledProgressBar {...rest} />;
}

const StyledProgressBar = styled.progress`
    width: 100%;
    height: 8rem;

    appearance: none;
    -webkit-appearance: none;
    &::-webkit-progress-bar {
        background: rgba(255, 255, 255, 0.25);
    }
    &::-webkit-progress-value {
        background: ${({ theme }) => theme.colors.main2};
    }
`;

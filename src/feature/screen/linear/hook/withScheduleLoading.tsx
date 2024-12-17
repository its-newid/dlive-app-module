import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { LoadingSpinner } from '@/component/LoadingSpinner';
import { scheduleEnabledState } from '@/atom/screen';

export const withScheduleLoading = (WrappedComponent: React.ComponentType) => {
    return function Component() {
        const scheduleEnabled = useAtomValue(scheduleEnabledState);

        useEffect(() => {
            if (!scheduleEnabled) return;

            const handleClick = (event: MouseEvent) => event.stopPropagation();
            const handleDown = (event: KeyboardEvent) =>
                event.stopPropagation();
            window.addEventListener('mousedown', handleClick, true);
            window.addEventListener('keydown', handleDown, true);
            return () => {
                window.removeEventListener('mousedown', handleClick, true);
                window.removeEventListener('keydown', handleDown, true);
            };
        }, [scheduleEnabled]);

        return (
            <Container>
                <WrappedComponent />
                {scheduleEnabled && <Loader />}
            </Container>
        );
    };
};

const Container = styled.div`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const Loader = styled(LoadingSpinner)`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.grey70};
    z-index: 999;
`;

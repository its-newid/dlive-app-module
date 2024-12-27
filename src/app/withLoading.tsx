import React from 'react';
import { ErrorPage } from '@/component/ErrorPage';
import { LoadingSpinner } from '@/component/LoadingSpinner';
import styled from 'styled-components';
import { useGetSchedule } from '@/api/scheduleQuery.ts';
import { useDetectOnline } from '@/hook/useDetectOnline.ts';
import { NetworkErrorPage } from '@/app/NetworkErrorPage.tsx';

export const withLoading = (WrappedComponent: React.ComponentType) => {
    return function Component() {
        const { isOnline, setOnline } = useDetectOnline();
        const { isLoading, isError } = useGetSchedule();

        return isOnline ? (
            isError ? (
                <ErrorPage />
            ) : isLoading ? (
                <Loader />
            ) : (
                <WrappedComponent />
            )
        ) : (
            <NetworkErrorPage onConnected={setOnline} />
        );
    };
};

export default withLoading;

const Loader = styled(LoadingSpinner)`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.grey70};
    z-index: 999;
`;

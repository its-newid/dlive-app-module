import React from 'react';
import { ErrorPage } from '@/component/ErrorPage';
import { LoadingSpinner } from '../component/LoadingSpinner';
import styled from 'styled-components';
import { useGetSchedule } from '@/api/scheduleQuery.ts';

export const withLoading = (WrappedComponent: React.ComponentType) => {
    return function Component() {
        const { isLoading, isError } = useGetSchedule();

        return isError ? <ErrorPage /> : isLoading ? <Loader /> : <WrappedComponent />;
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

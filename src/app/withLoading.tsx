import React from 'react';
import { ErrorPage } from '@/component/ErrorPage';
import { LoadingSpinner } from '@/component/LoadingSpinner';
import styled from 'styled-components';
import { useGetSchedule } from '@/api/scheduleQuery.ts';
import { useDetectOnline } from '@/hook/useDetectOnline.ts';
import { NetworkErrorPage } from '@/app/NetworkErrorPage.tsx';
import { getLocale } from '@/util/getLocale.ts';

export const withLoading = (WrappedComponent: React.ComponentType) => {
    return function Component() {
        const locale = getLocale();
        const { isOnline, setOnline } = useDetectOnline();

        if (locale !== 'kr') {
            return <ErrorPage />;
        }

        // 데이터 받기 이전에 국가제한을 해야 하므로 조건부로 hook을 호출되면 안된다는 규칙 무시
        // eslint-disable-next-line react-hooks/rules-of-hooks
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

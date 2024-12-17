import styled, { ThemeProvider } from 'styled-components';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/util/i18n';
import Navigation from '@/app/Router';
import GlobalStyle from '@/style/GlobalStyle';
import { theme } from '@/style/theme';
import { useSetAtom } from 'jotai';
import { isFirstLaunchState } from '@/atom/app.ts';
import { CDN_URL, ENV_MODE, EnvType } from '@/app/environment.ts';
import { useEffect } from 'react';

export const defaultQueryConfig = {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    structuralSharing: true,
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: defaultQueryConfig,
    },
});

function App() {
    // const setIsFirstLaunch = useSetAtom(isFirstLaunchState);
    // useEffect(() => {
    //     if (ENV_MODE !== EnvType.PROD) {
    //         setIsFirstLaunch(true);
    //     }
    // }, []);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => event.preventDefault();
        window.addEventListener('mousedown', handleClick);
        return () => {
            window.removeEventListener('mousedown', handleClick);
        };
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <GlobalStyle theme={theme} cdnUrl={CDN_URL} />
                    <Navigation />
                    {ENV_MODE !== EnvType.PROD && (
                        <DevToolsContainer>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </DevToolsContainer>
                    )}
                </ThemeProvider>
            </QueryClientProvider>
        </I18nextProvider>
    );
}

export default App;

const DevToolsContainer = styled.div`
    font-size: initial;
`;

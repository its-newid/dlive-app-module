import { ThemeProvider } from 'styled-components';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/util/i18n';
import Navigation from '@/app/Router';
import GlobalStyle from '@/style/GlobalStyle';
import { theme } from '@/style/theme';

const queryClient = new QueryClient();

function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <GlobalStyle />
                    <Navigation />
                    <ReactQueryDevtools initialIsOpen={false} />
                </ThemeProvider>
            </QueryClientProvider>
        </I18nextProvider>
    );
}

export default App;

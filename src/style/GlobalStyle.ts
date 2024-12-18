import { createGlobalStyle } from 'styled-components';
import { reset } from '@/style/reset';

const cdnUrl = import.meta.env.VITE_CDN_URL || '';

const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    user-select: none;
  }

  html {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.grey70};
    font-size: 0.0926vh;
  }

  body {
    position: relative;
    height: 100vh;
    width: 177.778vh;
    margin: 0 auto;
    overflow: hidden;
  }

  html,
  body {
    ${({ theme }) => {
        return `
            body {
                font-family: ${theme.fonts.family.pretendard};
                font-weight: ${theme.fonts.weight.normal};
            }
        `;
    }}
  }

  p {
    margin: 0;
  }

  div {
    box-sizing: border-box;
  }

  @font-face {
    font-family: 'pretendard';
    font-style: normal;
    font-weight: normal;
    src: url('${cdnUrl}/font/pretendard_regular_subset.woff2') format('woff2');
  }

  @font-face {
    font-family: 'pretendard';
    font-style: normal;
    font-weight: bold;
    src: url('${cdnUrl}/font/pretendard_bold_subset.woff2') format('woff2');
  }
`;

export default GlobalStyle;

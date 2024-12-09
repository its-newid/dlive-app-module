import { createGlobalStyle } from 'styled-components';
import { reset } from '@/style/reset';

const cdnUrl = import.meta.env.VITE_CDN_URL || '';

const GlobalStyle = createGlobalStyle`
  ${reset}

  :root {
    // 화면 크기에 따라 스케일을 계산
    --scale: min(
      calc(100vw / 1920), // 가로 비율
      calc(100vh / 1080)  // 세로 비율
    );
  }

  * {
    user-select: none; // 모든 요소에서 텍스트 선택 비활성화
  }

  html, body {
    font-family: ${({ theme }) => theme.fonts.family.pretendard};
    font-weight: ${({ theme }) => theme.fonts.weight.normal};
    position: fixed;  // 고정 위치로 설정
    top: 0;           // 상단에 위치
    left: 0;          // 좌측에 위치
    width: 1920px;    // 고정 너비
    height: 1080px;   // 고정 높이
    overflow: hidden; // 스크롤 숨김
    transform: scale(var(--scale)); // 스케일 적용
    transform-origin: 0 0; // 스케일 기준을 좌측 상단으로 설정
    font-size: calc(1px * var(--scale)); // 스케일에 따라 폰트 크기 조정
  }

  #root {
    width: 100%;
    height: 100%;
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

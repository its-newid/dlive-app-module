import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import * as tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
    {
        files: ['**/*.{ts,tsx,js,jsx}'], // 모든 TypeScript와 JavaScript 파일에 적용
        languageOptions: {
            ecmaVersion: 'latest', // 최신 ECMAScript 문법 사용
            sourceType: 'module', // ES 모듈 시스템 사용
            parser: tseslint.parser, // TypeScript 파서 사용
            globals: {
                ...globals.browser, // 브라우저 전역 변수 허용
            },
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'], // TypeScript 설정 파일 위치
                tsconfigRootDir: import.meta.dirname, // TypeScript 설정 파일의 루트 디렉토리
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin, // TypeScript 관련 규칙
            react: reactPlugin, // React 관련 규칙
            'react-hooks': reactHooks, // React Hooks 규칙
            'react-refresh': reactRefresh, // Fast Refresh 관련 규칙
            prettier: prettierPlugin, // Prettier 통합
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        extends: [
            js.configs.recommended, // JavaScript 기본 추천 규칙
            ...tseslint.configs.recommendedTypeChecked, // TypeScript 타입 검사 규칙
            ...tseslint.configs.stylisticTypeChecked, // TypeScript 스타일 규칙
        ],
        rules: {
            'prettier/prettier': 'error', // Prettier 규칙 위반시 에러
            'react/prop-types': 'off', // TypeScript를 사용하므로 prop-types 비활성화
            ...reactHooks.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules, // React 추천 규칙 추가
            ...reactPlugin.configs['jsx-runtime'].rules, // JSX 런타임 규칙 추가
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true }, // Fast Refresh 관련 경고 설정
            ],
        },
    },
    {
        files: ['*.js', '*.jsx'], // JavaScript 파일에만 적용
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off', // JS 파일에서는 명시적 반환 타입 불필요
        },
    },
);

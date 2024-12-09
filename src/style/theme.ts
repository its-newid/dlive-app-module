import { DefaultTheme } from 'styled-components';

const colors = {
    main: '#d3f47c',
    main2: '#f24684',

    whiteAlpha100: '#ffffff',
    whiteAlpha95: 'rgba(255, 255, 255, 0.95)',
    whiteAlpha89: 'rgba(255, 255, 255, 0.89)',
    whiteAlpha77: 'rgba(255, 255, 255, 0.77)',
    whiteAlpha64: 'rgba(255, 255, 255, 0.64)',
    whiteAlpha60: 'rgba(255, 255, 255, 0.60)',
    whiteAlpha50: 'rgba(255, 255, 255, 0.50)',
    whiteAlpha40: 'rgba(255, 255, 255, 0.40)',
    whiteAlpha37: 'rgba(255, 255, 255, 0.37)',
    whiteAlpha25: 'rgba(255, 255, 255, 0.25)',
    whiteAlpha15: 'rgba(255, 255, 255, 0.15)',
    whiteAlpha10: 'rgba(255, 255, 255, 0.10)',
    whiteAlpha5: 'rgba(255, 255, 255, 0.05)',

    blackAlpha100: '#000000',

    grey5: '#fafafa',
    grey10: '#f2f2f2',
    grey20: '#e5e5e6',
    grey30: '#cbcbcd',
    grey40: '#adadae',
    grey50: '#8e8e90',
    grey60: '#707071',
    grey70: '#515152',
    grey80: '#2d2d2e',
    grey90: '#1c1c1c',

    transparent: 'transparent'
};

const fonts = {
    family: {
        pretendard: 'pretendard'
    },

    weight: {
        light: 100,
        normal: 400,
        medium: 500,
        bold: 700
    }
};

const toBlack = 'brightness(0) saturate(100%)';
const filters = {
    grey0: `${toBlack} invert(100%) sepia(0%) saturate(7500%) hue-rotate(196deg) brightness(100%) contrast(103%)`,
    grey80: `${toBlack} invert(14%) sepia(0%) saturate(804%) hue-rotate(67deg) brightness(105%) contrast(92%)`,
    grey90: `${toBlack} invert(0%) sepia(9%) saturate(1145%) hue-rotate(330deg) brightness(103%) contrast(78%)`,
    grey100: `${toBlack} invert(0%) sepia(90%) saturate(7460%) hue-rotate(79deg) brightness(87%) contrast(110%)`
};

export const theme: DefaultTheme = {
    colors,
    fonts,
    filters
};

export type ColorTypes = typeof colors;
export type FontTypes = typeof fonts;
export type FilterTypes = typeof filters;

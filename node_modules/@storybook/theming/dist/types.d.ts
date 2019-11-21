import { easing, animation } from './animation';
import { color, background, typography } from './base';
export interface ThemeVars {
    base: 'light' | 'dark';
    colorPrimary?: string;
    colorSecondary?: string;
    appBg?: string;
    appContentBg?: string;
    appBorderColor?: string;
    appBorderRadius?: number;
    fontBase?: string;
    fontCode?: string;
    textColor?: string;
    textInverseColor?: string;
    barTextColor?: string;
    barSelectedColor?: string;
    barBg?: string;
    inputBg?: string;
    inputBorder?: string;
    inputTextColor?: string;
    inputBorderRadius?: number;
    brandTitle?: string;
    brandUrl?: string;
    brandImage?: string;
    gridCellSize?: number;
}
export declare type Color = typeof color;
export declare type Background = typeof background;
export declare type Typography = typeof typography;
export declare type Animation = typeof animation;
export declare type Easing = typeof easing;
export declare type TextSize = number | string;
export interface Brand {
    title: string | undefined;
    url: string | null | undefined;
    image: string | null | undefined;
}
export interface Theme {
    color: Color;
    background: Background;
    typography: Typography;
    animation: Animation;
    easing: Easing;
    input: {
        border: string;
        background: string;
        color: string;
        borderRadius: number;
    };
    layoutMargin: number;
    appBorderColor: string;
    appBorderRadius: number;
    barTextColor: string;
    barSelectedColor: string;
    barBg: string;
    brand: Brand;
    code: {
        [key: string]: string | object;
    };
    [key: string]: any;
}

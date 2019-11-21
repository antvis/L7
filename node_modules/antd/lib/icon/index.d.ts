import * as React from 'react';
import createFromIconfontCN from './IconFont';
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
declare function unstable_ChangeThemeOfIconsDangerously(theme?: ThemeType): void;
declare function unstable_ChangeDefaultThemeOfIcons(theme: ThemeType): void;
export interface TransferLocale {
    icon: string;
}
export interface CustomIconComponentProps {
    width: string | number;
    height: string | number;
    fill: string;
    viewBox?: string;
    className?: string;
    style?: React.CSSProperties;
    spin?: boolean;
    rotate?: number;
    ['aria-hidden']?: React.AriaAttributes['aria-hidden'];
}
export declare type ThemeType = 'filled' | 'outlined' | 'twoTone';
export interface IconProps {
    tabIndex?: number;
    type?: string;
    className?: string;
    theme?: ThemeType;
    title?: string;
    onKeyUp?: React.KeyboardEventHandler<HTMLElement>;
    onClick?: React.MouseEventHandler<HTMLElement>;
    component?: React.ComponentType<CustomIconComponentProps>;
    twoToneColor?: string;
    viewBox?: string;
    spin?: boolean;
    rotate?: number;
    style?: React.CSSProperties;
    prefixCls?: string;
    role?: string;
}
export interface IconComponent<P> extends React.SFC<P> {
    createFromIconfontCN: typeof createFromIconfontCN;
    getTwoToneColor: typeof getTwoToneColor;
    setTwoToneColor: typeof setTwoToneColor;
    unstable_ChangeThemeOfIconsDangerously?: typeof unstable_ChangeThemeOfIconsDangerously;
    unstable_ChangeDefaultThemeOfIcons?: typeof unstable_ChangeDefaultThemeOfIcons;
}
declare const Icon: IconComponent<IconProps>;
export default Icon;

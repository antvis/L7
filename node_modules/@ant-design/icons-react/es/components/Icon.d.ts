import { IconDefinition } from '@ant-design/icons/lib/types';
import * as React from 'react';
import { MiniMap } from '../utils';
export interface IconProps {
    type: string | IconDefinition;
    className?: string;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
    style?: React.CSSProperties;
    primaryColor?: string;
    secondaryColor?: string;
    focusable?: string;
}
export interface TwoToneColorPaletteSetter {
    primaryColor: string;
    secondaryColor?: string;
}
export interface TwoToneColorPalette extends TwoToneColorPaletteSetter {
    secondaryColor: string;
}
declare class Icon extends React.Component<IconProps> {
    static displayName: string;
    static definitions: MiniMap<IconDefinition>;
    static add(...icons: IconDefinition[]): void;
    static clear(): void;
    static get(key?: string, colors?: TwoToneColorPalette): IconDefinition | undefined;
    static setTwoToneColors({ primaryColor, secondaryColor }: TwoToneColorPaletteSetter): void;
    static getTwoToneColors(): TwoToneColorPalette;
    render(): any;
}
export default Icon;

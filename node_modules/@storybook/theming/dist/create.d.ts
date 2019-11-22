import { ThemeVars } from './types';
export declare const themes: {
    light: ThemeVars;
    dark: ThemeVars;
    normal: ThemeVars;
};
interface Rest {
    [key: string]: any;
}
export declare const create: (vars?: ThemeVars, rest?: Rest) => ThemeVars;
export {};

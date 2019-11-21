export declare type MenuTheme = 'light' | 'dark';
export interface MenuContextProps {
    inlineCollapsed: boolean;
    antdMenuTheme?: MenuTheme;
}
declare const MenuContext: import("@ant-design/create-react-context").Context<MenuContextProps>;
export default MenuContext;

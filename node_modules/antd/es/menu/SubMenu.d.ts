import * as React from 'react';
import * as PropTypes from 'prop-types';
interface TitleEventEntity {
    key: string;
    domEvent: Event;
}
export interface SubMenuProps {
    rootPrefixCls?: string;
    className?: string;
    disabled?: boolean;
    title?: React.ReactNode;
    style?: React.CSSProperties;
    onTitleClick?: (e: TitleEventEntity) => void;
    onTitleMouseEnter?: (e: TitleEventEntity) => void;
    onTitleMouseLeave?: (e: TitleEventEntity) => void;
    popupOffset?: [number, number];
    popupClassName?: string;
}
declare class SubMenu extends React.Component<SubMenuProps, any> {
    static contextTypes: {
        antdMenuTheme: PropTypes.Requireable<string>;
    };
    static isSubMenu: number;
    private subMenu;
    onKeyDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    saveSubMenu: (subMenu: any) => void;
    render(): JSX.Element;
}
export default SubMenu;

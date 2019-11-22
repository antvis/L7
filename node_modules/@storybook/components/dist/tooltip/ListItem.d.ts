import { FunctionComponent, ReactNode } from 'react';
export interface TitleProps {
    active?: boolean;
    loading?: boolean;
    disabled?: boolean;
}
export interface RightProps {
    active?: boolean;
}
export interface CenterTextProps {
    active?: boolean;
    disabled?: boolean;
}
export interface LeftProps {
    active?: boolean;
}
export interface ItemProps {
    disabled?: boolean;
}
export declare type LinkWrapperType = FunctionComponent;
export interface ListItemProps {
    loading?: boolean;
    left?: ReactNode;
    title?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    active?: boolean;
    disabled?: boolean;
    href?: string | object;
    LinkWrapper?: LinkWrapperType;
    onClick?: () => void;
}
declare const ListItem: FunctionComponent<ListItemProps>;
export default ListItem;

import { FunctionComponent } from 'react';
import { LinkWrapperType, ListItemProps } from './ListItem';
export interface Link extends ListItemProps {
    id: string;
    isGatsby?: boolean;
}
export interface TooltipLinkListProps {
    links: Link[];
    LinkWrapper?: LinkWrapperType;
}
export declare const TooltipLinkList: FunctionComponent<TooltipLinkListProps>;

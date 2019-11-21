import * as React from 'react';
export interface PaginationProps {
    total?: number;
    defaultCurrent?: number;
    disabled?: boolean;
    current?: number;
    defaultPageSize?: number;
    pageSize?: number;
    onChange?: (page: number, pageSize?: number) => void;
    hideOnSinglePage?: boolean;
    showSizeChanger?: boolean;
    pageSizeOptions?: string[];
    onShowSizeChange?: (current: number, size: number) => void;
    showQuickJumper?: boolean | {
        goButton?: React.ReactNode;
    };
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
    size?: string;
    simple?: boolean;
    style?: React.CSSProperties;
    locale?: Object;
    className?: string;
    prefixCls?: string;
    selectPrefixCls?: string;
    itemRender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement: React.ReactElement<HTMLElement>) => React.ReactNode;
    role?: string;
    showLessItems?: boolean;
}
export interface PaginationConfig extends PaginationProps {
    position?: 'top' | 'bottom' | 'both';
}
export declare type PaginationLocale = any;
export default class Pagination extends React.Component<PaginationProps, {}> {
    getIconsProps: (prefixCls: string) => {
        prevIcon: JSX.Element;
        nextIcon: JSX.Element;
        jumpPrevIcon: JSX.Element;
        jumpNextIcon: JSX.Element;
    };
    renderPagination: (contextLocale: any) => JSX.Element;
    render(): JSX.Element;
}

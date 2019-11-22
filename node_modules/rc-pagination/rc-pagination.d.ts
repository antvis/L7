declare module 'rc-pagination' {
  export interface PaginationData {
    className: string;
    selectPrefixCls: string;
    prefixCls: string;
    pageSizeOptions: string[];

    current: number;
    defaultCurrent: number;
    total: number;
    pageSize: number;
    defaultPageSize: number;

    hideOnSinglePage: boolean;
    showSizeChanger: boolean;
    showLessItems: boolean;
    showPrevNextJumpers: boolean;
    showQuickJumper: boolean | object;
    showTitle: boolean;

    locale: object;

    style: React.CSSProperties;

    selectComponentClass: React.ComponentType;
    prevIcon: React.ComponentType | React.ReactNode;
    nextIcon: React.ComponentType | React.ReactNode;
    jumpPrevIcon: React.ComponentType | React.ReactNode;
    jumpNextIcon: React.ComponentType | React.ReactNode;
  }

  export interface PaginationProps extends Partial<PaginationData> {
    onChange?: (page: number, pageSize: number) => void;
    onShowSizeChange?: (current: number, size: number) => void;
    itemRender?: (page: number, type: string, element: React.ReactNode) => React.ReactNode;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  }

  export default class Pagination extends React.Component<PaginationProps> { }
}

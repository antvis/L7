export declare const INTERNAL_COL_DEFINE = "RC_TABLE_INTERNAL_COL_DEFINE";
export declare function measureScrollbar({ direction, prefixCls, }: {
    direction: 'horizontal' | 'vertical';
    prefixCls?: string;
}): number;
export declare function debounce(func: Function, wait: number, immediate?: boolean): {
    (...args: any[]): void;
    cancel(): void;
};
export declare function remove<T>(array: T[], item: T): T[];
/**
 * Returns only data- and aria- key/value pairs
 * @param {object} props
 */
export declare function getDataAndAriaProps(props: object): {};

import * as React from 'react';
import { ColumnFilterItem } from './interface';
export declare function flatArray(data?: any[], childrenName?: string): any[];
export declare function treeMap<Node>(tree: Node[], mapper: (node: Node, index: number) => any, childrenName?: string): any[];
export declare function flatFilter(tree: any[], callback: Function): any;
export declare function normalizeColumns(elements: React.ReactChildren): any[];
export declare function generateValueMaps(items?: ColumnFilterItem[], maps?: {
    [name: string]: any;
}): {
    [name: string]: any;
};

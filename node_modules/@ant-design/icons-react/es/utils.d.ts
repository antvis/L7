import { AbstractNode, IconDefinition } from '@ant-design/icons/lib/types';
export declare function log(message: string): void;
export declare function isIconDefinition(target: any): target is IconDefinition;
export declare function normalizeAttrs(attrs?: Attrs): Attrs;
export interface Attrs {
    [key: string]: string;
}
export declare class MiniMap<V> {
    readonly size: number;
    private collection;
    clear(): void;
    delete(key: string): boolean;
    get(key: string): V | undefined;
    has(key: string): boolean;
    set(key: string, value: V): this;
}
export declare function generate(node: AbstractNode, key: string, rootProps?: {
    [key: string]: any;
} | false): any;
export declare function getSecondaryColor(primaryColor: string): string;
export declare function withSuffix(name: string, theme: 'fill' | 'outline' | 'twotone'): string;

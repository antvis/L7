import React from 'react';
import { TreeNodeProps } from './TreeNode';
import { NodeElement, Key, DataNode, Entity } from './interface';
import { TreeProps } from './Tree';
export declare function warnOnlyTreeNode(): void;
export declare function arrDel(list: Key[], value: Key): (string | number)[];
export declare function arrAdd(list: Key[], value: Key): (string | number)[];
export declare function posToArr(pos: string): string[];
export declare function getPosition(level: string | number, index: number): string;
export declare function isTreeNode(node: NodeElement): boolean;
export declare function getNodeChildren(children: React.ReactNode): any;
export declare function isCheckDisabled(node: NodeElement): boolean;
export declare function traverseTreeNodes(treeNodes: NodeElement[], callback: (data: {
    node: NodeElement;
    index: number;
    pos: string | number;
    key: Key;
    parentPos: string | number;
}) => void): void;
/**
 * Use `rc-util` `toArray` to get the children list which keeps the key.
 * And return single node if children is only one(This can avoid `key` missing check).
 */
export declare function mapChildren(children: React.ReactNode, func: (node: NodeElement, index: number) => React.ReactElement): any;
export declare function getDragNodesKeys(treeNodes: NodeElement[], node: NodeElement): any[];
export declare function calcDropPosition(event: React.MouseEvent, treeNode: NodeElement): 1 | 0 | -1;
/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
export declare function calcSelectedKeys(selectedKeys: Key[], props: TreeProps): (string | number)[];
export declare function convertDataToTree(treeData: DataNode[], processor?: {
    processProps: (prop: DataNode) => any;
}): React.ReactNode;
interface Wrapper {
    posEntities: Record<string, Entity>;
    keyEntities: Record<Key, Entity>;
}
/**
 * Calculate treeNodes entities. `processTreeEntity` is used for `rc-tree-select`
 * @param treeNodes
 * @param processTreeEntity  User can customize the entity
 */
export declare function convertTreeToEntities(treeNodes: NodeElement[], { initWrapper, processEntity, onProcessFinished, }?: {
    initWrapper?: (wrapper: Wrapper) => Wrapper;
    processEntity?: (entity: Entity, wrapper: Wrapper) => void;
    onProcessFinished?: (wrapper: Wrapper) => void;
}): {
    posEntities: {};
    keyEntities: {};
};
/**
 * Parse `checkedKeys` to { checkedKeys, halfCheckedKeys } style
 */
export declare function parseCheckedKeys(keys: Key[] | {
    checked: Key[];
    halfChecked: Key[];
}): any;
/**
 * Conduct check state by the keyList. It will conduct up & from the provided key.
 * If the conduct path reach the disabled or already checked / unchecked node will stop conduct.
 */
export declare function conductCheck(
/** list of keys */
keyList: Key[], 
/** is check the node or not */
isCheck: boolean, 
/** parsed by `convertTreeToEntities` function in Tree */
keyEntities: Record<Key, Entity>, 
/** Can pass current checked status for process (usually for uncheck operation) */
checkStatus?: {
    checkedKeys?: Key[];
    halfCheckedKeys?: Key[];
}): {
    checkedKeys: any[];
    halfCheckedKeys: any[];
};
/**
 * If user use `autoExpandParent` we should get the list of parent node
 * @param keyList
 * @param keyEntities
 */
export declare function conductExpandParent(keyList: Key[], keyEntities: Record<Key, Entity>): string[];
/**
 * Returns only the data- and aria- key/value pairs
 */
export declare function getDataAndAria(props: Partial<TreeProps | TreeNodeProps>): {};
export {};

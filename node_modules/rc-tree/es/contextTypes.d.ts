/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */
import * as React from 'react';
import { Context } from '@ant-design/create-react-context';
import { IconType, NodeElement, Key } from './interface';
import { InternalTreeNodeProps, TreeNodeProps } from './TreeNode';
declare type NodeMouseEventHandler = (e: MouseEvent, node: React.Component<InternalTreeNodeProps>) => void;
export interface TreeContextProps {
    prefixCls: string;
    selectable: boolean;
    showIcon: boolean;
    icon: IconType;
    switcherIcon: IconType;
    draggable: boolean;
    checkable: boolean | React.ReactNode;
    checkStrictly: boolean;
    disabled: boolean;
    motion: any;
    loadData: (treeNode: NodeElement) => Promise<void>;
    filterTreeNode: (treeNode: React.Component<TreeNodeProps>) => boolean;
    renderTreeNode: (child: React.ReactElement, index: number, pos: number | string) => React.ReactElement;
    isKeyChecked: (key: Key) => boolean;
    onNodeClick: NodeMouseEventHandler;
    onNodeDoubleClick: NodeMouseEventHandler;
    onNodeExpand: NodeMouseEventHandler;
    onNodeSelect: NodeMouseEventHandler;
    onNodeCheck: (e: MouseEvent, treeNode: React.Component<InternalTreeNodeProps>, checked: boolean) => void;
    onNodeLoad: (treeNode: React.Component<InternalTreeNodeProps>) => void;
    onNodeMouseEnter: NodeMouseEventHandler;
    onNodeMouseLeave: NodeMouseEventHandler;
    onNodeContextMenu: NodeMouseEventHandler;
    onNodeDragStart: NodeMouseEventHandler;
    onNodeDragEnter: NodeMouseEventHandler;
    onNodeDragOver: NodeMouseEventHandler;
    onNodeDragLeave: NodeMouseEventHandler;
    onNodeDragEnd: NodeMouseEventHandler;
    onNodeDrop: NodeMouseEventHandler;
    registerTreeNode: (key: Key, node: React.Component<InternalTreeNodeProps>) => void;
}
export declare const TreeContext: Context<TreeContextProps | null>;
export {};

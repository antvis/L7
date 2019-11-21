import * as React from 'react';
import PropTypes from 'prop-types';
import { DataNode, IconType, Key, NodeElement, Entity } from './interface';
import { TreeNodeProps } from './TreeNode';
interface CheckInfo {
    event: 'check';
    node: NodeElement;
    checked: boolean;
    nativeEvent: MouseEvent;
    checkedNodes: NodeElement[];
    checkedNodesPositions?: {
        node: NodeElement;
        pos: string;
    }[];
    halfCheckedKeys?: Key[];
}
export interface TreeProps {
    prefixCls: string;
    className?: string;
    style?: React.CSSProperties;
    tabIndex?: number;
    children?: React.ReactNode;
    treeData?: DataNode[];
    showLine?: boolean;
    showIcon?: boolean;
    icon?: IconType;
    focusable?: boolean;
    selectable?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    checkable?: boolean | React.ReactNode;
    checkStrictly?: boolean;
    draggable?: boolean;
    defaultExpandParent?: boolean;
    autoExpandParent?: boolean;
    defaultExpandAll?: boolean;
    defaultExpandedKeys?: Key[];
    expandedKeys?: Key[];
    defaultCheckedKeys?: Key[];
    checkedKeys: (Key)[] | {
        checked: (Key)[];
        halfChecked: Key[];
    };
    defaultSelectedKeys: Key[];
    selectedKeys: Key[];
    onClick: (e: React.MouseEvent, treeNode: DataNode) => void;
    onDoubleClick: (e: React.MouseEvent, treeNode: DataNode) => void;
    onExpand: (expandedKeys: Key[], info: {
        node: NodeElement;
        expanded: boolean;
        nativeEvent: MouseEvent;
    }) => void;
    onCheck: (checked: {
        checked: Key[];
        halfChecked: Key[];
    } | Key[], info: CheckInfo) => void;
    onSelect: (selectedKeys: Key[], info: {
        event: 'select';
        selected: boolean;
        node: NodeElement;
        selectedNodes: NodeElement[];
        nativeEvent: MouseEvent;
    }) => void;
    onLoad: (loadedKeys: Key[], info: {
        event: 'load';
        node: NodeElement;
    }) => void;
    loadData: (treeNode: NodeElement) => Promise<void>;
    loadedKeys: Key[];
    onMouseEnter: (info: {
        event: React.MouseEvent;
        node: NodeElement;
    }) => void;
    onMouseLeave: (info: {
        event: React.MouseEvent;
        node: NodeElement;
    }) => void;
    onRightClick: (info: {
        event: React.MouseEvent;
        node: NodeElement;
    }) => void;
    onDragStart: (info: {
        event: React.MouseEvent;
        node: NodeElement;
    }) => void;
    onDragEnter: (info: {
        event: React.MouseEvent;
        node: NodeElement;
        expandedKeys: Key[];
    }) => void;
    onDragOver: (info: {
        event: React.MouseEvent;
        node: NodeElement;
    }) => void;
    onDragLeave: (info: {
        event: React.MouseEvent;
        node: NodeElement;
    }) => void;
    onDragEnd: (info: {
        event: React.MouseEvent;
        node: NodeElement;
    }) => void;
    onDrop: (info: {
        event: React.MouseEvent;
        node: NodeElement;
        dragNode: NodeElement;
        dragNodesKeys: Key[];
        dropPosition: number;
        dropToGap: boolean;
    }) => void;
    filterTreeNode: (treeNode: React.Component<TreeNodeProps>) => boolean;
    motion: any;
    switcherIcon: IconType;
}
interface TreeState {
    keyEntities: Record<Key, Entity>;
    selectedKeys: Key[];
    checkedKeys: Key[];
    halfCheckedKeys: Key[];
    loadedKeys: Key[];
    loadingKeys: Key[];
    expandedKeys: Key[];
    dragNodesKeys: Key[];
    dragOverNodeKey: Key;
    dropPosition: number;
    treeNode: React.ReactNode;
    prevProps: TreeProps;
}
declare class Tree extends React.Component<TreeProps, TreeState> {
    static propTypes: {
        prefixCls: PropTypes.Requireable<string>;
        className: PropTypes.Requireable<string>;
        style: PropTypes.Requireable<object>;
        tabIndex: PropTypes.Requireable<string | number>;
        children: PropTypes.Requireable<any>;
        treeData: PropTypes.Requireable<any[]>;
        showLine: PropTypes.Requireable<boolean>;
        showIcon: PropTypes.Requireable<boolean>;
        icon: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        focusable: PropTypes.Requireable<boolean>;
        selectable: PropTypes.Requireable<boolean>;
        disabled: PropTypes.Requireable<boolean>;
        multiple: PropTypes.Requireable<boolean>;
        checkable: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        checkStrictly: PropTypes.Requireable<boolean>;
        draggable: PropTypes.Requireable<boolean>;
        defaultExpandParent: PropTypes.Requireable<boolean>;
        autoExpandParent: PropTypes.Requireable<boolean>;
        defaultExpandAll: PropTypes.Requireable<boolean>;
        defaultExpandedKeys: PropTypes.Requireable<string[]>;
        expandedKeys: PropTypes.Requireable<string[]>;
        defaultCheckedKeys: PropTypes.Requireable<string[]>;
        checkedKeys: PropTypes.Requireable<object>;
        defaultSelectedKeys: PropTypes.Requireable<string[]>;
        selectedKeys: PropTypes.Requireable<string[]>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        onDoubleClick: PropTypes.Requireable<(...args: any[]) => any>;
        onExpand: PropTypes.Requireable<(...args: any[]) => any>;
        onCheck: PropTypes.Requireable<(...args: any[]) => any>;
        onSelect: PropTypes.Requireable<(...args: any[]) => any>;
        onLoad: PropTypes.Requireable<(...args: any[]) => any>;
        loadData: PropTypes.Requireable<(...args: any[]) => any>;
        loadedKeys: PropTypes.Requireable<string[]>;
        onMouseEnter: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseLeave: PropTypes.Requireable<(...args: any[]) => any>;
        onRightClick: PropTypes.Requireable<(...args: any[]) => any>;
        onDragStart: PropTypes.Requireable<(...args: any[]) => any>;
        onDragEnter: PropTypes.Requireable<(...args: any[]) => any>;
        onDragOver: PropTypes.Requireable<(...args: any[]) => any>;
        onDragLeave: PropTypes.Requireable<(...args: any[]) => any>;
        onDragEnd: PropTypes.Requireable<(...args: any[]) => any>;
        onDrop: PropTypes.Requireable<(...args: any[]) => any>;
        filterTreeNode: PropTypes.Requireable<(...args: any[]) => any>;
        motion: PropTypes.Requireable<object>;
        switcherIcon: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    };
    static defaultProps: {
        prefixCls: string;
        showLine: boolean;
        showIcon: boolean;
        selectable: boolean;
        multiple: boolean;
        checkable: boolean;
        disabled: boolean;
        checkStrictly: boolean;
        draggable: boolean;
        defaultExpandParent: boolean;
        autoExpandParent: boolean;
        defaultExpandAll: boolean;
        defaultExpandedKeys: any[];
        defaultCheckedKeys: any[];
        defaultSelectedKeys: any[];
    };
    /** Internal usage for `rc-tree-select`, we don't promise it will not change. */
    domTreeNodes: Record<string | number, HTMLElement>;
    delayedDragEnterLogic: Record<Key, number>;
    state: {
        keyEntities: {};
        selectedKeys: any[];
        checkedKeys: any[];
        halfCheckedKeys: any[];
        loadedKeys: any[];
        loadingKeys: any[];
        expandedKeys: any[];
        dragNodesKeys: any[];
        dragOverNodeKey: any;
        dropPosition: any;
        treeNode: any[];
        prevProps: any;
    };
    dragNode: NodeElement;
    static getDerivedStateFromProps(props: any, prevState: any): Partial<TreeState>;
    onNodeDragStart: (event: any, node: any) => void;
    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    onNodeDragEnter: (event: any, node: any) => void;
    onNodeDragOver: (event: any, node: any) => void;
    onNodeDragLeave: (event: any, node: any) => void;
    onNodeDragEnd: (event: any, node: any) => void;
    onNodeDrop: (event: any, node: any) => void;
    onNodeClick: (e: any, treeNode: any) => void;
    onNodeDoubleClick: (e: any, treeNode: any) => void;
    onNodeSelect: (e: any, treeNode: any) => void;
    onNodeCheck: (e: any, treeNode: any, checked: any) => void;
    onNodeLoad: (treeNode: any) => Promise<unknown>;
    onNodeExpand: (e: any, treeNode: any) => Promise<void>;
    onNodeMouseEnter: (event: any, node: any) => void;
    onNodeMouseLeave: (event: any, node: any) => void;
    onNodeContextMenu: (event: any, node: any) => void;
    /**
     * Only update the value which is not in props
     */
    setUncontrolledState: (state: any) => void;
    registerTreeNode: (key: any, node: any) => void;
    isKeyChecked: (key: any) => boolean;
    /**
     * [Legacy] Original logic use `key` as tracking clue.
     * We have to use `cloneElement` to pass `key`.
     */
    renderTreeNode: (child: any, index: any, level?: number) => React.FunctionComponentElement<{
        key: any;
        eventKey: any;
        expanded: boolean;
        selected: boolean;
        loaded: boolean;
        loading: boolean;
        checked: boolean;
        halfChecked: boolean;
        pos: string;
        dragOver: boolean;
        dragOverGapTop: boolean;
        dragOverGapBottom: boolean;
    }>;
    render(): JSX.Element;
}
export default Tree;

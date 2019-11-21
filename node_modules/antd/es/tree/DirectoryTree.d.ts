import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
import Tree, { TreeProps, AntTreeNodeExpandedEvent, AntTreeNodeSelectedEvent, AntTreeNode } from './Tree';
export declare type ExpandAction = false | 'click' | 'doubleClick';
export interface DirectoryTreeProps extends TreeProps {
    expandAction?: ExpandAction;
}
export interface DirectoryTreeState {
    expandedKeys?: string[];
    selectedKeys?: string[];
}
declare class DirectoryTree extends React.Component<DirectoryTreeProps, DirectoryTreeState> {
    static defaultProps: {
        showIcon: boolean;
        expandAction: string;
    };
    static getDerivedStateFromProps(nextProps: DirectoryTreeProps): DirectoryTreeState;
    state: DirectoryTreeState;
    tree: Tree;
    onDebounceExpand: (event: React.MouseEvent<HTMLElement>, node: AntTreeNode) => void;
    lastSelectedKey?: string;
    cachedSelectedKeys?: string[];
    constructor(props: DirectoryTreeProps);
    onExpand: (expandedKeys: string[], info: AntTreeNodeExpandedEvent) => void | PromiseLike<void>;
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>, node: AntTreeNode) => void;
    onDoubleClick: (event: React.MouseEvent<HTMLElement, MouseEvent>, node: AntTreeNode) => void;
    onSelect: (keys: string[], event: AntTreeNodeSelectedEvent) => void;
    setTreeRef: (node: Tree) => void;
    expandFolderNode: (event: React.MouseEvent<HTMLElement, MouseEvent>, node: AntTreeNode) => void;
    setUncontrolledState: (state: DirectoryTreeState) => void;
    renderDirectoryTree: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default DirectoryTree;

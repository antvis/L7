import * as React from 'react';
import { TreeSelectProps, TreeNodeValue } from './interface';
import { ConfigConsumerProps } from '../config-provider';
import { AntTreeNodeProps } from '../tree';
export { TreeNode, TreeSelectProps } from './interface';
export default class TreeSelect<T extends TreeNodeValue> extends React.Component<TreeSelectProps<T>, any> {
    static TreeNode: any;
    static SHOW_ALL: any;
    static SHOW_PARENT: any;
    static SHOW_CHILD: any;
    static defaultProps: {
        transitionName: string;
        choiceTransitionName: string;
    };
    private rcTreeSelect;
    constructor(props: TreeSelectProps<T>);
    saveTreeSelect: (node: any) => void;
    focus(): void;
    blur(): void;
    renderSwitcherIcon: (prefixCls: string, { isLeaf, loading }: AntTreeNodeProps) => JSX.Element | null;
    renderTreeSelect: ({ getPopupContainer: getContextPopupContainer, getPrefixCls, renderEmpty, }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}

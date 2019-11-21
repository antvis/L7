import React from 'react';
import { Map, List } from 'immutable';
import { Plugin } from '../EditorCore';
import { EditorState } from 'draft-js';
export interface ToolbarProps {
    plugins: List<Plugin>;
    toolbars: any[];
    prefixCls: string;
    className: string;
    editorState: EditorState;
}
export default class Toolbar extends React.Component<ToolbarProps, any> {
    pluginsMap: Map<any, any>;
    constructor(props: any);
    renderToolbarItem(pluginName: any, idx: any): any;
    conpomentWillReceiveProps(nextProps: any): void;
    render(): any;
}

import * as React from 'react';
import { IconExpandEventHandler } from './interface';
export interface ExpandIconProps<ValueType> {
    record?: ValueType;
    prefixCls?: string;
    expandable?: boolean;
    expanded?: boolean;
    needIndentSpaced?: boolean;
    onExpand?: IconExpandEventHandler<ValueType>;
}
export default class ExpandIcon<ValueType> extends React.Component<ExpandIconProps<ValueType>> {
    shouldComponentUpdate(nextProps: ExpandIconProps<ValueType>): boolean;
    render(): JSX.Element;
}

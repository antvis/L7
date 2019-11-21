import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
export default class BreadcrumbSeparator extends React.Component<any> {
    static __ANT_BREADCRUMB_SEPARATOR: boolean;
    renderSeparator: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}

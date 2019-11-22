import * as React from 'react';
import { RenderEmptyHandler } from './renderEmpty';
import { Locale } from '../locale-provider';
export interface CSPConfig {
    nonce?: string;
}
export interface ConfigConsumerProps {
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    rootPrefixCls?: string;
    getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
    renderEmpty: RenderEmptyHandler;
    csp?: CSPConfig;
    autoInsertSpaceInButton?: boolean;
    locale?: Locale;
    pageHeader?: {
        ghost: boolean;
    };
}
export declare const ConfigContext: import("@ant-design/create-react-context").Context<ConfigConsumerProps>;
export declare const ConfigConsumer: React.ComponentClass<import("@ant-design/create-react-context").ConsumerProps<ConfigConsumerProps>, any>;
declare type IReactComponent<P = any> = React.StatelessComponent<P> | React.ComponentClass<P> | React.ClassicComponentClass<P>;
interface BasicExportProps {
    prefixCls?: string;
}
interface ConsumerConfig {
    prefixCls: string;
}
export declare function withConfigConsumer<ExportProps extends BasicExportProps>(config: ConsumerConfig): <ComponentDef>(Component: IReactComponent<any>) => React.SFC<ExportProps> & ComponentDef;
export {};

import * as React from 'react';
import { RenderEmptyHandler } from './renderEmpty';
import { Locale } from '../locale-provider';
import { ConfigConsumer, CSPConfig, ConfigConsumerProps } from './context';
export { RenderEmptyHandler, ConfigConsumer, CSPConfig, ConfigConsumerProps };
export declare const configConsumerProps: string[];
export interface ConfigProviderProps {
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    prefixCls?: string;
    children?: React.ReactNode;
    renderEmpty?: RenderEmptyHandler;
    csp?: CSPConfig;
    autoInsertSpaceInButton?: boolean;
    locale?: Locale;
    pageHeader?: {
        ghost: boolean;
    };
}
declare class ConfigProvider extends React.Component<ConfigProviderProps> {
    getPrefixCls: (suffixCls: string, customizePrefixCls?: string | undefined) => string;
    renderProvider: (context: ConfigConsumerProps, legacyLocale: Locale) => JSX.Element;
    render(): JSX.Element;
}
export default ConfigProvider;

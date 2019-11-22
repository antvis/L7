import * as React from 'react';
import Input, { InputProps } from './Input';
import { ConfigConsumerProps } from '../config-provider';
export interface SearchProps extends InputProps {
    inputPrefixCls?: string;
    onSearch?: (value: string, event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => void;
    enterButton?: React.ReactNode;
    loading?: boolean;
}
export default class Search extends React.Component<SearchProps, any> {
    static defaultProps: {
        enterButton: boolean;
    };
    private input;
    saveInput: (node: Input) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: (e: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
    focus(): void;
    blur(): void;
    renderLoading: (prefixCls: string) => JSX.Element;
    renderSuffix: (prefixCls: string) => {} | null | undefined;
    renderAddonAfter: (prefixCls: string) => {} | null | undefined;
    renderSearch: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}

import * as React from 'react';
import Input, { InputProps } from './Input';
export interface PasswordProps extends InputProps {
    readonly inputPrefixCls?: string;
    readonly action?: string;
    visibilityToggle?: boolean;
}
export interface PasswordState {
    visible: boolean;
}
export default class Password extends React.Component<PasswordProps, PasswordState> {
    input: HTMLInputElement;
    static defaultProps: {
        inputPrefixCls: string;
        prefixCls: string;
        action: string;
        visibilityToggle: boolean;
    };
    state: PasswordState;
    onChange: () => void;
    getIcon(): JSX.Element;
    saveInput: (instance: Input) => void;
    focus(): void;
    blur(): void;
    select(): void;
    render(): JSX.Element;
}

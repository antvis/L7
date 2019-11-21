import * as React from 'react';
import * as PropTypes from 'prop-types';
import Group from './Group';
import Search from './Search';
import TextArea from './TextArea';
import Password from './Password';
import { Omit } from '../_util/type';
import ClearableLabeledInput from './ClearableLabeledInput';
import { ConfigConsumerProps } from '../config-provider';
export declare const InputSizes: ["small", "default", "large"];
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    prefixCls?: string;
    size?: (typeof InputSizes)[number];
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean;
}
export declare function fixControlledValue<T>(value: T): "" | T;
export declare function resolveOnChange(target: HTMLInputElement | HTMLTextAreaElement, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | React.MouseEvent<HTMLElement, MouseEvent>, onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void): void;
export declare function getInputClassName(prefixCls: string, size?: (typeof InputSizes)[number], disabled?: boolean): string;
export interface InputState {
    value: any;
}
declare class Input extends React.Component<InputProps, InputState> {
    static Group: typeof Group;
    static Search: typeof Search;
    static TextArea: typeof TextArea;
    static Password: typeof Password;
    static defaultProps: {
        type: string;
    };
    static propTypes: {
        type: PropTypes.Requireable<string>;
        id: PropTypes.Requireable<string>;
        size: PropTypes.Requireable<"small" | "default" | "large">;
        maxLength: PropTypes.Requireable<number>;
        disabled: PropTypes.Requireable<boolean>;
        value: PropTypes.Requireable<any>;
        defaultValue: PropTypes.Requireable<any>;
        className: PropTypes.Requireable<string>;
        addonBefore: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        addonAfter: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        prefixCls: PropTypes.Requireable<string>;
        onPressEnter: PropTypes.Requireable<(...args: any[]) => any>;
        onKeyDown: PropTypes.Requireable<(...args: any[]) => any>;
        onKeyUp: PropTypes.Requireable<(...args: any[]) => any>;
        onFocus: PropTypes.Requireable<(...args: any[]) => any>;
        onBlur: PropTypes.Requireable<(...args: any[]) => any>;
        prefix: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        suffix: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        allowClear: PropTypes.Requireable<boolean>;
    };
    input: HTMLInputElement;
    clearableInput: ClearableLabeledInput;
    constructor(props: InputProps);
    static getDerivedStateFromProps(nextProps: InputProps): {
        value: string | number | string[] | undefined;
    } | null;
    componentDidUpdate(): void;
    getSnapshotBeforeUpdate(prevProps: InputProps): null;
    focus(): void;
    blur(): void;
    select(): void;
    saveClearableInput: (input: ClearableLabeledInput) => void;
    saveInput: (input: HTMLInputElement) => void;
    setValue(value: string, callback?: () => void): void;
    handleReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    renderInput: (prefixCls: string) => JSX.Element;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    renderComponent: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default Input;

import * as React from 'react';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea, { AutoSizeType } from './ResizableTextArea';
import { ConfigConsumerProps } from '../config-provider';
export declare type HTMLTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export interface TextAreaProps extends HTMLTextareaProps {
    prefixCls?: string;
    autosize?: boolean | AutoSizeType;
    autoSize?: boolean | AutoSizeType;
    onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    allowClear?: boolean;
}
export interface TextAreaState {
    value: any;
}
declare class TextArea extends React.Component<TextAreaProps, TextAreaState> {
    resizableTextArea: ResizableTextArea;
    clearableInput: ClearableLabeledInput;
    constructor(props: TextAreaProps);
    static getDerivedStateFromProps(nextProps: TextAreaProps): {
        value: string | number | string[] | undefined;
    } | null;
    setValue(value: string, callback?: () => void): void;
    focus(): void;
    blur(): void;
    saveTextArea: (resizableTextArea: ResizableTextArea) => void;
    saveClearableInput: (clearableInput: ClearableLabeledInput) => void;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    renderTextArea: (prefixCls: string) => JSX.Element;
    renderComponent: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default TextArea;

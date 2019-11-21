import * as React from 'react';
import { InputProps, InputSizes } from './Input';
declare const ClearableInputType: ["text", "input"];
export declare function hasPrefixSuffix(props: InputProps | ClearableInputProps): boolean;
/**
 * This basic props required for input and textarea.
 */
interface BasicProps {
    prefixCls: string;
    inputType: (typeof ClearableInputType)[number];
    value?: any;
    defaultValue?: any;
    allowClear?: boolean;
    element: React.ReactElement<any>;
    handleReset: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    className?: string;
    style?: object;
    disabled?: boolean;
}
/**
 * This props only for input.
 */
interface ClearableInputProps extends BasicProps {
    size?: (typeof InputSizes)[number];
    suffix?: React.ReactNode;
    prefix?: React.ReactNode;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
}
declare class ClearableLabeledInput extends React.Component<ClearableInputProps> {
    renderClearIcon(prefixCls: string): JSX.Element | null;
    renderSuffix(prefixCls: string): JSX.Element | null;
    renderLabeledIcon(prefixCls: string, element: React.ReactElement<any>): JSX.Element;
    renderInputWithLabel(prefixCls: string, labeledElement: React.ReactElement<any>): JSX.Element;
    renderTextAreaWithClearIcon(prefixCls: string, element: React.ReactElement<any>): JSX.Element;
    renderClearableLabeledInput(): JSX.Element;
    render(): JSX.Element;
}
export default ClearableLabeledInput;

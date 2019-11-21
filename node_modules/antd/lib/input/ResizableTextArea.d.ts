import * as React from 'react';
import { TextAreaProps } from './TextArea';
export interface AutoSizeType {
    minRows?: number;
    maxRows?: number;
}
export interface TextAreaState {
    textareaStyles?: React.CSSProperties;
    /** We need add process style to disable scroll first and then add back to avoid unexpected scrollbar  */
    resizing?: boolean;
}
declare class ResizableTextArea extends React.Component<TextAreaProps, TextAreaState> {
    nextFrameActionId: number;
    resizeFrameId: number;
    constructor(props: TextAreaProps);
    textArea: HTMLTextAreaElement;
    saveTextArea: (textArea: HTMLTextAreaElement) => void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: TextAreaProps): void;
    resizeOnNextFrame: () => void;
    resizeTextarea: () => void;
    componentWillUnmount(): void;
    renderTextArea: () => JSX.Element;
    render(): JSX.Element;
}
export default ResizableTextArea;

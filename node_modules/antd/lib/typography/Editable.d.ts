import * as React from 'react';
import TextArea from '../input/TextArea';
interface EditableProps {
    prefixCls?: string;
    value?: string;
    ['aria-label']?: string;
    onSave: (value: string) => void;
    onCancel: () => void;
    className?: string;
    style?: React.CSSProperties;
}
interface EditableState {
    current: string;
    prevValue?: string;
}
declare class Editable extends React.Component<EditableProps, EditableState> {
    static getDerivedStateFromProps(nextProps: EditableProps, prevState: EditableState): Partial<EditableState>;
    textarea?: TextArea;
    lastKeyCode?: number;
    inComposition?: boolean;
    state: {
        current: string;
    };
    componentDidMount(): void;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onCompositionStart: () => void;
    onCompositionEnd: () => void;
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
    confirmChange: () => void;
    setTextarea: (textarea: TextArea) => void;
    render(): JSX.Element;
}
export default Editable;

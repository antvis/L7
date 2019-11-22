import * as React from 'react';
import { OptionProps } from './Option';
import { filterOption as defaultFilterOption, Omit, validateSearch as defaultValidateSearch } from './util';
declare type BaseTextareaAttrs = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix' | 'onChange' | 'onSelect'>;
export declare type Placement = 'top' | 'bottom';
export interface MentionsProps extends BaseTextareaAttrs {
    autoFocus?: boolean;
    className?: string;
    defaultValue?: string;
    notFoundContent?: React.ReactNode;
    split?: string;
    style?: React.CSSProperties;
    transitionName?: string;
    placement?: Placement;
    prefix?: string | string[];
    prefixCls?: string;
    value?: string;
    filterOption?: false | typeof defaultFilterOption;
    validateSearch?: typeof defaultValidateSearch;
    onChange?: (text: string) => void;
    onSelect?: (option: OptionProps, prefix: string) => void;
    onSearch?: (text: string, prefix: string) => void;
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    getPopupContainer?: () => HTMLElement;
}
interface MentionsState {
    value: string;
    measuring: boolean;
    measureText: string | null;
    measurePrefix: string;
    measureLocation: number;
    activeIndex: number;
    isFocus: boolean;
}
declare class Mentions extends React.Component<MentionsProps, MentionsState> {
    static Option: React.FunctionComponent<OptionProps>;
    static defaultProps: {
        prefixCls: string;
        prefix: string;
        split: string;
        validateSearch: typeof defaultValidateSearch;
        filterOption: typeof defaultFilterOption;
        notFoundContent: string;
        rows: number;
    };
    static getDerivedStateFromProps(props: MentionsProps, prevState: MentionsState): Partial<MentionsState>;
    textarea?: HTMLTextAreaElement;
    measure?: HTMLDivElement;
    focusId: number | undefined;
    constructor(props: MentionsProps);
    componentDidUpdate(): void;
    triggerChange: (value: string) => void;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
    /**
     * When to start measure:
     * 1. When user press `prefix`
     * 2. When measureText !== prevMeasureText
     *  - If measure hit
     *  - If measuring
     *
     * When to stop measure:
     * 1. Selection is out of range
     * 2. Contains `space`
     * 3. ESC or select one
     */
    onKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onInputFocus: React.FocusEventHandler<HTMLTextAreaElement>;
    onInputBlur: React.FocusEventHandler<HTMLTextAreaElement>;
    onDropdownFocus: () => void;
    onDropdownBlur: () => void;
    onFocus: (event?: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur: (event?: React.FocusEvent<HTMLTextAreaElement>) => void;
    selectOption: (option: OptionProps) => void;
    setActiveIndex: (activeIndex: number) => void;
    setTextAreaRef: (element: HTMLTextAreaElement) => void;
    setMeasureRef: (element: HTMLDivElement) => void;
    getOptions: (measureText?: string) => OptionProps[];
    startMeasure(measureText: string, measurePrefix: string, measureLocation: number): void;
    stopMeasure(callback?: () => void): void;
    focus(): void;
    blur(): void;
    render(): JSX.Element;
}
export default Mentions;

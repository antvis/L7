import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ConfigConsumerProps, RenderEmptyHandler } from '../config-provider';
declare const SelectSizes: ["default", "large", "small"];
export interface AbstractSelectProps {
    prefixCls?: string;
    className?: string;
    showAction?: string | string[];
    size?: (typeof SelectSizes)[number];
    notFoundContent?: React.ReactNode | null;
    transitionName?: string;
    choiceTransitionName?: string;
    showSearch?: boolean;
    allowClear?: boolean;
    disabled?: boolean;
    showArrow?: boolean;
    style?: React.CSSProperties;
    tabIndex?: number;
    placeholder?: string | React.ReactNode;
    defaultActiveFirstOption?: boolean;
    dropdownClassName?: string;
    dropdownStyle?: React.CSSProperties;
    dropdownMenuStyle?: React.CSSProperties;
    dropdownMatchSelectWidth?: boolean;
    onSearch?: (value: string) => void;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    filterOption?: boolean | ((inputValue: string, option: React.ReactElement<OptionProps>) => boolean);
    id?: string;
    defaultOpen?: boolean;
    open?: boolean;
    onDropdownVisibleChange?: (open: boolean) => void;
    autoClearSearchValue?: boolean;
    dropdownRender?: (menu?: React.ReactNode, props?: SelectProps) => React.ReactNode;
    loading?: boolean;
}
export interface LabeledValue {
    key: string;
    label: React.ReactNode;
}
export declare type SelectValue = string | string[] | number | number[] | LabeledValue | LabeledValue[];
declare const ModeOptions: ["default", "multiple", "tags", "combobox", "SECRET_COMBOBOX_MODE_DO_NOT_USE"];
export declare type ModeOption = (typeof ModeOptions)[number];
export interface SelectProps<T = SelectValue> extends AbstractSelectProps {
    value?: T;
    defaultValue?: T;
    mode?: ModeOption;
    optionLabelProp?: string;
    firstActiveValue?: string | string[];
    onChange?: (value: T, option: React.ReactElement<any> | React.ReactElement<any>[]) => void;
    onSelect?: (value: T extends (infer I)[] ? I : T, option: React.ReactElement<any>) => void;
    onDeselect?: (value: T extends (infer I)[] ? I : T) => void;
    onBlur?: (value: T) => void;
    onFocus?: () => void;
    onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
    onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => void;
    maxTagCount?: number;
    maxTagTextLength?: number;
    maxTagPlaceholder?: React.ReactNode | ((omittedValues: T[]) => React.ReactNode);
    optionFilterProp?: string;
    labelInValue?: boolean;
    tokenSeparators?: string[];
    getInputElement?: () => React.ReactElement<any>;
    autoFocus?: boolean;
    suffixIcon?: React.ReactNode;
    removeIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
    menuItemSelectedIcon?: React.ReactNode;
}
export interface OptionProps {
    disabled?: boolean;
    value?: string | number;
    title?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
export interface OptGroupProps {
    label?: React.ReactNode;
}
export interface SelectLocale {
    notFoundContent?: string;
}
export default class Select<T = SelectValue> extends React.Component<SelectProps<T>, {}> {
    static Option: React.ClassicComponentClass<OptionProps>;
    static OptGroup: React.ClassicComponentClass<OptGroupProps>;
    static SECRET_COMBOBOX_MODE_DO_NOT_USE: ModeOption;
    static defaultProps: {
        showSearch: boolean;
        transitionName: string;
        choiceTransitionName: string;
    };
    static propTypes: {
        prefixCls: PropTypes.Requireable<string>;
        className: PropTypes.Requireable<string>;
        size: PropTypes.Requireable<"small" | "default" | "large">;
        notFoundContent: PropTypes.Requireable<any>;
        showSearch: PropTypes.Requireable<boolean>;
        optionLabelProp: PropTypes.Requireable<string>;
        transitionName: PropTypes.Requireable<string>;
        choiceTransitionName: PropTypes.Requireable<string>;
        id: PropTypes.Requireable<string>;
    };
    private rcSelect;
    constructor(props: SelectProps<T>);
    getNotFoundContent(renderEmpty: RenderEmptyHandler): {} | null | undefined;
    saveSelect: (node: any) => void;
    focus(): void;
    blur(): void;
    isCombobox(): boolean;
    renderSuffixIcon(prefixCls: string): {};
    renderSelect: ({ getPopupContainer: getContextPopupContainer, getPrefixCls, renderEmpty, }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export {};

import * as React from 'react';
import { OptionProps } from './Option';
import { Placement } from './Mentions';
interface KeywordTriggerProps {
    loading?: boolean;
    options: OptionProps[];
    prefixCls?: string;
    placement?: Placement;
    visible?: boolean;
    transitionName?: string;
    getPopupContainer?: () => HTMLElement;
}
declare class KeywordTrigger extends React.Component<KeywordTriggerProps, {}> {
    getDropdownPrefix: () => string;
    getDropdownElement: () => JSX.Element;
    render(): JSX.Element;
}
export default KeywordTrigger;

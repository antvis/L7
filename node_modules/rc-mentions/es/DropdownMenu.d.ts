import * as React from 'react';
import { MentionsContextProps } from './MentionsContext';
import { OptionProps } from './Option';
interface DropdownMenuProps {
    prefixCls?: string;
    options: OptionProps[];
}
/**
 * We only use Menu to display the candidate.
 * The focus is controlled by textarea to make accessibility easy.
 */
declare class DropdownMenu extends React.Component<DropdownMenuProps, {}> {
    renderDropdown: ({ notFoundContent, activeIndex, setActiveIndex, selectOption, onFocus, onBlur, }: MentionsContextProps) => JSX.Element;
    render(): JSX.Element;
}
export default DropdownMenu;

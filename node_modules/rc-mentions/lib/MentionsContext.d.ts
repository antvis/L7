import * as React from 'react';
import { OptionProps } from './Option';
export interface MentionsContextProps {
    notFoundContent: React.ReactNode;
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    selectOption: (option: OptionProps) => void;
    onFocus: React.FocusEventHandler<HTMLElement>;
    onBlur: React.FocusEventHandler<HTMLElement>;
}
export declare const MentionsContextProvider: React.ComponentClass<import("@ant-design/create-react-context").ProviderProps<MentionsContextProps>, any>;
export declare const MentionsContextConsumer: React.ComponentClass<import("@ant-design/create-react-context").ConsumerProps<MentionsContextProps>, any>;

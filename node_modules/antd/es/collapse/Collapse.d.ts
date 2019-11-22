import * as React from 'react';
import CollapsePanel from './CollapsePanel';
import { ConfigConsumerProps } from '../config-provider';
export declare type ExpandIconPosition = 'left' | 'right';
export interface CollapseProps {
    activeKey?: Array<string | number> | string | number;
    defaultActiveKey?: Array<string | number> | string | number;
    /** 手风琴效果 */
    accordion?: boolean;
    destroyInactivePanel?: boolean;
    onChange?: (key: string | string[]) => void;
    style?: React.CSSProperties;
    className?: string;
    bordered?: boolean;
    prefixCls?: string;
    expandIcon?: (panelProps: PanelProps) => React.ReactNode;
    expandIconPosition?: ExpandIconPosition;
}
interface PanelProps {
    isActive?: boolean;
    header?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    showArrow?: boolean;
    forceRender?: boolean;
    disabled?: boolean;
    extra?: React.ReactNode;
}
export default class Collapse extends React.Component<CollapseProps, any> {
    static Panel: typeof CollapsePanel;
    static defaultProps: {
        bordered: boolean;
        openAnimation: {
            appear(): void;
            enter(node: HTMLElement, done: () => void): any;
            leave(node: HTMLElement, done: () => void): any;
        };
        expandIconPosition: string;
    };
    renderExpandIcon: (panelProps: PanelProps | undefined, prefixCls: string) => {} | null | undefined;
    renderCollapse: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export {};

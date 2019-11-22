import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
declare function getDefaultTarget(): (Window & typeof globalThis) | null;
export interface AffixProps {
    /**
     * 距离窗口顶部达到指定偏移量后触发
     */
    offsetTop?: number;
    offset?: number;
    /** 距离窗口底部达到指定偏移量后触发 */
    offsetBottom?: number;
    style?: React.CSSProperties;
    /** 固定状态改变时触发的回调函数 */
    onChange?: (affixed?: boolean) => void;
    /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
    target?: () => Window | HTMLElement | null;
    prefixCls?: string;
    className?: string;
    children: React.ReactElement;
}
declare enum AffixStatus {
    None = 0,
    Prepare = 1
}
export interface AffixState {
    affixStyle?: React.CSSProperties;
    placeholderStyle?: React.CSSProperties;
    status: AffixStatus;
    lastAffix: boolean;
    prevTarget: Window | HTMLElement | null;
}
declare class Affix extends React.Component<AffixProps, AffixState> {
    static defaultProps: {
        target: typeof getDefaultTarget;
    };
    state: AffixState;
    placeholderNode: HTMLDivElement;
    fixedNode: HTMLDivElement;
    private timeout;
    componentDidMount(): void;
    componentDidUpdate(prevProps: AffixProps): void;
    componentWillUnmount(): void;
    getOffsetTop: () => number | undefined;
    getOffsetBottom: () => number | undefined;
    savePlaceholderNode: (node: HTMLDivElement) => void;
    saveFixedNode: (node: HTMLDivElement) => void;
    measure: () => void;
    prepareMeasure: () => void;
    updatePosition(): void;
    lazyUpdatePosition(): void;
    renderAffix: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default Affix;

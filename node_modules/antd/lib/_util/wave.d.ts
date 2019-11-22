import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
export default class Wave extends React.Component<{
    insertExtraNode?: boolean;
}> {
    private instance?;
    private extraNode;
    private clickWaveTimeoutId;
    private animationStartId;
    private animationStart;
    private destroy;
    private csp?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onClick: (node: HTMLElement, waveColor: string) => void;
    onTransitionStart: (e: AnimationEvent) => void;
    onTransitionEnd: (e: AnimationEvent) => void;
    getAttributeName(): "ant-click-animating" | "ant-click-animating-without-extra-node";
    bindAnimationEvent: (node: HTMLElement) => {
        cancel: () => void;
    } | undefined;
    resetEffect(node: HTMLElement): void;
    renderWave: ({ csp }: ConfigConsumerProps) => React.ReactNode;
    render(): JSX.Element;
}

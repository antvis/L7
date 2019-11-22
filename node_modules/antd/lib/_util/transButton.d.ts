/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import * as React from 'react';
interface TransButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
    noStyle?: boolean;
}
declare class TransButton extends React.Component<TransButtonProps> {
    div?: HTMLDivElement;
    lastKeyCode?: number;
    onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyUp: React.KeyboardEventHandler<HTMLDivElement>;
    setRef: (btn: HTMLDivElement) => void;
    focus(): void;
    blur(): void;
    render(): JSX.Element;
}
export default TransButton;

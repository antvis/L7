import * as React from 'react';
export interface SkeletonAvatarProps {
    prefixCls?: string;
    className?: string;
    style?: object;
    size?: 'large' | 'small' | 'default' | number;
    shape?: 'circle' | 'square';
}
declare class SkeletonAvatar extends React.Component<SkeletonAvatarProps, any> {
    static defaultProps: Partial<SkeletonAvatarProps>;
    render(): JSX.Element;
}
export default SkeletonAvatar;

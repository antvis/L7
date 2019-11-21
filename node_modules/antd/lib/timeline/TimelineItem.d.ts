import * as React from 'react';
export interface TimeLineItemProps {
    prefixCls?: string;
    className?: string;
    color?: string;
    dot?: React.ReactNode;
    pending?: boolean;
    position?: string;
    style?: React.CSSProperties;
}
declare const TimelineItem: React.SFC<TimeLineItemProps>;
export default TimelineItem;

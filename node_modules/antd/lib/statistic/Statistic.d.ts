import * as React from 'react';
import Countdown from './Countdown';
import { valueType, FormatConfig } from './utils';
interface StatisticComponent {
    Countdown: typeof Countdown;
}
export interface StatisticProps extends FormatConfig {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    value?: valueType;
    valueStyle?: React.CSSProperties;
    valueRender?: (node: React.ReactNode) => React.ReactNode;
    title?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}
declare const WrapperStatistic: React.SFC<StatisticProps> & StatisticComponent;
export default WrapperStatistic;

import * as React from 'react';
import { valueType, FormatConfig } from './utils';
interface NumberProps extends FormatConfig {
    value: valueType;
}
declare const StatisticNumber: React.SFC<NumberProps>;
export default StatisticNumber;

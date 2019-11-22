import * as React from 'react';
import { DescriptionsItemProps } from './index';
interface ColProps {
    child: React.ReactElement<DescriptionsItemProps>;
    bordered: boolean;
    colon: boolean;
    type?: 'label' | 'content';
    layout?: 'horizontal' | 'vertical';
}
declare const Col: React.SFC<ColProps>;
export default Col;

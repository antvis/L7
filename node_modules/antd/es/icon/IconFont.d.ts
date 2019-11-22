import * as React from 'react';
import { IconProps } from './index';
export interface CustomIconOptions {
    scriptUrl?: string;
    extraCommonProps?: {
        [key: string]: any;
    };
}
export default function create(options?: CustomIconOptions): React.SFC<IconProps>;

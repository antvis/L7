import { FunctionComponent } from 'react';
export interface BadgeProps {
    status: 'positive' | 'negative' | 'neutral' | 'warning' | 'critical';
}
export declare const Badge: FunctionComponent<BadgeProps>;

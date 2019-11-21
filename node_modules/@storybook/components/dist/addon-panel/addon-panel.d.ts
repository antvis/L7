import { ReactNode } from 'react';
export interface AddonPanelProps {
    active: boolean;
    children: ReactNode;
}
export declare const AddonPanel: ({ active, children }: AddonPanelProps) => JSX.Element;

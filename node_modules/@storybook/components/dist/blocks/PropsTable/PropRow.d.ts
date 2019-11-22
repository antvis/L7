import React from 'react';
import { PropDef } from './PropDef';
interface PrettyPropTypeProps {
    type: any;
}
interface PrettyPropValProps {
    value: any;
}
interface PropRowProps {
    row: PropDef;
}
export declare const PrettyPropType: React.FunctionComponent<PrettyPropTypeProps>;
export declare const PrettyPropVal: React.FunctionComponent<PrettyPropValProps>;
export declare const PropRow: React.FunctionComponent<PropRowProps>;
export {};

import { FunctionComponent } from 'react';
import { KnobControlConfig, KnobControlProps } from './types';
export declare type ButtonTypeKnob = KnobControlConfig<never>;
export interface ButtonTypeProps extends KnobControlProps<never> {
    knob: ButtonTypeKnob;
    onClick: ButtonTypeOnClickProp;
}
export declare type ButtonTypeOnClickProp = (knob: ButtonTypeKnob) => any;
declare const serialize: () => undefined;
declare const deserialize: () => undefined;
declare const ButtonType: FunctionComponent<ButtonTypeProps> & {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
};
export default ButtonType;
